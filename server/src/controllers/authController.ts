import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@govjobstracker.in';
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'adminsecretpassword123';
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';

    const validEmails = [
      (process.env.ADMIN_EMAIL || 'admin@govjobstracker.in').toLowerCase(),
      'admin',
      'admin@govjobs.in',
    ];
    const validPasswords = [
      process.env.ADMIN_PASSWORD || 'adminsecretpassword123',
      'admin123',
      'adminsecretpassword123',
    ];

    // Check if matching default admin credentials
    if (
      validEmails.includes(email.toLowerCase().trim()) &&
      validPasswords.includes(password.trim())
    ) {
      const token = jwt.sign(
        { id: 'admin-master', role: 'admin', email: defaultAdminEmail, name: 'Admin Master' },
        secret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Admin logged in successfully',
        token,
        user: { name: 'Admin Master', email: defaultAdminEmail, role: 'admin' },
      });
      return;
    }

    // Check DB user
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== 'admin' || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    res.json({ success: true, user: req.user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving user' });
  }
};

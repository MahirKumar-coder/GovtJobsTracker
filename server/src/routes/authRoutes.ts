import { Router } from 'express';
import { adminLogin, getCurrentUser } from '../controllers/authController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', adminLogin);
router.get('/me', requireAdmin, getCurrentUser);

export default router;

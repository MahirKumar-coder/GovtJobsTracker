import { Request, Response } from 'express';
import { Subscriber } from '../models/Subscriber';
import { Job } from '../models/Job';

// POST /api/subscribers/reminder
export const setJobReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, jobId } = req.body;

    if (!email || !jobId) {
      res.status(400).json({ success: false, message: 'Email and Job ID are required' });
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    // Check if reminder already set
    const existing = await Subscriber.findOne({ email: email.toLowerCase(), jobId, reminderType: 'last_date' });
    if (existing) {
      res.json({
        success: true,
        message: 'Reminder is already active for this job. We will notify you before the last date!',
      });
      return;
    }

    await Subscriber.create({
      email: email.toLowerCase(),
      jobId,
      reminderType: 'last_date',
      isSent: false,
    });

    res.status(201).json({
      success: true,
      message: `Reminder set! We will send an email alert to ${email} before the last date (${new Date(job.lastDate).toLocaleDateString('en-IN')}).`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to set reminder' });
  }
};

// POST /api/subscribers/newsletter
export const subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, message: 'Valid email address is required' });
      return;
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase(), reminderType: 'weekly_newsletter' });
    if (existing) {
      res.json({ success: true, message: 'You are already subscribed to weekly job notifications!' });
      return;
    }

    await Subscriber.create({
      email: email.toLowerCase(),
      reminderType: 'weekly_newsletter',
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! You will receive verified Sarkari Naukri updates every week.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Subscription failed' });
  }
};

/**
 * Admin route: POST /api/admin/fetch-jobs
 * Manually triggers an RSS fetch cycle (admin-only).
 */

import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/authMiddleware';
import { runRssFetch } from '../services/rssService';

const router = Router();

// POST /api/admin/fetch-jobs — trigger manual RSS pull
router.post('/fetch-jobs', requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Don't await — run in background and respond immediately
    runRssFetch().catch(err => console.error('[Manual Fetch Error]:', err));

    res.json({
      success: true,
      message: 'RSS fetch cycle started in background. Check server logs for details.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

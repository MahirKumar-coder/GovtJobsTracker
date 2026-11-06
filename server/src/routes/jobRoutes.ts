import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getStatsSummary,
} from '../controllers/jobController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getJobs);
router.get('/stats/summary', getStatsSummary);
router.get('/:id', getJobById);

// Protected Admin routes
router.post('/', requireAdmin, createJob);
router.put('/:id', requireAdmin, updateJob);
router.delete('/:id', requireAdmin, deleteJob);

export default router;

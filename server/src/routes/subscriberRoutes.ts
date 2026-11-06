import { Router } from 'express';
import { setJobReminder, subscribeNewsletter } from '../controllers/subscriberController';

const router = Router();

router.post('/reminder', setJobReminder);
router.post('/newsletter', subscribeNewsletter);

export default router;

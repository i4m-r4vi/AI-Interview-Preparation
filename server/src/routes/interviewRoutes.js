import { Router } from 'express';
import {
  startInterview,
  getCurrentQuestion,
  submitAnswer,
  getInterviewResult,
  getInterviewById,
  getInterviewHistory,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = Router();

router.use(protect, roleCheck('student'));

router.get('/history', getInterviewHistory);
router.post('/start', startInterview);
router.get('/:id/current', getCurrentQuestion);
router.post('/:id/answer', submitAnswer);
router.get('/:id/result', getInterviewResult);
router.get('/:id', getInterviewById);

export default router;

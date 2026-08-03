import { Router } from 'express';
import {
  getDashboardStats,
  getStudents,
  deleteStudent,
  getAllResumes,
  getAllInterviews,
  getInterviewDetail,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = Router();

router.use(protect, roleCheck('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);
router.get('/resumes', getAllResumes);
router.get('/interviews', getAllInterviews);
router.get('/interviews/:id', getInterviewDetail);

export default router;

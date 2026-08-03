import { Router } from 'express';
import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { upload } from '../config/multer.js';

const router = Router();

router.use(protect, roleCheck('student'));

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getMyResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;

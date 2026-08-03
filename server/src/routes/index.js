import { Router } from 'express';
import authRoutes from './authRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import adminRoutes from './adminRoutes.js';
import categoryRoutes from './categoryRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/interviews', interviewRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);

export default router;

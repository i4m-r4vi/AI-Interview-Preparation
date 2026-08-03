import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Interview from '../models/Interview.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [studentCount, resumeCount, interviewCount, completedInterviews] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Resume.countDocuments(),
    Interview.countDocuments(),
    Interview.find({ status: 'completed' }).select('overallScore'),
  ]);

  const avgScore =
    completedInterviews.length > 0
      ? completedInterviews.reduce((s, i) => s + (i.overallScore || 0), 0) /
        completedInterviews.length
      : 0;

  const recentInterviews = await Interview.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('jobRole experienceLevel overallScore status createdAt userId');

  res.json({
    success: true,
    data: {
      students: studentCount,
      resumes: resumeCount,
      interviews: interviewCount,
      avgScore: Math.round(avgScore * 10) / 10,
      recentInterviews,
    },
  });
});

export const getStudents = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const search = req.query.search?.trim();

  const filter = { role: 'student' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [students, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: students,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  await Promise.all([
    Resume.deleteMany({ userId: student._id }),
    Interview.deleteMany({ userId: student._id }),
    student.deleteOne(),
  ]);

  res.json({ success: true, message: 'Student and related data deleted' });
});

export const getAllResumes = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [resumes, total] = await Promise.all([
    Resume.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Resume.countDocuments(),
  ]);

  res.json({
    success: true,
    data: resumes,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getAllInterviews = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [interviews, total] = await Promise.all([
    Interview.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Interview.countDocuments(),
  ]);

  res.json({
    success: true,
    data: interviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getInterviewDetail = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id).populate('userId', 'name email');
  if (!interview) {
    throw new AppError('Interview not found', 404);
  }
  res.json({ success: true, data: interview });
});

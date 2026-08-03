import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import {
  generateInterviewQuestions,
  evaluateAnswer,
  generateFinalSummary,
} from '../services/interviewService.js';

export const startInterview = asyncHandler(async (req, res) => {
  const { resumeId, jobRole, experienceLevel, questionCount = 10 } = req.body;

  if (!resumeId || !jobRole || !experienceLevel) {
    throw new AppError('resumeId, jobRole, and experienceLevel are required', 400);
  }

  const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
  if (!resume) {
    throw new AppError('Resume not found', 404);
  }
  if (resume.status !== 'parsed' || !resume.parsedData) {
    throw new AppError('Resume is not parsed yet', 400);
  }

  const count = Math.min(Math.max(Number(questionCount) || 10, 5), 20);
  const questions = await generateInterviewQuestions({
    parsedData: resume.parsedData,
    jobRole,
    experienceLevel,
    questionCount: count,
  });

  const interview = await Interview.create({
    userId: req.user._id,
    resumeId: resume._id,
    jobRole,
    experienceLevel,
    questionCount: questions.length,
    questions,
    currentQuestionIndex: 0,
    status: 'in_progress',
  });

  res.status(201).json({
    success: true,
    data: {
      interviewId: interview._id,
      totalQuestions: interview.questions.length,
      currentQuestion: interview.questions[0],
      currentIndex: 0,
    },
  });
});

export const getCurrentQuestion = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  if (interview.status === 'completed') {
    return res.json({
      success: true,
      data: { completed: true, interviewId: interview._id },
    });
  }

  const index = interview.currentQuestionIndex;
  const question = interview.questions[index];

  if (!question) {
    throw new AppError('No more questions', 400);
  }

  res.json({
    success: true,
    data: {
      interviewId: interview._id,
      currentIndex: index,
      totalQuestions: interview.questions.length,
      question,
      completed: false,
    },
  });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionIndex, answer } = req.body;

  if (questionIndex === undefined || questionIndex === null) {
    throw new AppError('questionIndex is required', 400);
  }

  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate('resumeId');

  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  if (interview.status === 'completed') {
    throw new AppError('Interview already completed', 400);
  }

  if (Number(questionIndex) !== interview.currentQuestionIndex) {
    throw new AppError('Invalid question index', 400);
  }

  const question = interview.questions[questionIndex];
  if (!question) {
    throw new AppError('Question not found', 404);
  }

  const evaluation = await evaluateAnswer({
    question,
    answer: answer || '',
    jobRole: interview.jobRole,
    experienceLevel: interview.experienceLevel,
    resumeContext: interview.resumeId?.parsedData || {},
  });

  interview.questions[questionIndex].answer = answer || '';
  interview.questions[questionIndex].evaluation = evaluation;

  const isLast = questionIndex >= interview.questions.length - 1;

  if (isLast) {
    const evaluations = interview.questions.map((q) => q.evaluation).filter(Boolean);
    const finalResult = await generateFinalSummary({
      evaluations,
      jobRole: interview.jobRole,
      experienceLevel: interview.experienceLevel,
    });

    interview.overallScore = finalResult.overallScore;
    interview.summary = finalResult.summary;
    interview.status = 'completed';
    interview.currentQuestionIndex = questionIndex;
  } else {
    interview.currentQuestionIndex = questionIndex + 1;
  }

  await interview.save();

  res.json({
    success: true,
    data: {
      evaluation,
      completed: isLast,
      nextIndex: isLast ? null : interview.currentQuestionIndex,
      overallScore: isLast ? interview.overallScore : null,
    },
  });
});

export const getInterviewResult = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  if (interview.status !== 'completed') {
    throw new AppError('Interview not completed yet', 400);
  }

  res.json({ success: true, data: interview });
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  res.json({ success: true, data: interview });
});

export const getInterviewHistory = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [interviews, total] = await Promise.all([
    Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-questions.evaluation'),
    Interview.countDocuments({ userId: req.user._id }),
  ]);

  res.json({
    success: true,
    data: interviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

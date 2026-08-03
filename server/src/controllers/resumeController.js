import fs from 'fs/promises';
import Resume from '../models/Resume.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import {
  extractTextFromFile,
  parseResumeWithAI,
  getFileType,
} from '../services/resumeParserService.js';

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload a PDF or DOCX file', 400);
  }

  const fileType = getFileType(req.file.originalname);
  if (!fileType) {
    throw new AppError('Invalid file type', 400);
  }

  const resume = await Resume.create({
    userId: req.user._id,
    originalFileName: req.file.originalname,
    filePath: req.file.path,
    fileType,
    status: 'pending',
  });

  try {
    const rawText = await extractTextFromFile(req.file.path, fileType);
    const parsedData = await parseResumeWithAI(rawText);

    resume.parsedData = parsedData;
    resume.status = 'parsed';
    await resume.save();

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (err) {
    resume.status = 'failed';
    resume.parseError = err.message;
    await resume.save();
    throw err;
  }
});

export const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: resumes });
});

export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) {
    throw new AppError('Resume not found', 404);
  }
  res.json({ success: true, data: resume });
});

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  try {
    await fs.unlink(resume.filePath);
  } catch {
    // file may already be removed
  }

  await resume.deleteOne();
  res.json({ success: true, message: 'Resume deleted' });
});

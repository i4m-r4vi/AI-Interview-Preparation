import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ollamaGenerateWithRetry } from './ollamaService.js';
import { resumeExtractionPrompt } from '../utils/promptTemplates.js';
import { AppError } from '../middleware/errorHandler.js';

export async function extractTextFromFile(filePath, fileType) {
  const buffer = await fs.readFile(filePath);

  if (fileType === 'pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (fileType === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new AppError('Unsupported file type', 400);
}

export async function parseResumeWithAI(rawText) {
  if (!rawText || rawText.trim().length < 50) {
    throw new AppError('Could not extract enough text from resume', 400);
  }

  const prompt = resumeExtractionPrompt(rawText);
  const parsed = await ollamaGenerateWithRetry(prompt, { json: true });

  return {
    personalDetails: parsed.personalDetails || {},
    education: parsed.education || [],
    skills: parsed.skills || [],
    projects: parsed.projects || [],
    experience: parsed.experience || [],
    certifications: parsed.certifications || [],
    technologies: parsed.technologies || [],
  };
}

export function getFileType(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.docx') return 'docx';
  return null;
}

import { ollamaGenerateWithRetry } from './ollamaService.js';
import {
  questionGenerationPrompt,
  answerEvaluationPrompt,
  finalSummaryPrompt,
} from '../utils/promptTemplates.js';
import {
  calculateQuestionDistribution,
  normalizeQuestions,
} from '../utils/questionDistribution.js';
import { AppError } from '../middleware/errorHandler.js';

export async function generateInterviewQuestions({
  parsedData,
  jobRole,
  experienceLevel,
  questionCount = 10,
}) {
  const distribution = calculateQuestionDistribution(questionCount);
  const prompt = questionGenerationPrompt({
    parsedData,
    jobRole,
    experienceLevel,
    distribution,
  });

  let raw = await ollamaGenerateWithRetry(prompt, { json: true });

  if (!Array.isArray(raw)) {
    let foundArray = null;
    // Check common keys
    if (raw.questions && Array.isArray(raw.questions)) {
      foundArray = raw.questions;
    } else if (raw.data && Array.isArray(raw.data)) {
      foundArray = raw.data;
    } else {
      // Find the first value that is an array
      const firstArrayValue = Object.values(raw).find((val) => Array.isArray(val));
      if (firstArrayValue) {
        foundArray = firstArrayValue;
      }
    }
    
    if (foundArray) {
      raw = foundArray;
    } else {
      console.error('Failed to parse AI output:', raw);
      throw new AppError(`Failed to generate questions from AI: ${JSON.stringify(raw)}`, 503);
    }
  }

  const normalized = normalizeQuestions(raw, distribution);

  if (normalized.length === 0) {
    throw new AppError('No questions generated', 503);
  }

  return normalized.map((q) => {
    let opts = q.options || [];
    // Defensive parsing for LLMs that concatenate options into a single string
    if (opts.length === 1 && typeof opts[0] === 'string' && opts[0].includes('A)') && opts[0].includes('B)')) {
      const splitOpts = opts[0]
        .split(/(?:A\)|B\)|C\)|D\))/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
      if (splitOpts.length === 4) {
        opts = splitOpts;
      }
    }

    return {
      text: q.question || q.text, // support old & new
      type: q.type,
      category: q.category || '',
      difficulty: q.difficulty || 'Medium',
      topic: q.topic || '',
      order: q.order,
      options: opts,
      correctAnswer: q.correct_answer || q.correctAnswer || '',
      answer: '',
      evaluation: undefined,
    };
  });
}

export async function evaluateAnswer({ question, answer, jobRole, experienceLevel, resumeContext }) {
  const prompt = answerEvaluationPrompt({
    question,
    answer,
    jobRole,
    experienceLevel,
    resumeContext,
  });

  const result = await ollamaGenerateWithRetry(prompt, { json: true });

  return {
    score: Math.min(10, Math.max(0, Number(result.score) || 0)),
    feedback: result.feedback || '',
    strengths: result.strengths || [],
    weaknesses: result.weaknesses || [],
    suggestions: result.suggestions || [],
  };
}

export async function generateFinalSummary({ evaluations, jobRole, experienceLevel }) {
  const prompt = finalSummaryPrompt({ evaluations, jobRole, experienceLevel });
  const result = await ollamaGenerateWithRetry(prompt, { json: true });

  const avgScore =
    evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / evaluations.length
      : 0;

  return {
    overallScore: Math.min(
      10,
      Math.max(0, Number(result.overallScore) || avgScore)
    ),
    summary: {
      feedback: result.feedback || '',
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      suggestions: result.suggestions || [],
    },
  };
}

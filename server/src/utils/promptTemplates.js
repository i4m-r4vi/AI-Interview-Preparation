export function resumeExtractionPrompt(rawText) {
  return `You are a resume parser. Extract structured information from the resume text below.
Return ONLY valid JSON with this exact structure:
{
  "personalDetails": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "" },
  "education": [{ "degree": "", "institution": "", "year": "", "grade": "" }],
  "skills": [],
  "projects": [{ "title": "", "description": "", "technologies": [], "role": "" }],
  "experience": [{ "company": "", "role": "", "duration": "", "responsibilities": [] }],
  "certifications": [{ "name": "", "issuer": "", "year": "" }],
  "technologies": []
}
Use empty strings or empty arrays when data is missing. Do not invent information not present in the resume.

RESUME TEXT:
${rawText.slice(0, 12000)}`;
}

export function questionGenerationPrompt({ parsedData, jobRole, experienceLevel, distribution }) {
  const resumeJson = JSON.stringify(parsedData, null, 2);

  return `You are an expert technical interviewer. Create exactly ${distribution.totalNeeded} interview questions for a candidate.

RULES:
- Questions MUST come directly from the candidate's resume or the job role "${jobRole}" at "${experienceLevel}" experience level.
- NEVER ask unrelated questions.
- If projects exist, include deep technical questions.
- For skills, include practical verification questions.

Distribution:
- ${distribution.mcq} MCQs (type: "mcq")
- ${distribution.theory} Technical descriptive questions (type: "theory")
- ${distribution.coding} Coding questions (type: "coding")
- ${distribution.behavioral} Behavioral questions (type: "behavioral")

Do not generate all questions from the same category.

Return ONLY a valid JSON object matching exactly this structure:
{
  "questions": [
    {
      "type": "mcq | theory | coding | behavioral",
      "question": "...",
      "options": ["Option 1 text", "Option 2 text", "Option 3 text", "Option 4 text"],
      "correct_answer": "...",
      "difficulty": "Easy|Medium|Hard",
      "topic": "..."
    }
  ]
}
CRITICAL FOR MCQ: The "options" field MUST be an array of EXACTLY 4 SEPARATE strings. Do NOT concatenate them into a single string.
NOTE: Include "options" and "correct_answer" ONLY for MCQs.

CANDIDATE RESUME DATA:
${resumeJson}

JOB ROLE: ${jobRole}
EXPERIENCE LEVEL: ${experienceLevel}`;
}

export function answerEvaluationPrompt({ question, answer, jobRole, experienceLevel, resumeContext }) {
  const isMcq = question.type === 'mcq';
  const isCoding = question.type === 'coding';
  
  let evaluationContext = `You are an interview evaluator. Score the candidate's answer.
Evaluate based on accuracy, depth, clarity, and relevance. Provide feedback and suggest improvements.`;

  if (isMcq) {
    evaluationContext = `You are an interview evaluator. The candidate answered a multiple-choice question.
Evaluate their selected answer against the correct answer. Provide feedback on why it was correct or incorrect, and suggest improvements.

OPTIONS: ${JSON.stringify(question.options)}
CORRECT ANSWER: ${question.correctAnswer}
CANDIDATE'S SELECTED ANSWER: ${answer}`;
  } else if (isCoding) {
    evaluationContext = `You are a technical interview evaluator. The candidate answered a coding question.
Evaluate their code based on correctness, efficiency, and edge cases. Provide feedback and suggest improvements.`;
  }

  return `${evaluationContext}

Return ONLY valid JSON:
{
  "score": 0-10,
  "feedback": "detailed feedback",
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"],
  "suggestions": ["suggestion1"]
}

JOB ROLE: ${jobRole}
EXPERIENCE LEVEL: ${experienceLevel}
RESUME CONTEXT: ${JSON.stringify(resumeContext).slice(0, 3000)}

QUESTION: ${question.text}
CANDIDATE ANSWER: ${answer || '(no answer provided)'}

Score fairly based on accuracy, depth, clarity, and relevance.`;
}

export function finalSummaryPrompt({ evaluations, jobRole, experienceLevel }) {
  return `You are an interview coach. Summarize the candidate's overall interview performance.

Return ONLY valid JSON:
{
  "overallScore": 0-10,
  "feedback": "overall summary",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}

JOB ROLE: ${jobRole}
EXPERIENCE LEVEL: ${experienceLevel}
PER-QUESTION EVALUATIONS:
${JSON.stringify(evaluations, null, 2).slice(0, 8000)}`;
}

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ParsedData {
  personalDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  education?: Array<{
    degree?: string;
    institution?: string;
    year?: string;
    grade?: string;
  }>;
  skills?: string[];
  projects?: Array<{
    title?: string;
    description?: string;
    technologies?: string[];
    role?: string;
  }>;
  experience?: Array<{
    company?: string;
    role?: string;
    duration?: string;
    responsibilities?: string[];
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    year?: string;
  }>;
  technologies?: string[];
}

export interface Resume {
  _id: string;
  originalFileName: string;
  fileType: string;
  status: 'pending' | 'parsed' | 'failed';
  parsedData?: ParsedData;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface InterviewQuestion {
  text: string;
  type: 'mcq' | 'theory' | 'coding' | 'behavioral';
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topic?: string;
  order: number;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
  evaluation?: Evaluation;
}

export interface Interview {
  _id: string;
  jobRole: string;
  experienceLevel: string;
  questionCount: number;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  status: 'in_progress' | 'completed';
  overallScore?: number;
  summary?: {
    feedback?: string;
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
  };
  createdAt: string;
  userId?: { name: string; email: string };
}

export interface DashboardStats {
  students: number;
  resumes: number;
  interviews: number;
  avgScore: number;
  recentInterviews: Interview[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

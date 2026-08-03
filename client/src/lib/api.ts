import axios from 'axios';
import { getToken, clearAuth } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearAuth();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const resumeApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/resumes/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: () => api.get('/resumes'),
  get: (id: string) => api.get(`/resumes/${id}`),
  delete: (id: string) => api.delete(`/resumes/${id}`),
};

export const interviewApi = {
  start: (data: {
    resumeId: string;
    jobRole: string;
    experienceLevel: string;
    questionCount?: number;
    questionFormat?: 'mcq' | 'theory';
  }) => api.post('/interviews/start', data),
  current: (id: string) => api.get(`/interviews/${id}/current`),
  answer: (id: string, data: { questionIndex: number; answer: string }) =>
    api.post(`/interviews/${id}/answer`, data),
  result: (id: string) => api.get(`/interviews/${id}/result`),
  get: (id: string) => api.get(`/interviews/${id}`),
  history: (page = 1) => api.get(`/interviews/history?page=${page}`),
};

export const categoryApi = {
  list: () => api.get('/categories'),
  all: () => api.get('/categories/all'),
  create: (data: { name: string; description?: string }) => api.post('/categories', data),
  update: (id: string, data: Partial<{ name: string; description: string; isActive: boolean }>) =>
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const adminApi = {
  stats: () => api.get('/admin/dashboard/stats'),
  students: (page = 1, search = '') =>
    api.get(`/admin/students?page=${page}&search=${encodeURIComponent(search)}`),
  deleteStudent: (id: string) => api.delete(`/admin/students/${id}`),
  resumes: (page = 1) => api.get(`/admin/resumes?page=${page}`),
  interviews: (page = 1) => api.get(`/admin/interviews?page=${page}`),
  interviewDetail: (id: string) => api.get(`/admin/interviews/${id}`),
};

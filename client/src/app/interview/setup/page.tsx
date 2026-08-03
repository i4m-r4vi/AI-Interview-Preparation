'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { resumeApi, categoryApi, interviewApi } from '@/lib/api';
import { Resume, Category } from '@/types';

const levels = ['fresher', 'junior', 'mid', 'senior'];

export default function InterviewSetupPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [resumeId, setResumeId] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('junior');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    Promise.all([resumeApi.list(), categoryApi.list()]).then(([r, c]) => {
      const parsed = r.data.data.filter((x: Resume) => x.status === 'parsed');
      setResumes(parsed);
      setCategories(c.data.data);
      if (parsed.length) setResumeId(parsed[0]._id);
      if (c.data.data.length) setJobRole(c.data.data[0].name);
    });
  }, []);

  useEffect(() => {
    if (resumeId && resumes.length > 0) {
      const selected = resumes.find((r) => r._id === resumeId);
      const role = selected?.parsedData?.experience?.[0]?.role;
      if (role) {
        setJobRole(role);
      }
    }
  }, [resumeId, resumes]);

  const handleStart = async () => {
    if (!resumeId || !jobRole) {
      toast.error('Please select resume and job role');
      return;
    }
    setLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return Math.min(prev + Math.floor(Math.random() * 10) + 1, 95);
      });
    }, 1000);

    try {
      const { data } = await interviewApi.start({
        resumeId,
        jobRole,
        experienceLevel,
        questionCount,
      });
      clearInterval(interval);
      setProgress(100);
      toast.success('Interview started!');
      setTimeout(() => {
        router.push(`/interview/${data.data.interviewId}`);
      }, 500);
    } catch (err: unknown) {
      clearInterval(interval);
      setProgress(0);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to start interview';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute role="student">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Start Interview</h1>

        <Card className="max-w-lg">
          {resumes.length === 0 ? (
            <p className="text-slate-600">
              No parsed resumes found. Please upload a resume first.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Select Resume</label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.originalFileName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Job Role</label>
                <input
                  type="text"
                  list="job-roles"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                />
                <datalist id="job-roles">
                  {categories.map((c) => (
                    <option key={c._id} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Experience Level</label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Number of Questions ({questionCount})
                </label>
                <input
                  type="range"
                  min={5}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  50% MCQs, 30% Theory, 10% Coding, 10% Behavioral
                </p>
              </div>

              {loading && (
                <div className="w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              {loading && <p className="text-center text-xs text-slate-500">AI is analyzing and generating questions... {progress}%</p>}
              
              <Button onClick={handleStart} loading={loading} className="w-full">
                {loading ? 'Analyzing...' : 'Start Interview'}
              </Button>
            </div>
          )}
        </Card>
      </AppLayout>
    </ProtectedRoute>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Upload, Mic, History } from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { resumeApi, interviewApi } from '@/lib/api';
import { Resume, Interview } from '@/types';

export default function StudentDashboard() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([resumeApi.list(), interviewApi.history(1)])
      .then(([r, i]) => {
        setResumes(r.data.data);
        setInterviews(i.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const parsedCount = resumes.filter((r) => r.status === 'parsed').length;
  const completedCount = interviews.filter((i) => i.status === 'completed').length;

  return (
    <ProtectedRoute role="student">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Student Dashboard</h1>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-500">Resumes Uploaded</p>
            <p className="text-3xl font-bold">{resumes.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Parsed Resumes</p>
            <p className="text-3xl font-bold">{parsedCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Interviews Completed</p>
            <p className="text-3xl font-bold">{completedCount}</p>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Link href="/upload">
            <Card className="cursor-pointer transition hover:shadow-md">
              <Upload className="mb-2 text-primary-600" />
              <h3 className="font-semibold">Upload Resume</h3>
              <p className="text-sm text-slate-500">Upload PDF or DOCX for AI parsing</p>
            </Card>
          </Link>
          <Link href="/interview/setup">
            <Card className="cursor-pointer transition hover:shadow-md">
              <Mic className="mb-2 text-primary-600" />
              <h3 className="font-semibold">Start Interview</h3>
              <p className="text-sm text-slate-500">Practice with AI-generated questions</p>
            </Card>
          </Link>
          <Link href="/history">
            <Card className="cursor-pointer transition hover:shadow-md">
              <History className="mb-2 text-primary-600" />
              <h3 className="font-semibold">View History</h3>
              <p className="text-sm text-slate-500">Review past interviews and scores</p>
            </Card>
          </Link>
        </div>

        {!loading && interviews.length > 0 && (
          <Card title="Recent Interviews">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Level</th>
                    <th className="pb-2">Score</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.slice(0, 5).map((inv) => (
                    <tr key={inv._id} className="border-b border-slate-100">
                      <td className="py-2">{inv.jobRole}</td>
                      <td className="capitalize">{inv.experienceLevel}</td>
                      <td>{inv.overallScore ?? '-'}/10</td>
                      <td className="capitalize">{inv.status.replace('_', ' ')}</td>
                      <td>
                        {inv.status === 'completed' && (
                          <Link href={`/interview/${inv._id}/result`}>
                            <Button variant="ghost" className="text-xs">
                              View
                            </Button>
                          </Link>
                        )}
                        {inv.status === 'in_progress' && (
                          <Link href={`/interview/${inv._id}`}>
                            <Button variant="ghost" className="text-xs">
                              Continue
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}

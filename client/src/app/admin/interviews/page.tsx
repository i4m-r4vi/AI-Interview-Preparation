'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EvaluationCard from '@/components/interview/EvaluationCard';
import { adminApi } from '@/lib/api';
import { Interview } from '@/types';

export default function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selected, setSelected] = useState<Interview | null>(null);

  useEffect(() => {
    adminApi.interviews().then(({ data }) => setInterviews(data.data));
  }, []);

  const viewDetail = async (id: string) => {
    const { data } = await adminApi.interviewDetail(id);
    setSelected(data.data);
  };

  return (
    <ProtectedRoute role="admin">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Interview Reports</h1>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Level</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((inv) => (
                  <tr key={inv._id} className="border-b border-slate-100">
                    <td className="py-3">{inv.userId?.name || '-'}</td>
                    <td className="py-3">{inv.jobRole}</td>
                    <td className="py-3 capitalize">{inv.experienceLevel}</td>
                    <td className="py-3">{inv.overallScore ?? '-'}/10</td>
                    <td className="py-3 capitalize">{inv.status.replace('_', ' ')}</td>
                    <td className="py-3">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Button variant="secondary" onClick={() => viewDetail(inv._id)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selected && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Report: {selected.userId?.name} - {selected.jobRole}
              </h2>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>

            {selected.summary && (
              <Card title={`Overall Score: ${selected.overallScore}/10`} className="mb-6">
                <p className="text-sm text-slate-700">{selected.summary.feedback}</p>
              </Card>
            )}

            <div className="space-y-4">
              {selected.questions.map((q, i) => (
                <Card key={i}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-slate-500">Q{i + 1}</span>
                    <Badge type={q.type}>{q.type}</Badge>
                  </div>
                  <p className="mb-2 font-medium">{q.text}</p>
                  <p className="text-sm text-slate-600">Answer: {q.answer || '(none)'}</p>
                  {q.evaluation && (
                    <div className="mt-2">
                      <EvaluationCard evaluation={q.evaluation} />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}

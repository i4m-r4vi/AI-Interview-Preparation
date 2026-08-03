'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { interviewApi } from '@/lib/api';
import { Interview } from '@/types';

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewApi
      .history(1)
      .then(({ data }) => setInterviews(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute role="student">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Interview History</h1>

        <Card>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : interviews.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No interviews yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Job Role</th>
                    <th className="pb-3 pr-4">Level</th>
                    <th className="pb-3 pr-4">Questions</th>
                    <th className="pb-3 pr-4">Score</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((inv) => (
                    <tr key={inv._id} className="border-b border-slate-100">
                      <td className="py-3 pr-4">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">{inv.jobRole}</td>
                      <td className="py-3 pr-4 capitalize">{inv.experienceLevel}</td>
                      <td className="py-3 pr-4">{inv.questionCount}</td>
                      <td className="py-3 pr-4">{inv.overallScore ?? '-'}/10</td>
                      <td className="py-3 pr-4 capitalize">{inv.status.replace('_', ' ')}</td>
                      <td className="py-3">
                        {inv.status === 'completed' ? (
                          <Link href={`/interview/${inv._id}/result`}>
                            <Button variant="ghost" className="text-xs">
                              View Report
                            </Button>
                          </Link>
                        ) : (
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
          )}
        </Card>
      </AppLayout>
    </ProtectedRoute>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, ClipboardList, TrendingUp } from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import StatsCards from '@/components/admin/StatsCards';
import Card from '@/components/ui/Card';
import { adminApi } from '@/lib/api';
import { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi.stats().then(({ data }) => setStats(data.data));
  }, []);

  if (!stats) {
    return (
      <ProtectedRoute role="admin">
        <AppLayout>
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="admin">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Admin Dashboard</h1>

        <StatsCards
          stats={[
            { label: 'Total Students', value: stats.students, icon: <Users size={32} /> },
            { label: 'Resumes Uploaded', value: stats.resumes, icon: <FileText size={32} /> },
            {
              label: 'Interviews Conducted',
              value: stats.interviews,
              icon: <ClipboardList size={32} />,
            },
            {
              label: 'Average Score',
              value: `${stats.avgScore}/10`,
              icon: <TrendingUp size={32} />,
            },
          ]}
        />

        <Card title="Recent Interviews" className="mt-8">
          {stats.recentInterviews.length === 0 ? (
            <p className="text-slate-500">No interviews yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Level</th>
                    <th className="pb-2">Score</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInterviews.map((inv) => (
                    <tr key={inv._id} className="border-b border-slate-100">
                      <td className="py-2">
                        {(inv.userId as { name?: string })?.name || '-'}
                      </td>
                      <td className="py-2">{inv.jobRole}</td>
                      <td className="py-2 capitalize">{inv.experienceLevel}</td>
                      <td className="py-2">{inv.overallScore ?? '-'}/10</td>
                      <td className="py-2 capitalize">{inv.status.replace('_', ' ')}</td>
                      <td className="py-2">{new Date(inv.createdAt).toLocaleDateString()}</td>
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

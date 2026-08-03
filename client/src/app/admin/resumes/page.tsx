'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ParsedResumeView from '@/components/resume/ParsedResumeView';
import { adminApi } from '@/lib/api';
import { Resume } from '@/types';

export default function AdminResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selected, setSelected] = useState<Resume | null>(null);

  useEffect(() => {
    adminApi.resumes().then(({ data }) => setResumes(data.data));
  }, []);

  return (
    <ProtectedRoute role="admin">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Uploaded Resumes</h1>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">File</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100">
                    <td className="py-3">
                      {(r as Resume & { userId?: { name?: string } }).userId?.name || '-'}
                    </td>
                    <td className="py-3">{r.originalFileName}</td>
                    <td className="py-3 capitalize">{r.status}</td>
                    <td className="py-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      {r.parsedData && (
                        <Button variant="secondary" onClick={() => setSelected(r)}>
                          View Parsed
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selected?.parsedData && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">
              Parsed Data: {selected.originalFileName}
            </h2>
            <ParsedResumeView data={selected.parsedData} />
            <Button variant="secondary" className="mt-4" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}

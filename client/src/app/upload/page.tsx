'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import UploadDropzone from '@/components/resume/UploadDropzone';
import ParsedResumeView from '@/components/resume/ParsedResumeView';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { resumeApi } from '@/lib/api';
import { Resume } from '@/types';

export default function UploadPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<Resume | null>(null);

  const fetchResumes = async () => {
    const { data } = await resumeApi.list();
    setResumes(data.data);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return Math.min(prev + Math.floor(Math.random() * 10) + 1, 95);
      });
    }, 800);

    try {
      const { data } = await resumeApi.upload(file);
      clearInterval(interval);
      setProgress(100);
      toast.success('Resume uploaded and parsed successfully');
      setSelected(data.data);
      await fetchResumes();
    } catch (err: unknown) {
      clearInterval(interval);
      setProgress(0);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Upload failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await resumeApi.delete(id);
      toast.success('Resume deleted');
      if (selected?._id === id) setSelected(null);
      await fetchResumes();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <ProtectedRoute role="student">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Upload Resume</h1>

        <UploadDropzone onUpload={handleUpload} loading={loading} progress={progress} />

        {selected?.parsedData && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Extracted Information</h2>
            <ParsedResumeView data={selected.parsedData} />
          </div>
        )}

        {resumes.length > 0 && (
          <Card title="Your Resumes" className="mt-8">
            <div className="space-y-3">
              {resumes.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-medium">{r.originalFileName}</p>
                    <p className="text-xs capitalize text-slate-500">
                      {r.status} &middot; {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {r.status === 'parsed' && (
                      <Button variant="secondary" onClick={() => setSelected(r)}>
                        View
                      </Button>
                    )}
                    <Button variant="danger" onClick={() => handleDelete(r._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (q = search) => {
    const { data } = await adminApi.students(1, q);
    setStudents(data.data);
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await adminApi.deleteStudent(deleteId);
      toast.success('Student deleted');
      setDeleteId(null);
      await fetchStudents();
    } catch {
      toast.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute role="admin">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Students</h1>

        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => fetchStudents(search)}>Search</Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-slate-100">
                    <td className="py-3">{s.name}</td>
                    <td className="py-3">{s.email}</td>
                    <td className="py-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Button variant="danger" onClick={() => setDeleteId(s._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
          <p className="mb-4 text-sm text-slate-600">
            This will permanently delete the student and all their resumes and interviews.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={loading} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      </AppLayout>
    </ProtectedRoute>
  );
}

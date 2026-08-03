'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { categoryApi } from '@/lib/api';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const { data } = await categoryApi.all();
    setCategories(data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditId(cat._id);
    setName(cat.name);
    setDescription(cat.description);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await categoryApi.update(editId, { name, description });
        toast.success('Category updated');
      } else {
        await categoryApi.create({ name, description });
        toast.success('Category created');
      }
      setModalOpen(false);
      await fetchCategories();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Save failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await categoryApi.delete(id);
      toast.success('Category deleted');
      await fetchCategories();
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await categoryApi.update(cat._id, { isActive: !cat.isActive });
      await fetchCategories();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <ProtectedRoute role="admin">
      <AppLayout>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Job Role Categories</h1>
          <Button onClick={openCreate}>Add Category</Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Active</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-slate-100">
                    <td className="py-3 font-medium">{cat.name}</td>
                    <td className="py-3 text-slate-600">{cat.description}</td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleActive(cat)}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          cat.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => openEdit(cat)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(cat._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editId ? 'Edit Category' : 'Add Category'}
        >
          <div className="space-y-4">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button loading={loading} onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Modal>
      </AppLayout>
    </ProtectedRoute>
  );
}

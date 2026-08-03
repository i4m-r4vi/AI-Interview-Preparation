'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-slate-100 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
          AI Resume Interview Prep
        </h1>
        <p className="mb-8 text-lg text-slate-600">
          Upload your resume, get personalized interview questions powered by AI, and receive
          detailed feedback to improve your performance.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Register as Student</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

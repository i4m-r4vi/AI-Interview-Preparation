'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EvaluationCard from '@/components/interview/EvaluationCard';
import { interviewApi } from '@/lib/api';
import { Interview } from '@/types';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    interviewApi
      .result(id)
      .then(({ data }) => setInterview(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute role="student">
        <AppLayout>
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (!interview) return null;

  return (
    <ProtectedRoute role="student">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Interview Results</h1>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-500">Overall Score</p>
            <p className="text-4xl font-bold text-primary-600">
              {interview.overallScore?.toFixed(1)}/10
            </p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Job Role</p>
            <p className="text-xl font-semibold">{interview.jobRole}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Experience Level</p>
            <p className="text-xl font-semibold capitalize">{interview.experienceLevel}</p>
          </Card>
        </div>

        {interview.summary && (
          <Card title="Overall Summary" className="mb-8">
            <p className="mb-4 text-sm text-slate-700">{interview.summary.feedback}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="mb-1 text-sm font-semibold text-green-700">Strengths</h4>
                <ul className="list-inside list-disc text-sm text-slate-600">
                  {interview.summary.strengths?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-red-700">Weaknesses</h4>
                <ul className="list-inside list-disc text-sm text-slate-600">
                  {interview.summary.weaknesses?.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-blue-700">Suggestions</h4>
                <ul className="list-inside list-disc text-sm text-slate-600">
                  {interview.summary.suggestions?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        <h2 className="mb-4 text-xl font-semibold">Question Breakdown</h2>
        <div className="space-y-6">
          {interview.questions.map((q, i) => (
            <div key={i}>
              <Card>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">Q{i + 1}</span>
                  <Badge type={q.type}>{q.type}</Badge>
                </div>
                <p className="mb-3 font-medium">{q.text}</p>
                <p className="mb-2 text-sm text-slate-600">
                  <strong>Your answer:</strong> {q.answer || '(no answer)'}
                </p>
              </Card>
              {q.evaluation && (
                <div className="mt-2">
                  <EvaluationCard evaluation={q.evaluation} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/history">
            <Button variant="secondary">View History</Button>
          </Link>
          <Link href="/interview/setup">
            <Button>Start New Interview</Button>
          </Link>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

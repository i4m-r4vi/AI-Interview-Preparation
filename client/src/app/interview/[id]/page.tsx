'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import QuestionCard, { ProgressBar } from '@/components/interview/QuestionCard';
import Button from '@/components/ui/Button';
import { interviewApi } from '@/lib/api';
import { InterviewQuestion } from '@/types';

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCurrent = async () => {
    try {
      const { data } = await interviewApi.current(id);
      if (data.data.completed) {
        router.replace(`/interview/${id}/result`);
        return;
      }
      setQuestion(data.data.question);
      setCurrentIndex(data.data.currentIndex);
      setTotal(data.data.totalQuestions);
      setAnswer('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load question';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isLastQuestion = total > 0 && currentIndex >= total - 1;

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error('Please enter your answer');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await interviewApi.answer(id, {
        questionIndex: currentIndex,
        answer,
      });

      if (data.data.completed) {
        toast.success('All answers captured! Generating your AI feedback report...');
        router.push(`/interview/${id}/result`);
      } else {
        toast.success('Answer saved!');
        setLoading(true);
        await loadCurrent();
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to submit answer';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute role="student">
        <AppLayout>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            <p className="mt-3 text-sm text-slate-500">Loading question...</p>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="student">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Interview Session</h1>

        <ProgressBar current={currentIndex} total={total} />

        {question && <QuestionCard question={question} index={currentIndex} total={total} />}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Select or Enter Your Answer</label>
          {question?.options && question.options.length > 0 ? (
            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <label
                  key={i}
                  className={`block cursor-pointer rounded-lg border p-4 transition-colors ${
                    answer === opt
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="answer"
                      value={opt}
                      checked={answer === opt}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 block text-sm font-medium text-slate-700">
                      {opt}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className={`w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${
                question?.type === 'coding' ? 'font-mono' : ''
              }`}
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={question?.type === 'coding' ? 'Write your code here...' : 'Type your answer here...'}
            />
          )}

          {submitting && isLastQuestion && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700 flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span>AI is evaluating all your captured answers and preparing your comprehensive performance report. Please wait a moment...</span>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            loading={submitting}
            className="mt-4"
          >
            {isLastQuestion ? 'Submit & Finish Interview' : 'Submit & Next Question'}
          </Button>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

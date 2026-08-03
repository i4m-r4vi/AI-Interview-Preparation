'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import QuestionCard, { ProgressBar } from '@/components/interview/QuestionCard';
import EvaluationCard from '@/components/interview/EvaluationCard';
import Button from '@/components/ui/Button';
import { interviewApi } from '@/lib/api';
import { Evaluation, InterviewQuestion } from '@/types';

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEval, setShowEval] = useState(false);

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
      setEvaluation(null);
      setShowEval(false);
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
      setEvaluation(data.data.evaluation);
      setShowEval(true);

      if (data.data.completed) {
        toast.success('Interview completed!');
        setTimeout(() => router.push(`/interview/${id}/result`), 2000);
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

  const handleNext = () => {
    setLoading(true);
    loadCurrent();
  };

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

  return (
    <ProtectedRoute role="student">
      <AppLayout>
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Interview Session</h1>

        <ProgressBar current={currentIndex} total={total} />

        {question && <QuestionCard question={question} index={currentIndex} total={total} />}

        {!showEval && (
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">Select Your Answer</label>
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
            <Button onClick={handleSubmit} loading={submitting} className="mt-4">
              Submit Answer
            </Button>
          </div>
        )}

        {showEval && evaluation && (
          <div className="mt-6 space-y-4">
            <EvaluationCard evaluation={evaluation} />
            {currentIndex < total - 1 && (
              <Button onClick={handleNext}>Next Question</Button>
            )}
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}

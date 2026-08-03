import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function QuestionCard({
  question,
  index,
  total,
}: {
  question: { text: string; type: string; category?: string };
  index: number;
  total: number;
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          Question {index + 1} of {total}
        </span>
        <Badge type={question.type}>{question.type}</Badge>
      </div>
      <p className="text-lg text-slate-800">{question.text}</p>
      {question.category && (
        <p className="mt-2 text-xs text-slate-500">Topic: {question.category}</p>
      )}
    </Card>
  );
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="mb-6">
      <div className="mb-1 flex justify-between text-sm text-slate-600">
        <span>Progress</span>
        <span>
          {current + 1}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-primary-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

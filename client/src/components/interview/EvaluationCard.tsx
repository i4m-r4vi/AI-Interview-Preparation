import { Evaluation } from '@/types';
import Card from '@/components/ui/Card';

export default function EvaluationCard({ evaluation }: { evaluation: Evaluation }) {
  return (
    <Card title={`Score: ${evaluation.score}/10`}>
      <p className="mb-4 text-sm text-slate-700">{evaluation.feedback}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <h4 className="mb-1 text-sm font-semibold text-green-700">Strengths</h4>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {evaluation.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-1 text-sm font-semibold text-red-700">Weaknesses</h4>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {evaluation.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-1 text-sm font-semibold text-blue-700">Suggestions</h4>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {evaluation.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

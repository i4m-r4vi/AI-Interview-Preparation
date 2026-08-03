import { ReactNode } from 'react';
import Card from '@/components/ui/Card';

export default function StatsCards({
  stats,
}: {
  stats: { label: string; value: string | number; icon?: ReactNode }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
            {s.icon && <div className="text-primary-500">{s.icon}</div>}
          </div>
        </Card>
      ))}
    </div>
  );
}

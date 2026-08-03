import { ReactNode } from 'react';

export default function Card({
  children,
  className = '',
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title && <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>}
      {children}
    </div>
  );
}

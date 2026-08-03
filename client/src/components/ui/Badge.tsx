export default function Badge({ children, type }: { children: string; type?: string }) {
  const colors: Record<string, string> = {
    resume: 'bg-blue-100 text-blue-800',
    technical: 'bg-indigo-100 text-indigo-800',
    role: 'bg-purple-100 text-purple-800',
    scenario: 'bg-orange-100 text-orange-800',
    behavioral: 'bg-green-100 text-green-800',
    default: 'bg-slate-100 text-slate-800',
  };

  const key = type?.toLowerCase() || 'default';
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[key] || colors.default}`}
    >
      {children}
    </span>
  );
}

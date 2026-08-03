import { ParsedData } from '@/types';
import Card from '@/components/ui/Card';

export default function ParsedResumeView({ data }: { data: ParsedData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.personalDetails && (
        <Card title="Personal Details">
          <dl className="space-y-1 text-sm">
            {Object.entries(data.personalDetails).map(
              ([k, v]) =>
                v && (
                  <div key={k}>
                    <span className="font-medium capitalize">{k}: </span>
                    {v}
                  </div>
                )
            )}
          </dl>
        </Card>
      )}

      {data.skills && data.skills.length > 0 && (
        <Card title="Skills">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s} className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                {s}
              </span>
            ))}
          </div>
        </Card>
      )}

      {data.projects && data.projects.length > 0 && (
        <Card title="Projects" className="md:col-span-2">
          <div className="space-y-4">
            {data.projects.map((p, i) => (
              <div key={i} className="border-b border-slate-100 pb-3 last:border-0">
                <h4 className="font-medium">{p.title}</h4>
                <p className="text-sm text-slate-600">{p.description}</p>
                {p.technologies && (
                  <p className="mt-1 text-xs text-slate-500">{p.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.experience && data.experience.length > 0 && (
        <Card title="Experience" className="md:col-span-2">
          <div className="space-y-4">
            {data.experience.map((e, i) => (
              <div key={i}>
                <h4 className="font-medium">
                  {e.role} at {e.company}
                </h4>
                <p className="text-xs text-slate-500">{e.duration}</p>
                {e.responsibilities && (
                  <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                    {e.responsibilities.map((r, j) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.education && data.education.length > 0 && (
        <Card title="Education">
          {data.education.map((e, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium">{e.degree}</p>
              <p className="text-slate-600">
                {e.institution} {e.year && `(${e.year})`}
              </p>
            </div>
          ))}
        </Card>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <Card title="Certifications">
          {data.certifications.map((c, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium">{c.name}</p>
              <p className="text-slate-600">
                {c.issuer} {c.year && `(${c.year})`}
              </p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

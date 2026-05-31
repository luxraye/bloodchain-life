import { useCompliance } from '../context/ComplianceContext'

export default function TemplatesPage() {
  const { templates } = useCompliance()

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-1">Filing templates</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        JSON-schema templates provisioned in Instances — read-only catalog in Sentinel.
      </p>

      <ul className="space-y-3">
        {templates.map((t) => (
          <li key={t.id} className="card p-4 flex justify-between items-center gap-4">
            <div>
              <p className="font-semibold text-white">{t.name}</p>
              <p className="font-mono-ui text-xs mt-1" style={{ color: 'var(--sentinel-300)' }}>
                {t.code}
              </p>
            </div>
            <span className="badge-regulatory">v{t.version}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

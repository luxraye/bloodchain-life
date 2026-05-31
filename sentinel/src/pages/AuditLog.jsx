import { useCompliance } from '../context/ComplianceContext'

function formatWhen(iso) {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AuditLog() {
  const { auditLog, isDemoData } = useCompliance()

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-1">Audit log</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {isDemoData ? 'Demo trail — connect Instances API for live tenant audit.' : 'Tenant-scoped actions from Instances.'}
      </p>

      <div className="card divide-y divide-white/5">
        {auditLog.map((row) => (
          <div key={row.id} className="p-4 flex flex-wrap gap-4 justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{row.action}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {row.entityType} · <span className="font-mono-ui">{row.entityId}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.actor}</p>
              <p className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {formatWhen(row.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

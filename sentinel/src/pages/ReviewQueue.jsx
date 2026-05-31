import { Link } from 'react-router-dom'
import { useCompliance } from '../context/ComplianceContext'
import StatusBadge from '../components/StatusBadge'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReviewQueue() {
  const { instances } = useCompliance()
  const submitted = instances.filter((i) => i.status === 'SUBMITTED')

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-1">Review queue</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Submitted compliance filings awaiting approve, flag, or reject.
      </p>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left p-3 field-label">Template</th>
              <th className="text-left p-3 field-label">Licensee</th>
              <th className="text-left p-3 field-label">Submitted</th>
              <th className="text-left p-3 field-label">Deadline</th>
              <th className="text-left p-3 field-label">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {submitted.map((inst) => (
              <tr key={inst.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="p-3">
                  <p className="font-medium text-white">{inst.template?.name}</p>
                  <p className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {inst.template?.code}
                  </p>
                </td>
                <td className="p-3" style={{ color: 'var(--text-secondary)' }}>
                  {inst.assignee?.name}
                </td>
                <td className="p-3 font-mono-ui text-xs" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(inst.submittedAt)}
                </td>
                <td className="p-3 font-mono-ui text-xs" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(inst.deadline)}
                </td>
                <td className="p-3">
                  <StatusBadge status={inst.status} />
                </td>
                <td className="p-3 text-right">
                  <Link to={`/submissions/${inst.id}`} className="btn-sentinel text-xs py-2 px-3 inline-block">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {submitted.length === 0 && (
          <p className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Queue is empty.
          </p>
        )}
      </div>
    </div>
  )
}

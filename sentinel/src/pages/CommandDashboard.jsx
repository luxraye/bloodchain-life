import { Link } from 'react-router-dom'
import { Inbox, AlertTriangle, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import { useCompliance } from '../context/ComplianceContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import StatusBadge from '../components/StatusBadge'

export default function CommandDashboard() {
  const { stats, instances } = useCompliance()
  const queue = instances.filter((i) => i.status === 'SUBMITTED').slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Command dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {stats.queue} submission{stats.queue !== 1 ? 's' : ''} awaiting regulator decision.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/queue" className="card p-4 hover:border-[rgba(124,58,237,0.35)] transition">
          <Inbox className="w-5 h-5 mb-2" style={{ color: 'var(--sentinel-300)' }} />
          <p className="text-3xl font-extrabold text-white">{stats.queue}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>In review queue</p>
        </Link>
        <div className="card p-4">
          <AlertTriangle className="w-5 h-5 mb-2" style={{ color: '#FFB800' }} />
          <p className="text-3xl font-extrabold" style={{ color: '#FFB800' }}>{stats.flagged}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Flagged (CAPA)</p>
        </div>
        <div className="card p-4">
          <CheckCircle2 className="w-5 h-5 mb-2" style={{ color: '#00FF88' }} />
          <p className="text-3xl font-extrabold text-white">{stats.approved}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Approved (period)</p>
        </div>
        <div className="card p-4">
          <Clock className="w-5 h-5 mb-2" style={{ color: '#FF2D55' }} />
          <p className="text-3xl font-extrabold" style={{ color: '#FF2D55' }}>{stats.overdue}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Past deadline</p>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Latest submissions</h2>
          <Link to="/queue" className="text-xs flex items-center gap-1" style={{ color: 'var(--sentinel-300)' }}>
            Open queue <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <ul className="space-y-2">
          {queue.map((inst) => (
            <li
              key={inst.id}
              className="flex items-center justify-between gap-4 rounded-lg px-3 py-2"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  {inst.template?.name}{' '}
                  <span className="font-mono-ui text-xs" style={{ color: 'var(--text-muted)' }}>
                    {inst.template?.code}
                  </span>
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {inst.assignee?.name || inst.assignee?.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={inst.status} />
                <Link to={`/submissions/${inst.id}`} className="btn-ghost text-xs py-2">
                  Review
                </Link>
              </div>
            </li>
          ))}
          {queue.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No submissions in queue.
            </p>
          )}
        </ul>
      </div>
    </div>
  )
}

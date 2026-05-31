import { Link } from 'react-router-dom'
import { AlertTriangle, CalendarClock, Users, ChevronRight } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import { CONDITION_LABEL, CONDITION_STYLE } from '../data/seedRegistry.js'

export default function CommandDashboard() {
  const { stats, exceptions } = useRegistry()
  const priority = exceptions.filter((e) => e.status === 'OPEN' && e.severity === 'HIGH').slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Command dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Start with open exceptions — {stats.openExceptions} need coordinator action.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/exceptions" className="card p-4 hover:border-[rgba(255,45,85,0.35)] transition">
          <AlertTriangle className="w-5 h-5 mb-2" style={{ color: '#FF2D55' }} />
          <p className="text-3xl font-extrabold text-white">{stats.openExceptions}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Open exceptions</p>
        </Link>
        <div className="card p-4">
          <CalendarClock className="w-5 h-5 mb-2 badge-chronic" />
          <p className="text-3xl font-extrabold" style={{ color: 'var(--neon-amber)' }}>{stats.reviewsDue}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reviews due (14d)</p>
        </div>
        <Link to="/patients" className="card p-4 hover:border-[rgba(168,31,56,0.35)] transition">
          <Users className="w-5 h-5 mb-2" style={{ color: '#D96070' }} />
          <p className="text-3xl font-extrabold text-white">{stats.total}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Registry enrollees</p>
        </Link>
        {Object.entries(stats.byCondition).map(([k, n]) => (
          <div key={k} className="card p-4">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{CONDITION_LABEL[k]}</p>
            <p className="text-2xl font-bold" style={{ color: CONDITION_STYLE[k]?.color }}>{n}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Priority exceptions</h2>
          <Link to="/exceptions" className="text-xs flex items-center gap-1" style={{ color: 'var(--burg-300)' }}>
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <ul className="space-y-2">
          {priority.map((ex) => (
            <li key={ex.id} className="flex items-center justify-between gap-4 rounded-lg px-3 py-2" style={{ background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.15)' }}>
              <div>
                <p className="text-sm font-semibold text-white">{ex.patientName} <span className="font-mono-ui text-xs" style={{ color: 'var(--text-muted)' }}>{ex.registryId}</span></p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ex.summary}</p>
              </div>
              <Link to={`/patients/${ex.patientId}`} className="btn-ghost text-xs py-2">Open chart</Link>
            </li>
          ))}
          {priority.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No high-severity open exceptions.</p>}
        </ul>
      </div>
    </div>
  )
}

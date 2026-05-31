import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'

const SEV = { HIGH: { color: '#FF2D55', bg: 'rgba(255,45,85,0.12)' }, MODERATE: { color: '#FFB800', bg: 'rgba(255,184,0,0.1)' } }
const STATUS_OPTS = ['OPEN', 'IN_PROGRESS', 'CONTACTED', 'RESOLVED']

export default function ExceptionQueue() {
  const { exceptions, updateException } = useRegistry()
  const [filter, setFilter] = useState('OPEN')

  const rows = exceptions.filter((e) => (filter === 'ALL' ? true : e.status === filter || (filter === 'OPEN' && !['RESOLVED', 'CLOSED'].includes(e.status))))

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle style={{ color: '#FF2D55' }} /> Exception queue
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Outreach coordinators — assign and track contact status.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['OPEN', 'IN_PROGRESS', 'CONTACTED', 'RESOLVED', 'ALL'].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === f ? 'tab-active' : 'tab-idle'}`}>{f.replace('_', ' ')}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'var(--bg-raised)' }}>
              {['Patient', 'Type', 'Severity', 'Summary', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 font-mono-ui text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((ex) => (
              <tr key={ex.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="px-4 py-3">
                  <Link to={`/patients/${ex.patientId}`} className="font-semibold text-white hover:underline">{ex.patientName}</Link>
                  <p className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>{ex.registryId}</p>
                </td>
                <td className="px-4 py-3 font-mono-ui text-xs">{ex.type}</td>
                <td className="px-4 py-3">
                  <span className="badge" style={SEV[ex.severity] || SEV.MODERATE}>{ex.severity}</span>
                </td>
                <td className="px-4 py-3 text-xs max-w-xs" style={{ color: 'var(--text-secondary)' }}>{ex.summary}</td>
                <td className="px-4 py-3">
                  <select className="input-field py-2 min-h-0 text-xs" value={ex.status} onChange={(e) => updateException(ex.id, { status: e.target.value })}>
                    {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="btn-ghost text-xs py-2" onClick={() => updateException(ex.id, { assignee: 'Demo Coordinator', status: 'IN_PROGRESS' })}>Assign to me</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

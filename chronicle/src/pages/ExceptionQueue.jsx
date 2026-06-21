import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Droplet, Download } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import { careGapSummary } from '../data/seedRegistry.js'
import { buildCareGapReport, buildFunderAuditReport } from '../lib/reportBuilders.js'
import { downloadReport } from '../lib/download.js'

const SEV = { HIGH: { color: '#FF2D55', bg: 'rgba(255,45,85,0.12)' }, MODERATE: { color: '#FFB800', bg: 'rgba(255,184,0,0.1)' } }
const STATUS_OPTS = ['OPEN', 'IN_PROGRESS', 'CONTACTED', 'RESOLVED']

export default function ExceptionQueue() {
  const { exceptions, patients, updateException } = useRegistry()
  const [filter, setFilter] = useState('OPEN')

  const gapSummary = careGapSummary(patients)
  const missedTxOpen = exceptions.filter((e) => e.type === 'MISSED_TRANSFUSION' && !['RESOLVED', 'CLOSED'].includes(e.status)).length

  const rows = exceptions.filter((e) => {
    if (filter === 'ALL') return true
    if (filter === 'MISSED_TRANSFUSION') return e.type === 'MISSED_TRANSFUSION'
    return e.status === filter || (filter === 'OPEN' && !['RESOLVED', 'CLOSED'].includes(e.status))
  })

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle style={{ color: '#FF2D55' }} /> Exception queue
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Outreach coordinators — assign and track contact status.</p>
      </div>

      {/* Missed-transfusion alerts + care-gap reporting */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setFilter('MISSED_TRANSFUSION')}
          className="card p-4 text-left transition"
          style={filter === 'MISSED_TRANSFUSION' ? { borderColor: '#FF2D55' } : { borderColor: 'rgba(255,45,85,0.3)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Droplet className="w-4 h-4" style={{ color: '#FF2D55' }} />
            <span className="text-[10px] font-mono-ui uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Missed Transfusion Alerts</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#FF2D55' }}>{missedTxOpen}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Tap to filter the queue</p>
        </button>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4" style={{ color: '#FFB800' }} />
            <span className="text-[10px] font-mono-ui uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Open Care Gaps</span>
          </div>
          <p className="text-2xl font-bold text-white">{gapSummary.total}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{gapSummary.highSeverity} high severity</p>
        </div>
        <div className="card p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono-ui uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Care Gap Reports</span>
          <div className="flex flex-col gap-2">
            <button type="button" className="btn-ghost text-xs py-2 flex items-center justify-center gap-1.5" onClick={() => downloadReport(buildCareGapReport(patients))}>
              <Download className="w-3.5 h-3.5" /> Care gap report (CSV)
            </button>
            <button type="button" className="btn-primary text-xs py-2 flex items-center justify-center gap-1.5" onClick={() => downloadReport(buildFunderAuditReport(patients))}>
              <Download className="w-3.5 h-3.5" /> Funder audit · BIPAI
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['OPEN', 'IN_PROGRESS', 'CONTACTED', 'RESOLVED', 'MISSED_TRANSFUSION', 'ALL'].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === f ? 'tab-active' : 'tab-idle'}`}>{f.replace(/_/g, ' ')}</button>
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
            {rows.map((ex) => {
              const isMissedTx = ex.type === 'MISSED_TRANSFUSION'
              return (
              <tr key={ex.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isMissedTx ? 'rgba(255,45,85,0.05)' : 'transparent' }}>
                <td className="px-4 py-3">
                  <Link to={`/patients/${ex.patientId}`} className="font-semibold text-white hover:underline">{ex.patientName}</Link>
                  <p className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>{ex.registryId}</p>
                </td>
                <td className="px-4 py-3 font-mono-ui text-xs">
                  <span className="inline-flex items-center gap-1">
                    {isMissedTx && <Droplet className="w-3 h-3" style={{ color: '#FF2D55' }} />}
                    {ex.type}
                  </span>
                </td>
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

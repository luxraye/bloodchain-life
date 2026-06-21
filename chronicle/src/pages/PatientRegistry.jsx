import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ChevronRight, Droplet, AlertTriangle, Download } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import {
  CONDITION_LABEL,
  CONDITION_STYLE,
  careGapSummary,
  isTransfusionOverdue,
} from '../data/seedRegistry.js'
import { buildCareGapReport, buildFunderAuditReport } from '../lib/reportBuilders.js'
import { downloadReport } from '../lib/download.js'

export default function PatientRegistry() {
  const { patients } = useRegistry()
  const [filter, setFilter] = useState('ALL')
  const [q, setQ] = useState('')
  const [missedOnly, setMissedOnly] = useState(false)

  const gapSummary = useMemo(() => careGapSummary(patients), [patients])

  const filtered = useMemo(() => {
    let list = filter === 'ALL' ? patients : patients.filter((p) => p.condition === filter)
    if (missedOnly) {
      list = list.filter((p) => (p.careGaps || []).some((g) => g.type === 'MISSED_TRANSFUSION' && g.status === 'OPEN'))
    }
    if (q.trim()) {
      const s = q.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.registryId.toLowerCase().includes(s) || p.site.toLowerCase().includes(s))
    }
    return list
  }, [patients, filter, q, missedOnly])

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users style={{ color: 'var(--burg-300)' }} /> Patient registry</h1>

        {/* Care-gap / missed-transfusion summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <button
            type="button"
            onClick={() => setMissedOnly((v) => !v)}
            className="card p-4 text-left transition"
            style={missedOnly ? { borderColor: '#FF2D55' } : { borderColor: 'rgba(255,45,85,0.3)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Droplet className="w-4 h-4" style={{ color: '#FF2D55' }} />
              <span className="text-[10px] font-mono-ui uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Missed Transfusion Alerts</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#FF2D55' }}>{gapSummary.missedTransfusions}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{missedOnly ? 'Showing only — tap to clear' : 'Tap to filter the list'}</p>
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

        <input className="input-field mt-4 max-w-md" placeholder="Search name, registry ID, site…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'HAEMOPHILIA', 'SICKLE_CELL', 'THALASSEMIA'].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === f ? 'tab-active' : 'tab-idle'}`}>
            {f === 'ALL' ? 'All' : CONDITION_LABEL[f]}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((p) => {
          const st = CONDITION_STYLE[p.condition]
          const openGaps = p.careGaps.filter((g) => g.status === 'OPEN').length
          const missedTx = p.careGaps.some((g) => g.type === 'MISSED_TRANSFUSION' && g.status === 'OPEN')
          return (
            <Link key={p.id} to={`/patients/${p.id}`}
              className="card block p-5 transition group"
              style={missedTx ? { borderColor: 'rgba(255,45,85,0.45)' } : undefined}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="font-mono-ui text-xs font-bold" style={{ color: 'var(--burg-300)' }}>{p.registryId}</span>
                    <span className="badge" style={{ background: st.bg, color: st.color }}>{CONDITION_LABEL[p.condition]}</span>
                    {p.severity && <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{p.severity}</span>}
                    {missedTx && (
                      <span className="badge inline-flex items-center gap-1" style={{ background: 'rgba(255,45,85,0.12)', color: '#FF2D55' }}>
                        <Droplet className="w-3 h-3" /> Missed transfusion
                      </span>
                    )}
                    {openGaps > 0 && <span className="badge-chronic">{openGaps} gap(s)</span>}
                  </div>
                  <h2 className="text-lg font-semibold text-white">{p.name}{p.age ? <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}> · age {p.age}</span> : null}</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{p.site}</p>
                  {p.nextTransfusionDue && (
                    <p className="text-[11px] mt-1" style={{ color: isTransfusionOverdue(p) ? '#FF2D55' : 'var(--text-muted)' }}>
                      Next transfusion: {new Date(p.nextTransfusionDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {isTransfusionOverdue(p) ? ' · OVERDUE' : ''}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

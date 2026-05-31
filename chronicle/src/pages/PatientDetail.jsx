import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Droplets, ClipboardList, FileText, AlertCircle, ScrollText } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import { CONDITION_LABEL, CONDITION_STYLE } from '../data/seedRegistry.js'

const TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'careplan', label: 'Care plan', icon: ClipboardList },
  { id: 'transfusions', label: 'Transfusions', icon: Droplets },
  { id: 'gaps', label: 'Care gaps', icon: AlertCircle },
  { id: 'audit', label: 'Audit', icon: ScrollText },
]

export default function PatientDetail() {
  const { patientId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'
  const { getPatient, updateCarePlan, resolveCareGap } = useRegistry()
  const patient = getPatient(patientId)
  const [planDraft, setPlanDraft] = useState(null)

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p style={{ color: 'var(--text-secondary)' }}>Patient not found.</p>
        <Link to="/patients" style={{ color: 'var(--burg-300)' }}>Back to registry</Link>
      </div>
    )
  }

  const st = CONDITION_STYLE[patient.condition]
  const plan = planDraft ?? patient.carePlan

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link to="/patients" className="inline-flex items-center gap-1.5 text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Registry
      </Link>
      <ConstellationBoundary />
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="font-mono-ui text-sm font-bold" style={{ color: 'var(--burg-300)' }}>{patient.registryId}</span>
          <span className="badge" style={{ background: st.bg, color: st.color }}>{CONDITION_LABEL[patient.condition]}</span>
        </div>
        <h1 className="text-2xl font-bold text-white">{patient.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{patient.site} · Review {patient.nextReview}</p>
        <a href={`http://localhost:5178/transfusion?patient=${patient.registryId}`} target="_blank" rel="noreferrer" className="text-xs mt-2 inline-block" style={{ color: 'var(--azure-300)' }}>
          Open acute transfusion context in Transfuse (demo link)
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setSearchParams({ tab: id })} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold ${tab === id ? 'tab-active' : 'tab-idle'}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card p-6 space-y-4">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="field-label">Severity</dt><dd className="text-white">{patient.severity}</dd></div>
            <div><dt className="field-label">Blood type</dt><dd className="text-white">{patient.bloodType}</dd></div>
            <div><dt className="field-label">Enrolled</dt><dd className="text-white">{patient.enrolledAt}</dd></div>
            <div><dt className="field-label">Custodian</dt><dd className="text-white">{patient.carePlan.custodian}</dd></div>
          </dl>
          {patient.sdohFlags?.length > 0 && (
            <div>
              <p className="field-label">SDOH flags</p>
              <ul className="text-xs space-y-1" style={{ color: 'var(--neon-amber)' }}>{patient.sdohFlags.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
          )}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{patient.notes}</p>
        </div>
      )}

      {tab === 'careplan' && (
        <div className="card p-6 space-y-4">
          <p className="field-label">MCC-style care plan (demo)</p>
          <div>
            <label className="field-label">Custodian site</label>
            <input className="input-field" value={plan.custodian} onChange={(e) => setPlanDraft({ ...plan, custodian: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Prophylaxis / maintenance</label>
            <textarea className="input-field min-h-[80px]" value={plan.prophylaxis} onChange={(e) => setPlanDraft({ ...plan, prophylaxis: e.target.value })} />
          </div>
          {plan.lastFactorLot && (
            <div>
              <label className="field-label">Last factor lot</label>
              <p className="font-mono-ui text-sm" style={{ color: 'var(--azure-300)' }}>{plan.lastFactorLot}</p>
            </div>
          )}
          <div>
            <label className="field-label">Care target</label>
            <input className="input-field" value={plan.target} onChange={(e) => setPlanDraft({ ...plan, target: e.target.value })} />
          </div>
          <button type="button" className="btn-primary" onClick={() => { updateCarePlan(patient.id, plan); setPlanDraft(null) }}>Save care plan</button>
        </div>
      )}

      {tab === 'transfusions' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-raised)' }}>
                {['Date', 'Product', 'Units', 'Site'].map((h) => <th key={h} className="text-left px-4 py-2 font-mono-ui text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {patient.transfusions.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 font-mono-ui text-xs">{t.date}</td>
                  <td className="px-4 py-3">{t.product}</td>
                  <td className="px-4 py-3">{t.units}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{t.site}</td>
                </tr>
              ))}
              {patient.transfusions.length === 0 && <tr><td colSpan={4} className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>No transfusion records</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'gaps' && (
        <div className="space-y-3">
          {patient.careGaps.map((g) => (
            <div key={g.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{g.summary}</p>
                <p className="text-xs font-mono-ui" style={{ color: 'var(--text-muted)' }}>{g.type} · {g.severity}</p>
              </div>
              {g.status === 'OPEN' ? (
                <button type="button" className="btn-ghost text-xs" onClick={() => resolveCareGap(patient.id, g.id)}>Resolve</button>
              ) : (
                <span className="badge" style={{ color: 'var(--neon-green)', background: 'rgba(0,255,136,0.1)' }}>{g.status}</span>
              )}
            </div>
          ))}
          {patient.careGaps.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No open care gaps.</p>}
        </div>
      )}

      {tab === 'audit' && (
        <div className="card p-5">
          <ul className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
            {patient.auditLog.map((e, i) => (
              <li key={i}>{e.action} — {e.user} · {new Date(e.at).toLocaleString()}</li>
            ))}
            {patient.auditLog.length === 0 && <li>No audit entries this session.</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

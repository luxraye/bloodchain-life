import { useState } from 'react'
import { ShieldAlert, Plus, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const EVENT_TYPES = [
  'Febrile non-haemolytic reaction',
  'Allergic / anaphylactic',
  'Acute haemolytic transfusion reaction',
  'Transfusion-associated circulatory overload (TACO)',
  'Transfusion-related acute lung injury (TRALI)',
  'Bacterial contamination suspected',
  'Other — specify in narrative',
]

const SEVERITY_STYLE = {
  MILD: { color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  MODERATE: { color: '#5BA4D4', bg: 'rgba(58,130,184,0.12)' },
  SEVERE: { color: '#FF2D55', bg: 'rgba(255,45,85,0.12)' },
  FATAL: { color: '#FF2D55', bg: 'rgba(255,45,85,0.2)' },
}

export default function Haemovigilance() {
  const { adverseEvents, reportAdverseEvent, addNotification } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    patientRef: '',
    unitId: '',
    eventType: EVENT_TYPES[0],
    severity: 'MODERATE',
    narrative: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.patientRef.trim() || !form.narrative.trim()) {
      addNotification('Patient reference and narrative are required', 'error')
      return
    }
    reportAdverseEvent({
      ...form,
      patientRef: form.patientRef.trim(),
      unitId: form.unitId.trim() || null,
    })
    addNotification('Adverse event reported — queued for transfusion committee review', 'success')
    setForm({ patientRef: '', unitId: '', eventType: EVENT_TYPES[0], severity: 'MODERATE', narrative: '' })
    setShowForm(false)
  }

  const openCount = adverseEvents.filter(a => a.status !== 'CLOSED').length

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: '#A81F38' }}>
            Clinical Safety · Haemovigilance
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#F0F4F8' }}>Adverse Events</h1>
          <p className="text-sm mt-1" style={{ color: '#4A5568' }}>
            WHO-aligned transfusion reaction reporting for hospital transfusion committees. Demo records are local only.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {openCount > 0 && (
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', color: '#FF2D55' }}
            >
              <AlertTriangle className="w-3 h-3" />{openCount} open
            </span>
          )}
          <button type="button" onClick={() => setShowForm(v => !v)} className="btn-primary flex items-center gap-2 text-sm">
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Report event</>}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6 space-y-4 animate-slide-up" style={{ borderColor: 'rgba(255,45,85,0.25)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2" style={{ color: '#FF2D55' }}>
            <ShieldAlert className="w-4 h-4" /> New adverse transfusion event
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Patient reference</label>
              <input
                className="input-field"
                value={form.patientRef}
                onChange={e => setForm(p => ({ ...p, patientRef: e.target.value }))}
                placeholder="PAT-2026-001 or MRN"
              />
            </div>
            <div>
              <label className="label-field">Blood unit ID (if known)</label>
              <input
                className="input-field"
                value={form.unitId}
                onChange={e => setForm(p => ({ ...p, unitId: e.target.value }))}
                placeholder="TF-2026-0041"
              />
            </div>
            <div>
              <label className="label-field">Event type</label>
              <select className="input-field" value={form.eventType} onChange={e => setForm(p => ({ ...p, eventType: e.target.value }))}>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Severity</label>
              <select className="input-field" value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}>
                {['MILD', 'MODERATE', 'SEVERE', 'FATAL'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Clinical narrative</label>
            <textarea
              className="input-field min-h-[88px] resize-y"
              value={form.narrative}
              onChange={e => setForm(p => ({ ...p, narrative: e.target.value }))}
              placeholder="Onset time, signs/symptoms, interventions, outcome…"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary text-sm">Submit to committee queue</button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>Event register</p>
          <span className="text-xs" style={{ color: '#4A5568' }}>{adverseEvents.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0C0F1A' }}>
                {['ID', 'Patient', 'Unit', 'Event', 'Severity', 'Status', 'Reported'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#4A5568' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adverseEvents.map(ev => (
                <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 font-mono text-[11px]" style={{ color: '#5BA4D4' }}>{ev.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#F0F4F8' }}>{ev.patientRef}</td>
                  <td className="px-4 py-3 font-mono text-[11px]" style={{ color: '#8899A8' }}>{ev.unitId || '—'}</td>
                  <td className="px-4 py-3 text-xs max-w-[200px]" style={{ color: '#8899A8' }}>{ev.eventType}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={SEVERITY_STYLE[ev.severity]}>
                      {ev.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,184,0,0.1)', color: '#FFB800' }}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8899A8' }}>
                    {new Date(ev.reportedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {adverseEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#4A5568' }}>
                    No adverse events recorded this session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

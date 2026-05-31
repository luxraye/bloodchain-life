import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import {
  Users, Send, CheckCircle2, XCircle, Clock,
  MapPin, Phone, ChevronDown, ChevronUp, FileText,
  Navigation, Droplets, Zap, UserCheck, X,
} from 'lucide-react'

const STATUS_CONFIG = {
  STANDBY:             { label: 'On Standby',         dotColor: '#FFB800', tagBg: 'rgba(255,184,0,0.1)',   tagColor: '#FFB800',  tagBorder: 'rgba(255,184,0,0.3)'  },
  SCREENING_SENT:      { label: 'Screening Sent',     dotColor: '#00C8FF', tagBg: 'rgba(0,200,255,0.1)',  tagColor: '#00C8FF',  tagBorder: 'rgba(0,200,255,0.3)'  },
  SCREENING_SUBMITTED: { label: 'Screening Returned', dotColor: '#A78BFA', tagBg: 'rgba(167,139,250,0.1)', tagColor: '#A78BFA', tagBorder: 'rgba(167,139,250,0.3)' },
  APPROVED:            { label: 'Approved',           dotColor: '#00FF88', tagBg: 'rgba(0,255,136,0.1)',  tagColor: '#00FF88',  tagBorder: 'rgba(0,255,136,0.3)'  },
  DIRECTIVE_SENT:      { label: 'Directive Sent',     dotColor: '#5BA4D4', tagBg: 'rgba(91,164,212,0.1)', tagColor: '#5BA4D4',  tagBorder: 'rgba(91,164,212,0.3)' },
  REJECTED:            { label: 'Rejected',           dotColor: '#FF2D55', tagBg: 'rgba(255,45,85,0.1)',  tagColor: '#FF2D55',  tagBorder: 'rgba(255,45,85,0.3)'  },
}

const PIPELINE = ['STANDBY', 'SCREENING_SENT', 'SCREENING_SUBMITTED', 'APPROVED', 'DIRECTIVE_SENT']

const donorName = d => d.donorName || d.name || 'Unknown'
const initials  = d => donorName(d).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

export default function StandbyDonors() {
  const { standbyDonors, updateStandbyDonor, addNotification } = useApp()
  const [expandedId,    setExpandedId]    = useState(null)
  const [filterStatus,  setFilterStatus]  = useState('ALL')
  const [directiveForm, setDirectiveForm] = useState(null)

  const filtered     = useMemo(() => filterStatus === 'ALL' ? standbyDonors : standbyDonors.filter(d => d.status === filterStatus), [standbyDonors, filterStatus])
  const statusCounts = useMemo(() => {
    const c = { ALL: standbyDonors.length }
    standbyDonors.forEach(d => { c[d.status] = (c[d.status] || 0) + 1 })
    return c
  }, [standbyDonors])

  const handleSendScreening = id => {
    updateStandbyDonor(id, { status: 'SCREENING_SENT', screeningForm: { sentAt: new Date().toISOString() } })
    addNotification('Preliminary screening form sent', 'success')
  }
  const handleSimulate = donor => {
    updateStandbyDonor(donor.id, {
      status: 'SCREENING_SUBMITTED',
      screeningResponse: { submittedAt: new Date().toISOString(), weight: 60 + Math.floor(Math.random() * 30), lastMeal: `${2 + Math.floor(Math.random() * 4)} hours ago`, recentIllness: false, medications: 'None', feelingWell: true, tattooOrPiercing: Math.random() > 0.85, pregnant: false, hadSurgery: false },
    })
    addNotification(`Screening response from ${donorName(donor)}`, 'info')
  }
  const handleApprove = id => { updateStandbyDonor(id, { status: 'APPROVED' }); addNotification('Donor approved', 'success') }
  const handleReject  = id => { updateStandbyDonor(id, { status: 'REJECTED', directive: { rejectedAt: new Date().toISOString(), rejectedBy: 'Clinician', reason: 'Did not pass screening' } }); addNotification('Donor rejected', 'warning') }
  const handleOpenDirective = donor => setDirectiveForm({ id: donor.id, donorName: donorName(donor), location: 'Princess Marina Hospital, Blood Bank Wing', date: 'today', timeStart: '14:00', timeEnd: '16:00', doctorName: 'Dr. Sithole', supportPhone: '+267 361 0000', notes: 'Please bring your Omang ID and drink plenty of water.' })
  const handleSendDirective = () => {
    updateStandbyDonor(directiveForm.id, { status: 'DIRECTIVE_SENT', directive: { sentAt: new Date().toISOString(), ...directiveForm } })
    addNotification(`Directive sent to ${directiveForm.donorName}`, 'success')
    setDirectiveForm(null)
  }

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: '#A81F38' }}>Blood Bank · Standby</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#F0F4F8' }}>Standby Donor Management</h1>
          <p className="text-sm mt-1" style={{ color: '#4A5568' }}>Screen, approve, and dispatch donors who responded to blood requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', color: '#FFB800' }}>
            <Zap className="w-3 h-3" />{statusCounts['STANDBY'] || 0} awaiting
          </span>
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#A78BFA' }}>
            <FileText className="w-3 h-3" />{statusCounts['SCREENING_SUBMITTED'] || 0} to review
          </span>
        </div>
      </div>

      {/* Pipeline filter */}
      <div className="card p-3.5 mb-5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setFilterStatus('ALL')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
            style={filterStatus === 'ALL' ? { background: '#A81F38', color: '#fff' } : { background: 'rgba(255,255,255,0.04)', color: '#8899A8' }}>
            All ({statusCounts.ALL || 0})
          </button>
          {[...PIPELINE, 'REJECTED'].map(step => {
            const cfg = STATUS_CONFIG[step]
            const active = filterStatus === step
            return (
              <button key={step} onClick={() => setFilterStatus(step)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                style={active ? { background: cfg.tagBg, color: cfg.tagColor, border: `1px solid ${cfg.tagBorder}` } : { background: 'rgba(255,255,255,0.03)', color: '#4A5568', border: '1px solid transparent' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dotColor }} />
                {cfg.label} ({statusCounts[step] || 0})
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Directive modal — scrollable, buttons always visible ── */}
      {directiveForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={() => setDirectiveForm(null)}>
          <div className="w-full max-w-lg flex flex-col overflow-hidden rounded-2xl animate-slide-up"
            style={{ maxHeight: '90vh', background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}>

            {/* Header — fixed */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(58,130,184,0.15)', border: '1px solid rgba(58,130,184,0.3)' }}>
                  <Navigation className="w-4 h-4" style={{ color: '#5BA4D4' }} />
                </div>
                <div>
                  <h2 className="text-sm font-bold" style={{ color: '#F0F4F8' }}>Send Donation Directive</h2>
                  <p className="text-xs" style={{ color: '#4A5568' }}>Instructions for {directiveForm.donorName}</p>
                </div>
              </div>
              <button onClick={() => setDirectiveForm(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition"
                style={{ color: '#4A5568', border: '1px solid rgba(255,255,255,0.09)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#F0F4F8' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="label-field flex items-center gap-1"><MapPin className="w-3 h-3" />Donation Location</label>
                <input value={directiveForm.location} onChange={e => setDirectiveForm(f => ({ ...f, location: e.target.value }))} className="input-field" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label-field">Date</label>
                  <select value={directiveForm.date} onChange={e => setDirectiveForm(f => ({ ...f, date: e.target.value }))} className="input-field">
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                  </select>
                </div>
                <div><label className="label-field">From</label><input type="time" value={directiveForm.timeStart} onChange={e => setDirectiveForm(f => ({ ...f, timeStart: e.target.value }))} className="input-field" /></div>
                <div><label className="label-field">To</label><input type="time" value={directiveForm.timeEnd} onChange={e => setDirectiveForm(f => ({ ...f, timeEnd: e.target.value }))} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-field flex items-center gap-1"><UserCheck className="w-3 h-3" />Ask for Doctor</label><input value={directiveForm.doctorName} onChange={e => setDirectiveForm(f => ({ ...f, doctorName: e.target.value }))} className="input-field" /></div>
                <div><label className="label-field flex items-center gap-1"><Phone className="w-3 h-3" />Support Phone</label><input value={directiveForm.supportPhone} onChange={e => setDirectiveForm(f => ({ ...f, supportPhone: e.target.value }))} className="input-field" /></div>
              </div>
              <div>
                <label className="label-field">Notes</label>
                <textarea value={directiveForm.notes} onChange={e => setDirectiveForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                  className="input-field resize-none" style={{ lineHeight: '1.55' }} />
              </div>
              {/* Preview */}
              <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] mb-2" style={{ color: '#4A5568' }}>Directive Preview</p>
                <p className="text-sm leading-relaxed" style={{ color: '#8899A8' }}>
                  "Proceed to <strong style={{ color: '#F0F4F8' }}>{directiveForm.location}</strong> between{' '}
                  <strong style={{ color: '#F0F4F8' }}>{directiveForm.timeStart}–{directiveForm.timeEnd} {directiveForm.date}</strong>.
                  Ask for <strong style={{ color: '#F0F4F8' }}>{directiveForm.doctorName}</strong>."
                </p>
              </div>
            </div>

            {/* Footer — always visible */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}>
              <button onClick={() => setDirectiveForm(null)} className="btn-outline text-sm">Cancel</button>
              <button onClick={handleSendDirective} className="btn-secondary flex items-center gap-2 text-sm">
                <Send className="w-4 h-4" />Send Directive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donor cards */}
      <div className="space-y-3">
        {filtered.map(donor => {
          const cfg      = STATUS_CONFIG[donor.status] || STATUS_CONFIG.STANDBY
          const expanded = expandedId === donor.id
          const stepIdx  = PIPELINE.indexOf(donor.status)

          return (
            <div key={donor.id} className="card overflow-hidden animate-fade-in">
              {/* Card header */}
              <div className="px-5 py-4 flex items-center justify-between cursor-pointer transition-colors"
                style={{ borderBottom: expanded ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => setExpandedId(expanded ? null : donor.id)}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: 'rgba(255,255,255,0.07)', color: '#8899A8' }}>
                      {initials(donor)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                      style={{ background: cfg.dotColor, borderColor: '#07090F' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold" style={{ color: '#F0F4F8' }}>{donorName(donor)}</h3>
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#D96070' }}>
                        <Droplets className="w-3 h-3" />{donor.bloodType}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#4A5568' }}>
                      {donor.distance} away · {donor.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: cfg.tagBg, color: cfg.tagColor, border: `1px solid ${cfg.tagBorder}` }}>
                    {cfg.label}
                  </span>
                  {expanded
                    ? <ChevronUp  className="w-4 h-4" style={{ color: '#4A5568' }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: '#4A5568' }} />}
                </div>
              </div>

              {/* Expanded body */}
              {expanded && (
                <div className="px-5 pb-5 animate-fade-in">
                  {/* Pipeline progress */}
                  <div className="py-4">
                    <div className="flex items-center">
                      {PIPELINE.map((step, i) => {
                        const done = stepIdx >= i
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: done ? '#3A82B8' : 'rgba(255,255,255,0.07)', color: done ? '#fff' : '#4A5568' }}>
                                {done ? '✓' : i + 1}
                              </div>
                              <span className="text-[9px] mt-1 font-semibold text-center leading-tight"
                                style={{ color: done ? '#5BA4D4' : '#4A5568' }}>
                                {STATUS_CONFIG[step].label}
                              </span>
                            </div>
                            {i < PIPELINE.length - 1 && (
                              <div className="h-0.5 flex-1 -mt-4 mx-1 rounded"
                                style={{ background: stepIdx > i ? '#3A82B8' : 'rgba(255,255,255,0.07)' }} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-5 mb-4 text-xs" style={{ color: '#8899A8' }}>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{donor.phone || '—'}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{donor.location}</span>
                  </div>

                  {/* Screening response */}
                  {donor.screeningResponse && (
                    <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] mb-3 flex items-center gap-1.5" style={{ color: '#4A5568' }}>
                        <FileText className="w-3.5 h-3.5" />Screening Response ·
                        <span>{new Date(donor.screeningResponse.submittedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          ['Weight',       `${donor.screeningResponse.weight} kg`,                                           false],
                          ['Last Meal',    donor.screeningResponse.lastMeal,                                                 false],
                          ['Recent Illness', donor.screeningResponse.recentIllness ? 'Yes ⚠' : 'No ✓',  donor.screeningResponse.recentIllness],
                          ['Medications',  donor.screeningResponse.medications,                                              false],
                          ['Feeling Well', donor.screeningResponse.feelingWell    ? 'Yes ✓' : 'No ⚠', !donor.screeningResponse.feelingWell],
                          ['Tattoo/Pierce',donor.screeningResponse.tattooOrPiercing ? 'Yes ⚠' : 'No ✓', donor.screeningResponse.tattooOrPiercing],
                        ].map(([lbl, val, warn]) => (
                          <div key={lbl} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: '#4A5568' }}>{lbl}</p>
                            <p className="text-sm font-bold" style={{ color: warn ? '#FF2D55' : '#F0F4F8' }}>{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    {donor.status === 'STANDBY' && (
                      <button onClick={() => handleSendScreening(donor.id)} className="btn-secondary flex items-center gap-2 text-sm">
                        <Send className="w-3.5 h-3.5" />Send Screening Form
                      </button>
                    )}
                    {donor.status === 'SCREENING_SENT' && (
                      <>
                        <div className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs"
                          style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)', color: '#00C8FF' }}>
                          <Clock className="w-3.5 h-3.5" />Awaiting donor submission…
                        </div>
                        <button onClick={() => handleSimulate(donor)} className="btn-outline flex items-center gap-1.5 text-xs">
                          <Zap className="w-3 h-3" />Simulate Response
                        </button>
                      </>
                    )}
                    {donor.status === 'SCREENING_SUBMITTED' && (
                      <>
                        <button onClick={() => handleApprove(donor.id)} className="btn-success flex items-center gap-2 text-sm"><CheckCircle2 className="w-3.5 h-3.5" />Approve</button>
                        <button onClick={() => handleReject(donor.id)}  className="btn-danger  flex items-center gap-2 text-sm"><XCircle      className="w-3.5 h-3.5" />Reject</button>
                      </>
                    )}
                    {donor.status === 'APPROVED' && (
                      <button onClick={() => handleOpenDirective(donor)} className="btn-secondary flex items-center gap-2 text-sm">
                        <Navigation className="w-3.5 h-3.5" />Send Donation Directive
                      </button>
                    )}
                    {donor.status === 'DIRECTIVE_SENT' && (
                      <div className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs"
                        style={{ background: 'rgba(91,164,212,0.1)', border: '1px solid rgba(91,164,212,0.25)', color: '#5BA4D4' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" />Directive sent — awaiting arrival
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#2E3548' }} />
            <h3 className="text-base font-semibold" style={{ color: '#8899A8' }}>No donors in this category</h3>
            <p className="text-sm mt-1" style={{ color: '#4A5568' }}>
              {filterStatus === 'ALL' ? 'No donors have responded to blood requests yet.' : `No donors with status "${STATUS_CONFIG[filterStatus]?.label || filterStatus}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

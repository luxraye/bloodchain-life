import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Download, UserPlus, TestTube2, ScrollText, LayoutGrid,
  Package, ClipboardList, ShieldCheck,
} from 'lucide-react'
import { useStudies } from '../context/StudyContext'
import { useAuth } from '../context/AuthContext'
import CustodyTimeline from '../components/CustodyTimeline'
import ConstellationBoundary from '../components/ConstellationBoundary'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'participants', label: 'Participants', icon: UserPlus },
  { id: 'preanalytical', label: 'Pre-analytical', icon: Package },
  { id: 'custody', label: 'Custody', icon: TestTube2 },
  { id: 'analytical', label: 'Analytical', icon: ClipboardList },
  { id: 'audit', label: 'Audit', icon: ScrollText },
]

const CONSENT_COLOR = {
  SIGNED: { color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  PENDING: { color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  WITHDRAWN: { color: '#FF2D55', bg: 'rgba(255,45,85,0.1)' },
}

export default function StudyDetail() {
  const { studyId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'
  const { getStudy, loadStudy, useApi } = useStudies()
  const { isReadOnly } = useAuth()
  const study = getStudy(studyId)

  useEffect(() => {
    if (studyId && useApi) loadStudy(studyId)
  }, [studyId, useApi, loadStudy])
  const [selectedSample, setSelectedSample] = useState(null)
  const [intakeId, setIntakeId] = useState('')
  const [intakeMsg, setIntakeMsg] = useState('')

  if (!study) {
    return (
      <div className="text-center py-20">
        <p style={{ color: 'var(--text-secondary)' }}>Study not found.</p>
        <Link to="/" className="text-sm mt-4 inline-block" style={{ color: 'var(--burg-300)' }}>← All studies</Link>
      </div>
    )
  }

  const setTab = (id) => setSearchParams({ tab: id })

  const handleIntake = (e) => {
    e.preventDefault()
    if (!intakeId.trim()) return
    setIntakeMsg(`Specimen ${intakeId.trim().toUpperCase()} queued for accession (demo).`)
    setIntakeId('')
    setTimeout(() => setIntakeMsg(''), 4000)
  }

  const sample = selectedSample
    ? study.samples.find((s) => s.id === selectedSample)
    : study.samples[0]

  const unacceptable = study.samples.filter((s) => s.receiptQC && !s.receiptQC.acceptable)

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> All studies
      </Link>

      <ConstellationBoundary />

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div>
          <p className="font-mono-ui text-xs font-bold mb-1" style={{ color: 'var(--burg-300)' }}>{study.code}</p>
          <h1 className="text-xl md:text-2xl font-bold text-white">{study.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {study.principalInvestigator} · {study.sponsor}
          </p>
        </div>
        <Link to={`/studies/${study.id}/export`} className="btn-primary inline-flex items-center gap-2 shrink-0">
          <Download className="w-4 h-4" /> IRB export
        </Link>
      </div>

      <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[44px] ${tab === id ? 'tab-active' : 'tab-idle'}`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Protocol & ethics</h3>
            <dl className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between"><dt>Status</dt><dd className="text-white font-mono-ui">{study.status}</dd></div>
              <div className="flex justify-between"><dt>Protocol</dt><dd className="text-white font-mono-ui">{study.protocolVersion}</dd></div>
              <div className="flex justify-between"><dt>Ethics ref</dt><dd className="text-white font-mono-ui">{study.ethicsRef}</dd></div>
              <div className="flex justify-between"><dt>Expiry</dt><dd className="text-white">{study.ethicsExpiry}</dd></div>
            </dl>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Sites</h3>
            <ul className="space-y-2">
              {study.sites.map((site) => (
                <li key={site} className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>{site}</li>
              ))}
            </ul>
          </div>
          {study.deviations?.length > 0 && (
            <div className="card p-5 md:col-span-2">
              <h3 className="text-sm font-semibold text-white mb-3">Protocol deviations</h3>
              {study.deviations.map((d) => (
                <div key={d.id} className="text-xs py-2 border-b border-white/[0.05] last:border-0" style={{ color: 'var(--text-secondary)' }}>
                  <span className="badge mr-2" style={{ background: 'rgba(255,184,0,0.12)', color: 'var(--neon-amber)' }}>{d.severity}</span>
                  {d.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'participants' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Study ID</th>
                  <th className="px-4 py-3">Arm</th>
                  <th className="px-4 py-3">Consent</th>
                  <th className="px-4 py-3">Site</th>
                  <th className="px-4 py-3">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {study.participants.map((p) => {
                  const c = CONSENT_COLOR[p.consent] ?? CONSENT_COLOR.PENDING
                  return (
                    <tr key={p.id} className="border-t border-white/[0.05]">
                      <td className="px-4 py-3 font-mono-ui text-white">{p.studyParticipantId}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.arm}</td>
                      <td className="px-4 py-3">
                        <span className="badge" style={{ background: c.bg, color: c.color }}>{p.consent}</span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }}>{p.site}</td>
                      <td className="px-4 py-3 font-mono-ui" style={{ color: 'var(--text-muted)' }}>{p.enrolledAt}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-3 text-[10px] font-mono-ui border-t border-white/[0.05]" style={{ color: 'var(--text-muted)' }}>
            Pseudonymized study IDs only — not national donor records (Azure/NBTS).
          </p>
        </div>
      )}

      {tab === 'preanalytical' && (
        <div className="space-y-4">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Pre-analytical phase: accession, receipt quality, cold-chain verification, and barcode assignment (WHO/CDC LIMS scope — research specimens).
          </p>
          {!isReadOnly && (
            <form onSubmit={handleIntake} className="card p-5 space-y-3 max-w-lg">
              <h3 className="text-sm font-semibold text-white">Accession — register specimen</h3>
              <label className="field-label">Specimen ID</label>
              <input className="input-field font-mono-ui" placeholder="RS-2026-0042" value={intakeId} onChange={(e) => setIntakeId(e.target.value)} />
              <p className="field-hint">Must match enrolled participant with signed consent.</p>
              <button type="submit" className="btn-primary w-full">Register for receipt QC</button>
              {intakeMsg && <p className="text-xs" style={{ color: 'var(--neon-green)' }}>{intakeMsg}</p>}
            </form>
          )}
          {unacceptable.length > 0 && (
            <div className="card p-4" style={{ borderColor: 'rgba(255,45,85,0.35)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--neon-red)' }}>Non-conformity — unacceptable receipt</p>
              {unacceptable.map((s) => (
                <p key={s.id} className="text-xs mt-2 font-mono-ui" style={{ color: 'var(--text-secondary)' }}>
                  {s.id}: temp {s.receiptQC.tempRange} — redraw required
                </p>
              ))}
            </div>
          )}
          <div className="card overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)' }}>
                <tr>
                  <th className="px-4 py-3">Specimen</th>
                  <th className="px-4 py-3">Cold chain</th>
                  <th className="px-4 py-3">Temp</th>
                  <th className="px-4 py-3">Packaging</th>
                  <th className="px-4 py-3">Acceptable</th>
                </tr>
              </thead>
              <tbody>
                {study.samples.slice(0, 12).map((s) => {
                  const qc = s.receiptQC ?? {}
                  return (
                    <tr key={s.id} className="border-t border-white/[0.05]">
                      <td className="px-4 py-3 font-mono-ui text-white">{s.id}</td>
                      <td className="px-4 py-3">{qc.coldChainPreserved ? '✓' : '✕'}</td>
                      <td className="px-4 py-3 font-mono-ui">{qc.tempRange ?? '—'}</td>
                      <td className="px-4 py-3">{qc.packagingIntact ? '✓' : '✕'}</td>
                      <td className="px-4 py-3">
                        <span className="badge" style={{
                          background: qc.acceptable ? 'rgba(0,255,136,0.1)' : 'rgba(255,45,85,0.1)',
                          color: qc.acceptable ? '#00FF88' : '#FF2D55',
                        }}>
                          {qc.acceptable ? 'YES' : 'NO'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'custody' && (
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 card p-4 max-h-[520px] overflow-y-auto">
            <h3 className="text-sm font-semibold text-white mb-3">Inventory ({study.samples.length})</h3>
            <ul className="space-y-1">
              {study.samples.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSample(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono-ui min-h-[44px] transition ${
                    sample?.id === s.id ? 'ring-1' : ''
                  }`}
                  style={{
                    background: sample?.id === s.id ? 'rgba(168,31,56,0.12)' : 'rgba(255,255,255,0.02)',
                    color: sample?.id === s.id ? 'var(--burg-300)' : 'var(--text-secondary)',
                    ringColor: 'rgba(168,31,56,0.4)',
                  }}
                >
                  {s.id}
                  {s.parentSampleId && <span className="block text-[9px] opacity-70">aliquot of {s.parentSampleId}</span>}
                  <span className="block text-[10px] mt-0.5">{s.status}</span>
                </button>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 card p-5">
            {sample ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono-ui text-sm font-bold text-white">{sample.id}</span>
                  <span className="badge" style={{ background: 'rgba(58,130,184,0.15)', color: '#5BA4D4' }}>{sample.status}</span>
                </div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Chain of custody</h4>
                <CustodyTimeline events={sample.custodyEvents} />
              </>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No consented specimens yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === 'analytical' && (
        <div className="space-y-4">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Research-run worksheets and QC holds. National TTI release and analyzer bidirectional interfaces remain in Mars Lab.
          </p>
          {(study.worksheets ?? []).length === 0 ? (
            <p className="text-sm card p-5" style={{ color: 'var(--text-muted)' }}>No worksheets for this study yet.</p>
          ) : (
            study.worksheets.map((ws) => (
              <div key={ws.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>{ws.id}</p>
                  <h3 className="text-sm font-semibold text-white">{ws.name}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {ws.sampleCount} specimens · {ws.priority} · Status: {ws.status}
                  </p>
                  {ws.qcNote && <p className="text-xs mt-2" style={{ color: 'var(--neon-amber)' }}>{ws.qcNote}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge" style={{
                    background: ws.qcStatus === 'PASS' ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.12)',
                    color: ws.qcStatus === 'PASS' ? '#00FF88' : '#FFB800',
                  }}>
                    QC {ws.qcStatus}
                  </span>
                  {ws.status === 'VERIFIED' && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--azure-300)' }}>
                      <ShieldCheck className="w-4 h-4" /> {ws.verifiedBy}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'audit' && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-2">ALCOA+ action log</h3>
          <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>
            Attributable, legible, contemporaneous, original, accurate — immutable trail for ethics review.
          </p>
          <ul className="space-y-3">
            {[...study.actionLog].reverse().map((entry, i) => (
              <li key={i} className="flex gap-3 text-xs border-b border-white/[0.05] pb-3 last:border-0">
                <div className="w-1 rounded-full shrink-0" style={{ background: 'var(--burg-500)' }} />
                <div>
                  <p className="text-white font-medium">{entry.action}</p>
                  {entry.field && (
                    <p className="font-mono-ui text-[10px] mt-1" style={{ color: 'var(--azure-300)' }}>
                      {entry.field}: {entry.oldValue} → {entry.newValue} ({entry.reason})
                    </p>
                  )}
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {entry.userName} · {entry.userRole} · {entry.facility}
                  </p>
                  <p className="font-mono-ui text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

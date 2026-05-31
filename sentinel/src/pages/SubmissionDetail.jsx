import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, FileKey, Loader2 } from 'lucide-react'
import { useCompliance } from '../context/ComplianceContext'
import StatusBadge from '../components/StatusBadge'

export default function SubmissionDetail() {
  const { id } = useParams()
  const { getById, review } = useCompliance()
  const inst = getById(id)
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  if (!inst) return <Navigate to="/queue" replace />

  const payload = inst.submissionPayload || inst.draftPayload

  const act = async (status) => {
    setBusy(true)
    try {
      await review(inst.id, status, notes)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link to="/queue" className="text-xs flex items-center gap-1 mb-4" style={{ color: 'var(--sentinel-300)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back to queue
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{inst.template?.name}</h1>
          <p className="font-mono-ui text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {inst.template?.code} · v{inst.template?.version}
          </p>
        </div>
        <StatusBadge status={inst.status} />
      </div>

      <div className="grid gap-4 mb-6">
        <div className="card p-4">
          <p className="field-label">Licensee</p>
          <p className="text-white font-medium">{inst.assignee?.name}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{inst.assignee?.email}</p>
        </div>

        {inst.submissionJwt && (
          <div className="card p-4 flex gap-3">
            <FileKey className="w-5 h-5 shrink-0" style={{ color: 'var(--sentinel-300)' }} />
            <div className="min-w-0">
              <p className="field-label">Submission receipt (JWT)</p>
              <p className="font-mono-ui text-[10px] break-all" style={{ color: 'var(--text-secondary)' }}>
                {inst.submissionJwt}
              </p>
            </div>
          </div>
        )}

        {payload && (
          <div className="card p-4">
            <p className="field-label mb-2">Payload</p>
            <pre className="font-mono-ui text-[11px] overflow-x-auto p-3 rounded-lg" style={{ background: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}

        {inst.files?.length > 0 && (
          <div className="card p-4">
            <p className="field-label mb-2">Evidence files</p>
            <ul className="space-y-2">
              {inst.files.map((f) => (
                <li key={f.id} className="flex justify-between text-sm">
                  <span className="text-white">{f.fileName}</span>
                  <span className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {f.clientHash || f.serverHash}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {inst.reviewNotes && (
          <div className="card p-4" style={{ borderColor: 'rgba(255,184,0,0.3)' }}>
            <p className="field-label">Prior review notes</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{inst.reviewNotes}</p>
          </div>
        )}
      </div>

      {inst.status === 'SUBMITTED' && (
        <div className="card p-5 space-y-4">
          <p className="text-sm font-semibold text-white">Regulator decision</p>
          <textarea
            className="input-field min-h-[88px]"
            placeholder="Review notes (required for flag/reject)…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => act('APPROVED')} className="btn-primary flex items-center gap-2">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Approve
            </button>
            <button type="button" disabled={busy} onClick={() => act('FLAGGED')} className="btn-ghost">
              Flag for CAPA
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => act('REJECTED')}
              className="btn-ghost"
              style={{ borderColor: 'rgba(255,45,85,0.4)', color: '#FF2D55' }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

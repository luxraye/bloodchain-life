import { useState } from 'react'
import { X, ShieldAlert, Loader2 } from 'lucide-react'
import type { LabAsset } from '../types'
import { formatIsbt128 } from '../lib/isbt128'

interface Props {
  asset:      LabAsset
  onClose:    () => void
  onVerified: (assetId: string) => void
}

export default function SupervisorVerifyModal({ asset, onClose, onVerified }: Props) {
  const [pin, setPin]       = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const expectedPin = import.meta.env.VITE_SUPERVISOR_PIN

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (pin.length < 4) { setError('PIN must be at least 4 digits.'); return }

    if (!expectedPin) {
      setError('Supervisor verification is not configured for this environment.')
      return
    }

    if (pin !== expectedPin) {
      setError('Incorrect PIN. Contact your supervisor.')
      return
    }

    setLoading(true)
    setTimeout(() => { setLoading(false); onVerified(asset.id) }, 400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-in"
        style={{
          background:  '#0C0F1A',
          border:      '1px solid rgba(255,45,85,0.3)',
          boxShadow:   '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,45,85,0.1)',
        }}
      >
        {/* Accent bar */}
        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #FF2D55, #C4304E, #FF2D55)' }} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,45,85,0.12)', background: 'rgba(255,45,85,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'rgba(255,45,85,0.12)', border: '1px solid rgba(255,45,85,0.25)' }}
            >
              <ShieldAlert className="h-4.5 w-4.5" style={{ color: '#FF2D55' }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: '#FF2D55' }}>Biohazard Discard</div>
              <div className="font-mono text-[10px]" style={{ color: 'rgba(255,45,85,0.6)' }}>
                Supervisor verification required
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs transition"
            style={{ color: '#4A5568' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F0F4F8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

          {/* Warning block */}
          <div
            className="rounded-xl px-4 py-3 text-xs leading-relaxed"
            style={{
              background: 'rgba(255,45,85,0.06)',
              border:     '1px solid rgba(255,45,85,0.18)',
              color:      '#EAA0AA',
            }}
          >
            Unit{' '}
            <span className="font-mono-ui font-bold" style={{ color: '#F7DDE0' }}>
              {formatIsbt128(asset.id)}
            </span>{' '}
            ({asset.bloodType}) will be permanently discarded as biohazard waste.
            This action is <span className="font-bold" style={{ color: '#FF2D55' }}>irreversible</span>.
          </div>

          {/* PIN input */}
          <div>
            <label
              htmlFor="supervisor-pin"
              className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: '#8899A8' }}
            >
              Supervisor PIN
            </label>
            <input
              id="supervisor-pin"
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 4–8 digit PIN"
              className="w-full rounded-xl py-3 text-center font-mono-ui text-xl tracking-[0.35em] outline-none transition"
              style={{
                background:   'rgba(255,45,85,0.04)',
                border:       '1px solid rgba(255,45,85,0.25)',
                color:        '#F0F4F8',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,45,85,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,45,85,0.1)' }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,45,85,0.25)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            {error && (
              <p className="mt-1.5 font-mono text-[11px]" style={{ color: '#FF2D55' }}>{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition"
              style={{
                background:   'rgba(255,255,255,0.04)',
                border:       '1px solid rgba(255,255,255,0.09)',
                color:        '#8899A8',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#F0F4F8' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#8899A8' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#FF2D55', color: '#fff', boxShadow: '0 0 16px rgba(255,45,85,0.3)' }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#ff4d6a' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF2D55' }}
            >
              {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying…</> : 'Confirm Discard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

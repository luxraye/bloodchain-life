import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

export type Pathogen = 'hiv' | 'hbsag' | 'hcv' | 'syphilis' | 'malaria'

const PATHOGENS: { id: Pathogen; label: string; sub: string; color: string }[] = [
  { id: 'hiv',      label: 'HIV 1/2 Ag/Ab',         sub: 'Combo antigen / antibody screen', color: '#FF2D55' },
  { id: 'hbsag',    label: 'HBsAg',                  sub: 'Hepatitis B surface antigen',     color: '#FF2D55' },
  { id: 'hcv',      label: 'Anti-HCV',               sub: 'Hepatitis C antibody',            color: '#FF2D55' },
  { id: 'syphilis', label: 'Syphilis RPR',            sub: 'Rapid plasma reagin',             color: '#FF2D55' },
  { id: 'malaria',  label: 'Malaria Ag (PfHRP2)',     sub: 'P. falciparum antigen detection', color: '#FFB800' },
]

interface Props {
  unitId:    string
  bloodType: string
  onClose:   () => void
  onConfirm: (pathogens: Pathogen[]) => void
}

export default function ReactiveModal({ unitId, bloodType, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<Set<Pathogen>>(new Set())

  const toggle = (id: Pathogen) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: '#0C0F1A',
          border:     '1px solid rgba(255,45,85,0.3)',
          boxShadow:  '0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,45,85,0.08)',
          animation:  'fadeInUp 0.2s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #FF2D55, #C4304E, #FF2D55)' }} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,45,85,0.1)', background: 'rgba(255,45,85,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'rgba(255,45,85,0.12)', border: '1px solid rgba(255,45,85,0.3)' }}
            >
              <AlertTriangle className="h-4 w-4" style={{ color: '#FF2D55' }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: '#FF2D55' }}>Mark Reactive Result</div>
              <div className="font-mono text-[10px]" style={{ color: 'rgba(255,45,85,0.55)' }}>
                {unitId} · {bloodType}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs transition"
            style={{ color: '#4A5568' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#F0F4F8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs leading-relaxed" style={{ color: '#8899A8' }}>
            Select all panels that returned a <span className="font-bold" style={{ color: '#FF2D55' }}>REACTIVE</span> result.
            Unit will be quarantined and marked for supervisor-authorised discard.
          </p>

          <div className="space-y-1.5">
            {PATHOGENS.map(p => {
              const checked = selected.has(p.id)
              return (
                <label
                  key={p.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 transition select-none"
                  style={{
                    background:  checked ? 'rgba(255,45,85,0.08)' : 'rgba(255,255,255,0.02)',
                    border:      `1px solid ${checked ? 'rgba(255,45,85,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {/* Custom checkbox */}
                  <div
                    className="h-4 w-4 flex items-center justify-center rounded flex-shrink-0 transition"
                    style={{
                      background:  checked ? 'rgba(255,45,85,0.2)' : 'rgba(255,255,255,0.04)',
                      border:      `1px solid ${checked ? '#FF2D55' : 'rgba(255,255,255,0.12)'}`,
                    }}
                  >
                    {checked && (
                      <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#FF2D55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(p.id)} />

                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: checked ? p.color : '#F0F4F8' }}>
                      {p.label}
                    </div>
                    <div className="font-mono text-[9px] truncate" style={{ color: '#4A5568' }}>
                      {p.sub}
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-5 py-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#8899A8' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F0F4F8'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8899A8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={() => selected.size > 0 && onConfirm(Array.from(selected))}
            className="flex-1 rounded-xl py-2.5 text-xs font-bold transition disabled:opacity-35 disabled:cursor-not-allowed"
            style={{
              background: '#FF2D55',
              color:      '#fff',
              boxShadow:  selected.size > 0 ? '0 0 16px rgba(255,45,85,0.3)' : 'none',
            }}
            onMouseEnter={e => { if (selected.size > 0) e.currentTarget.style.background = '#ff4d6a' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF2D55' }}
          >
            Confirm Reactive{selected.size > 0 ? ` (${selected.size})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

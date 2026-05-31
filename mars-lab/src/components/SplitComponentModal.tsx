import { useState } from 'react'
import { X, Scissors } from 'lucide-react'
import type { LabAsset } from '../types'
import { formatIsbt128 } from '../lib/isbt128'

interface Props {
  asset:      LabAsset
  onClose:    () => void
  onConfirm:  (assetId: string, components: string[]) => void
}

const COMPONENTS = [
  {
    id:    'RBC',
    label: 'Red Blood Cells',
    sub:   'RBC · Packed',
    color: '#D96070',
    bg:    'rgba(168,31,56,0.08)',
    border:'rgba(168,31,56,0.25)',
  },
  {
    id:    'PLT',
    label: 'Platelets',
    sub:   'PLT · Apheresis',
    color: '#FFB800',
    bg:    'rgba(255,184,0,0.08)',
    border:'rgba(255,184,0,0.25)',
  },
  {
    id:    'FFP',
    label: 'Fresh Frozen Plasma',
    sub:   'FFP',
    color: '#8EC4E8',
    bg:    'rgba(91,164,212,0.08)',
    border:'rgba(91,164,212,0.25)',
  },
]

export default function SplitComponentModal({ asset, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-in"
        style={{
          background: '#0C0F1A',
          border:     '1px solid rgba(91,164,212,0.25)',
          boxShadow:  '0 24px 64px rgba(0,0,0,0.7)',
        }}
      >
        {/* Accent bar */}
        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #3A82B8, #5BA4D4, #3A82B8)' }} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'rgba(91,164,212,0.12)', border: '1px solid rgba(91,164,212,0.25)' }}
            >
              <Scissors className="h-4 w-4" style={{ color: '#5BA4D4' }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: '#F0F4F8' }}>Split Component</div>
              <div className="font-mono-ui text-[11px]" style={{ color: '#5BA4D4' }}>
                {formatIsbt128(asset.id)}
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
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs leading-relaxed" style={{ color: '#8899A8' }}>
            Split <span className="font-semibold" style={{ color: '#F0F4F8' }}>{asset.componentType}</span>{' '}
            ({asset.bloodType}) into derived fractions. Select target components:
          </p>

          <div className="space-y-2">
            {COMPONENTS.map(comp => {
              const checked = selected.has(comp.id)
              return (
                <label
                  key={comp.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition"
                  style={{
                    background:   checked ? comp.bg : 'rgba(255,255,255,0.03)',
                    border:       `1px solid ${checked ? comp.border : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div
                    className="h-4 w-4 rounded flex items-center justify-center flex-shrink-0 transition"
                    style={{
                      background:   checked ? comp.bg : 'rgba(255,255,255,0.04)',
                      border:       `1px solid ${checked ? comp.border : 'rgba(255,255,255,0.12)'}`,
                    }}
                  >
                    {checked && (
                      <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke={comp.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(comp.id)}
                    className="sr-only"
                  />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: checked ? comp.color : '#F0F4F8' }}>
                      {comp.label}
                    </div>
                    <div className="font-mono text-[10px]" style={{ color: '#4A5568' }}>{comp.sub}</div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-5 py-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
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
            onClick={() => { if (selected.size > 0) onConfirm(asset.id, Array.from(selected)) }}
            disabled={selected.size === 0}
            className="flex-1 rounded-xl py-2.5 text-xs font-bold transition disabled:opacity-35 disabled:cursor-not-allowed"
            style={{
              background: selected.size > 0 ? '#3A82B8' : 'rgba(58,130,184,0.3)',
              color:      '#fff',
              boxShadow:  selected.size > 0 ? '0 0 16px rgba(0,200,255,0.2)' : 'none',
            }}
            onMouseEnter={e => { if (selected.size > 0) e.currentTarget.style.background = '#5BA4D4' }}
            onMouseLeave={e => { if (selected.size > 0) e.currentTarget.style.background = '#3A82B8' }}
          >
            Confirm Split{selected.size > 0 ? ` (${selected.size})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

import { X, User, Clock, Droplets, Tag, Package } from 'lucide-react'
import type { LabAsset } from '../types'
import StatusBadge, { ViralBadge } from './StatusBadge'
import { formatIsbt128 } from '../lib/isbt128'

interface Props {
  asset: LabAsset | null
  onClose:   () => void
  onSplit:   (asset: LabAsset) => void
  onDiscard: (asset: LabAsset) => void
  onRelease: (asset: LabAsset) => void
}

function daysUntilExpiry(iso: string): number {
  return Math.floor((Date.parse(iso) - Date.now()) / 86_400_000)
}

function derivedViralStatus(asset: LabAsset): 'PENDING' | 'SAFE' | 'BIOHAZARD' {
  if (asset.status === 'BIOHAZARD' || asset.status === 'DISCARDED') return 'BIOHAZARD'
  if (!asset.viralScreening) return 'PENDING'
  const markers = Object.values(asset.viralScreening)
  if (markers.some(m => m === 'POSITIVE')) return 'BIOHAZARD'
  if (markers.some(m => m === 'PENDING'))  return 'PENDING'
  return 'SAFE'
}

const MARKER_LABELS: Record<string, string> = {
  hiv:      'HIV 1/2 Ag/Ab',
  hepB:     'HBsAg (Hepatitis B)',
  hepC:     'Anti-HCV (Hepatitis C)',
  syphilis: 'Syphilis RPR',
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#4A5568' }}>
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
    </div>
  )
}

function DataCell({ label, value, mono = false, icon }: { label: string; value: string; mono?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-1 mb-1">
        {icon && <span style={{ color: '#4A5568' }}>{icon}</span>}
        <span className="font-mono text-[9px] font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>
          {label}
        </span>
      </div>
      <span className={`text-xs font-semibold ${mono ? 'font-mono-ui' : ''}`} style={{ color: '#F0F4F8' }}>
        {value}
      </span>
    </div>
  )
}

export default function CustodyDrawer({ asset, onClose, onSplit, onDiscard, onRelease }: Props) {
  if (!asset) return null

  const expDays     = daysUntilExpiry(asset.expirationDate)
  const viralStatus = derivedViralStatus(asset)
  const canAct      = asset.status !== 'RELEASED' && asset.status !== 'DISCARDED'
  const canSplit    = asset.status === 'QUARANTINE' || asset.status === 'INCOMING' || asset.status === 'TESTING'

  const expiryColor = expDays <= 0 ? '#FF2D55' : expDays <= 5 ? '#FF2D55' : expDays <= 14 ? '#FFB800' : '#00FF88'

  return (
    <div
      className="flex h-full w-[380px] flex-col shrink-0 animate-slide-in-right"
      style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#0C0F1A' }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}
      >
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] mb-0.5" style={{ color: '#4A5568' }}>
            Chain of Custody
          </div>
          <div className="font-mono-ui text-sm font-bold" style={{ color: '#8EC4E8' }}>
            {formatIsbt128(asset.id)}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs transition"
          style={{ color: '#4A5568', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F0F4F8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4A5568'; e.currentTarget.style.background = 'transparent' }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-3 space-y-1">

        {/* Unit Identity */}
        <SectionHeader>Unit Identity</SectionHeader>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <DataCell label="ISBT-128"  value={formatIsbt128(asset.id)}    mono  icon={<Tag  className="h-3 w-3" />} />
          <DataCell label="Blood Type" value={asset.bloodType}                  icon={<Droplets className="h-3 w-3" />} />
          <DataCell label="Component"  value={asset.componentType}              icon={<Package className="h-3 w-3" />} />
          <DataCell label="Donor ID"   value={asset.donorId}             mono  icon={<User className="h-3 w-3" />} />
        </div>

        {/* Status */}
        <SectionHeader>Status</SectionHeader>
        <div className="flex items-center gap-2 mb-1">
          <StatusBadge status={asset.status} />
          <ViralBadge  status={viralStatus} />
        </div>
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: '#4A5568' }} />
          <span className="text-xs" style={{ color: '#8899A8' }}>Expiry:</span>
          <span className="font-mono-ui text-xs font-bold" style={{ color: expiryColor }}>
            {expDays > 0 ? `${expDays} day${expDays !== 1 ? 's' : ''}` : 'EXPIRED'}
          </span>
        </div>

        {/* Viral Screening */}
        <SectionHeader>Viral Screening Panel</SectionHeader>
        <div className="rounded-xl overflow-hidden mb-2" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {Object.entries(asset.viralScreening ?? {}).map(([key, val], i, arr) => {
            const color = val === 'NEGATIVE' ? '#00FF88' : val === 'POSITIVE' ? '#FF2D55' : '#8899A8'
            return (
              <div
                key={key}
                className="flex items-center justify-between px-3 py-2.5"
                style={{
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background:   val === 'POSITIVE' ? 'rgba(255,45,85,0.04)' : 'transparent',
                }}
              >
                <span className="text-xs" style={{ color: '#8899A8' }}>
                  {MARKER_LABELS[key] ?? key}
                </span>
                <span className="font-mono-ui text-[11px] font-bold" style={{ color }}>
                  {val}
                </span>
              </div>
            )
          })}
        </div>

        {/* Custody Timeline */}
        <SectionHeader>Custody Timeline</SectionHeader>
        <div className="relative pl-5">
          <div
            className="absolute left-[9px] top-1 bottom-1 w-px"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
          {(asset.chainOfCustody ?? []).map((evt, i) => (
            <div key={i} className="relative mb-2.5 last:mb-0">
              <div
                className="absolute -left-5 top-1.5 h-2 w-2 rounded-full"
                style={{ background: '#A81F38', border: '1px solid #C4304E', boxShadow: '0 0 4px rgba(168,31,56,0.4)' }}
              />
              <div
                className="rounded-lg px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: '#F0F4F8' }}>{evt.action}</span>
                  <span className="font-mono-ui text-[9px] shrink-0" style={{ color: '#4A5568' }}>
                    {new Date(evt.time).toLocaleString('en-GB', {
                      day: '2-digit', month: '2-digit',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-2.5 w-2.5" style={{ color: '#4A5568' }} />
                  <span className="text-[11px]" style={{ color: '#8899A8' }}>{evt.actor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer actions ───────────────────────────────────────────── */}
      {canAct && (
        <div
          className="shrink-0 px-4 py-3 space-y-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          {canSplit && (
            <button
              type="button"
              onClick={() => onSplit(asset)}
              className="w-full rounded-lg px-3 py-2.5 text-xs font-semibold transition"
              style={{
                background:   'rgba(91,164,212,0.08)',
                border:       '1px solid rgba(91,164,212,0.25)',
                color:        '#8EC4E8',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(91,164,212,0.14)'; e.currentTarget.style.borderColor = 'rgba(91,164,212,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(91,164,212,0.08)'; e.currentTarget.style.borderColor = 'rgba(91,164,212,0.25)' }}
            >
              Split Component
            </button>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRelease(asset)}
              className="flex-1 rounded-lg px-3 py-2.5 text-xs font-bold text-white transition"
              style={{ background: '#00FF88', color: '#07090F' }}
              onMouseEnter={e => e.currentTarget.style.background = '#00e67a'}
              onMouseLeave={e => e.currentTarget.style.background = '#00FF88'}
            >
              Release Unit
            </button>
            <button
              type="button"
              onClick={() => onDiscard(asset)}
              className="flex-1 rounded-lg px-3 py-2.5 text-xs font-bold text-white transition"
              style={{ background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.4)', color: '#FF2D55' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,85,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,45,85,0.15)' }}
            >
              Discard (⚠ Bio)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

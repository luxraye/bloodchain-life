import type { LabAssetStatus } from '../types'

type TtiStatus = 'PENDING' | 'SAFE' | 'BIOHAZARD'

interface StatusConfig {
  label: string
  bg: string
  border: string
  color: string
  dot?: string
}

const STATUS_CONFIG: Record<LabAssetStatus, StatusConfig> = {
  INCOMING: {
    label: 'Incoming',
    bg: 'rgba(91,164,212,0.08)', border: 'rgba(91,164,212,0.25)', color: '#8EC4E8',
  },
  TESTING: {
    label: 'Testing',
    bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.25)', color: '#FFB800',
  },
  QUARANTINE: {
    label: 'Quarantine',
    bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.3)', color: '#FFB800',
  },
  RELEASED: {
    label: 'Released',
    bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', color: '#00FF88',
  },
  BIOHAZARD: {
    label: 'Biohazard',
    bg: 'rgba(255,45,85,0.1)', border: 'rgba(255,45,85,0.35)', color: '#FF2D55',
  },
  DISCARDED: {
    label: 'Discarded',
    bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', color: '#4A5568',
  },
}

export default function StatusBadge({ status, compact }: { status: LabAssetStatus; compact?: boolean }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.INCOMING

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-semibold"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
      {!compact && cfg.label}
    </span>
  )
}

export function ViralBadge({ status }: { status: TtiStatus }) {
  if (status === 'SAFE') return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-semibold"
      style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', color: '#00FF88' }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#00FF88' }} />
      All Clear
    </span>
  )

  if (status === 'BIOHAZARD') return (
    <span
      className="tti-reactive inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-bold"
      style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.35)', color: '#FF2D55' }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#FF2D55' }} />
      Reactive
    </span>
  )

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px]"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8899A8' }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4A5568' }} />
      Pending
    </span>
  )
}

import { mailtoMediaDemo } from '../content/site'

export const STATUS_CONFIG = {
  live:    { dot: 'bg-neon-green animate-glow', label: 'Live', color: 'text-neon-green' },
  alert:   { dot: 'bg-neon-amber animate-glow', label: 'Attention', color: 'text-neon-amber' },
  offline: { dot: 'bg-[#4A5568]',               label: 'Offline',   color: 'text-[#4A5568]'  },
  planned: { dot: 'bg-[#2E3548]',               label: 'Planned',   color: 'text-[#4A5568]'  },
}

export function AppStatusPill({ app, className = '' }) {
  const status = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.offline
  return (
    <div className={`flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
      <span className={`font-mono text-[9px] font-semibold uppercase tracking-widest ${status.color}`}>
        {status.label}
      </span>
    </div>
  )
}

export default function AppLaunchPanel({ app, compact = false }) {
  const isProposed = app.proposed ?? false

  if (isProposed) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.08] py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#4A5568]">
        In development — roadmap
      </div>
    )
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <p className="text-[10px] leading-relaxed text-[#4A5568]">
        Included in the Bloodchain suite. Live demonstrations are arranged for your organisation — contact us to schedule.
      </p>
      <a
        href={mailtoMediaDemo()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: app.accentColor + '12',
          color: app.accentColor,
          borderColor: app.accentColor + '35',
        }}
      >
        Request a briefing
      </a>
    </div>
  )
}

import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import DeviceEmulatorModal from '../DeviceEmulatorModal'

export const STATUS_CONFIG = {
  live:    { dot: 'bg-neon-green animate-glow', label: 'Live',    color: 'text-neon-green' },
  alert:   { dot: 'bg-neon-amber animate-glow', label: 'Alert',   color: 'text-neon-amber' },
  offline: { dot: 'bg-[#4A5568]',               label: 'Offline', color: 'text-[#4A5568]'  },
  planned: { dot: 'bg-[#2E3548]',               label: 'Planned', color: 'text-[#4A5568]'  },
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
  const [modalOpen, setModalOpen] = useState(false)
  const isProposed = app.proposed ?? false

  if (isProposed) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.08] py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#4A5568]">
        In development — roadmap
      </div>
    )
  }

  return (
    <>
      <div>
        {app.deviceFrame ? (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background:  app.accentColor + '12',
              color:       app.accentColor,
              borderColor: app.accentColor + '35',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 16px ${app.accentColor}40` }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Launch in Device Frame
          </button>
        ) : (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background:  app.accentColor + '12',
              color:       app.accentColor,
              borderColor: app.accentColor + '35',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 16px ${app.accentColor}40` }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Open Application
          </a>
        )}

        {app.showQr && app.url && (
          <div className={`flex items-center gap-4 border-t border-white/[0.06] ${compact ? 'mt-3 pt-3' : 'mt-4 pt-4'}`}>
            <div className="shrink-0 rounded-lg border border-white/10 bg-white p-1.5">
              <QRCodeSVG value={app.url} size={compact ? 40 : 44} bgColor="#ffffff" fgColor="#07090F" level="M" />
            </div>
            <p className="text-[10px] leading-relaxed text-[#4A5568]">
              Scan to open on device or <span className="text-[#8899A8]">Add to Home Screen</span>
            </p>
          </div>
        )}
      </div>

      {app.deviceFrame && (
        <DeviceEmulatorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} app={app} />
      )}
    </>
  )
}

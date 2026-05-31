import AppLaunchPanel, { AppStatusPill } from './AppLaunchPanel'

export default function ConstellationDetailPanel({ app, onClose }) {
  if (!app) return null

  return (
    <div
      className="constellation-detail-panel mx-auto mt-2 w-full max-w-lg animate-fade-up"
      role="dialog"
      aria-labelledby={`detail-${app.id}-title`}
      aria-modal="true"
    >
      <div
        className="overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0B0E15] shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
        style={{ boxShadow: `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px ${app.accentColor}22` }}
      >
        <div
          className="h-[3px] w-full"
          style={{ background: app.accentColor, boxShadow: `0 0 16px ${app.accentColor}66` }}
        />

        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-black"
                style={{
                  background: app.accentColor + '18',
                  color:      app.accentColor,
                  border:     `1px solid ${app.accentColor}30`,
                }}
              >
                {app.icon}
              </div>
              <div className="min-w-0">
                <h3 id={`detail-${app.id}-title`} className="text-lg font-bold tracking-wide text-white truncate">
                  {app.name}
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#4A5568] mt-0.5">
                  {app.role}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <AppStatusPill app={app} />
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-[#8899A8] transition-colors hover:border-white/[0.18] hover:text-white"
                aria-label={`Close ${app.name} details`}
              >
                ×
              </button>
            </div>
          </div>

          <p className="mb-5 text-sm leading-relaxed text-[#8899A8]">{app.description}</p>

          {app.stack && (
            <div className="mb-5 flex flex-wrap gap-1.5">
              {app.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-[#8899A8]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <AppLaunchPanel app={app} compact />

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-lg border border-white/[0.08] py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8899A8] transition-colors hover:border-white/[0.14] hover:text-white"
          >
            Back to carousel
          </button>
        </div>
      </div>
    </div>
  )
}

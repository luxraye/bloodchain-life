import { AppStatusPill } from './AppLaunchPanel'

export default function CarouselAppCard({
  app,
  isCenter = false,
  onCardClick,
  variant = 'wheel',
}) {
  const hasDetails = Boolean(app.description)
  const isWheel = variant === 'wheel'

  return (
    <button
      type="button"
      onClick={onCardClick}
      className={`constellation-card-inner flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
        isCenter
          ? 'border-white/[0.18] bg-[#0B0E15] shadow-[0_0_40px_rgba(0,0,0,0.45)]'
          : 'border-white/[0.08] bg-[#0B0E15]/95'
      }`}
      style={{
        width: isWheel ? 240 : 260,
        height: 280,
        boxShadow: isCenter ? `0 0 32px ${app.accentColor}22` : undefined,
      }}
      aria-label={
        isCenter && hasDetails
          ? `View ${app.name} details`
          : `Select ${app.name}`
      }
    >
      <div
        className={`h-[2px] w-full shrink-0 transition-opacity duration-300 ${
          isCenter ? 'opacity-100 animate-wheel-glow' : 'opacity-40'
        }`}
        style={{
          background: app.accentColor,
          boxShadow: isCenter ? `0 0 14px ${app.accentColor}88` : undefined,
        }}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-2">
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
          <AppStatusPill app={app} />
        </div>

        <h3 className="mb-1 text-base font-bold tracking-wide text-white">{app.name}</h3>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#4A5568] mb-3">{app.role}</p>

        <p className="flex-1 text-sm leading-relaxed text-[#8899A8]">
          {app.tagline || app.role}
        </p>

        {isCenter && hasDetails && (
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#4A5568]">
            Tap for details ↓
          </p>
        )}
      </div>
    </button>
  )
}

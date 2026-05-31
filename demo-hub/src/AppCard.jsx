import AppLaunchPanel, { AppStatusPill } from './components/AppLaunchPanel'

export default function AppCard({ app }) {
  const isProposed = app.proposed ?? false

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        isProposed
          ? 'border-dashed border-white/[0.08] bg-white/[0.015] opacity-75 hover:opacity-95'
          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-card'
      }`}
      style={!isProposed ? { backdropFilter: 'blur(16px)' } : {}}
    >
      <div
        className={`h-[2px] w-full transition-all duration-300 ${isProposed ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'}`}
        style={{
          background: app.accentColor,
          boxShadow: `0 0 12px ${app.accentColor}88`,
        }}
      />

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black transition-transform duration-200 group-hover:scale-105"
              style={{
                background: app.accentColor + '18',
                color:      app.accentColor,
                border:     `1px solid ${app.accentColor}30`,
              }}
            >
              {app.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white">{app.name}</h3>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#4A5568] mt-0.5">{app.role}</p>
            </div>
          </div>
          <AppStatusPill app={app} />
        </div>

        <p className="mb-4 flex-1 text-xs leading-relaxed text-[#4A5568] group-hover:text-[#8899A8] transition-colors duration-200">
          {app.description}
        </p>

        {app.stack && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {app.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-[#4A5568]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <AppLaunchPanel app={app} />
      </div>
    </div>
  )
}

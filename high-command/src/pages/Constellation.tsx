import { ExternalLink } from 'lucide-react'
import {
  CONSTELLATION_MODULES,
  PILLAR_LABEL,
  constellationHealthSummary,
  type ModulePillar,
} from '../data/constellationModules'
import ConstellationBoundary from '../components/ConstellationBoundary'

const PILLAR_ORDER: ModulePillar[] = ['operations', 'clinical', 'population', 'governance']

export default function Constellation() {
  const health = constellationHealthSummary()

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <ConstellationBoundary />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Constellation</h1>
          <p className="text-sm mt-1 text-neutral-400">
            National Blood OS modules — {health.live} live, {health.alert} need attention.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-emerald-400">{health.live}</p>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Live</p>
          </div>
          <div className="glass-card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-amber-400">{health.alert}</p>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Alert</p>
          </div>
        </div>
      </div>

      {PILLAR_ORDER.map((pillar) => {
        const mods = CONSTELLATION_MODULES.filter((m) => m.pillar === pillar)
        return (
          <section key={pillar}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
              {PILLAR_LABEL[pillar]}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {mods.map((mod) => (
                <a
                  key={mod.id}
                  href={mod.launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 block hover:border-[rgba(168,31,56,0.35)] transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                        style={{
                          background: `${mod.accentColor}22`,
                          color: mod.accentColor,
                          border: `1px solid ${mod.accentColor}44`,
                        }}
                      >
                        {mod.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-[#D96070] transition">
                          {mod.name}
                        </p>
                        <p className="text-[10px] text-neutral-500">{mod.role}</p>
                      </div>
                    </div>
                    <span
                      className="badge text-[9px] uppercase"
                      style={{
                        background:
                          mod.status === 'live'
                            ? 'rgba(0,255,136,0.12)'
                            : 'rgba(255,184,0,0.12)',
                        color: mod.status === 'live' ? '#00FF88' : '#FFB800',
                      }}
                    >
                      {mod.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{mod.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-400">
                      {mod.demoMetric.label}:{' '}
                      <strong className="text-white">{mod.demoMetric.value}</strong>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#D96070]" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

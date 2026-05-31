import AppCard from '../AppCard'
import ConstellationCarousel from './ConstellationCarousel'
import { APPS, PROPOSED_MODULES } from '../content/apps'

export default function ConstellationSection() {
  const liveCount = APPS.length
  const hasRoadmap = PROPOSED_MODULES.length > 0

  return (
    <section id="constellation" className="relative py-20 border-t border-white/[0.06]">

      {/* Left glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -z-10 -translate-y-1/2 h-96 w-80 rounded-full opacity-[0.05] blur-[80px]"
        style={{ background: '#A81F38' }}
      />

      <div className="mx-auto max-w-7xl px-6">

        {/* ── Live modules ── */}
        <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-burg-400">
          The Platform
        </p>
        <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {liveCount} applications. One shared core.
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-[#8899A8]">
          All constellation modules are live in this demo environment — each independently deployable, together forming a complete national blood management system.
        </p>

        <ConstellationCarousel apps={APPS} />

        {/* Info bar */}
        <div className="mb-16 glass rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#4A5568]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div className="space-y-1 text-xs leading-relaxed text-[#8899A8]">
              <p>
                <span className="font-semibold text-white">National & clinical</span> — High Command, Mars Lab, Voyager, Transfuse, Chronicle, Helix, and Sentinel open in a new tab with <span className="font-mono text-[10px]">?guest=1</span> demo sessions.
              </p>
              <p>
                <span className="font-semibold text-white">Mobile / tablet</span> — Azure (iPhone) and Scyther (iPad) launch inside device frames with live iframes.
              </p>
              <p>
                <span className="font-semibold text-white">Standalone deployment</span> — each module authenticates independently and can be adopted without the full constellation.
              </p>
            </div>
          </div>
        </div>

        {!hasRoadmap ? (
          <div className="glass rounded-2xl border border-neon-green/20 p-6 text-center">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-green mb-2">
              Constellation complete (demo)
            </p>
            <p className="text-sm text-[#8899A8] max-w-lg mx-auto">
              Every service domain in the Bloodchain map now has a runnable module in this preview. Production rollout still requires clinical certification and regulatory sign-off.
            </p>
          </div>
        ) : (
          <>
            <div className="section-divider mb-12" />
            <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4A5568]">
              Roadmap
            </p>
            <h3 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-white">
              Next in the constellation
            </h3>
            <p className="mx-auto mb-10 max-w-lg text-center text-sm leading-relaxed text-[#4A5568]">
              Additional modules in active design.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {PROPOSED_MODULES.map((mod) => (
                <AppCard key={mod.id} app={mod} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

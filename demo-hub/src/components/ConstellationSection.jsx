import AppCard from '../AppCard'
import ConstellationCarousel from './ConstellationCarousel'
import { APPS, PROPOSED_MODULES } from '../content/apps'

export default function ConstellationSection() {
  const liveCount = APPS.length
  const hasRoadmap = PROPOSED_MODULES.length > 0

  return (
    <section id="constellation" className="relative py-20 border-t border-white/[0.06]">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -z-10 -translate-y-1/2 h-96 w-80 rounded-full opacity-[0.05] blur-[80px]"
        style={{ background: '#A81F38' }}
      />

      <div className="mx-auto max-w-7xl px-6">

        <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-burg-400">
          The Platform
        </p>
        <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {liveCount} applications. One shared core.
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-[#8899A8]">
          Nine role-specific applications for donation, laboratory, logistics, clinical transfusion, chronic care, research, and national oversight — one custody chain from donor to patient.
        </p>

        <ConstellationCarousel apps={APPS} />

        <div className="mb-16 glass rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#4A5568]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div className="space-y-1 text-xs leading-relaxed text-[#8899A8]">
              <p>
                <span className="font-semibold text-white">National & clinical</span> — programme oversight, laboratory, logistics, hospital transfusion, chronic care, research, and regulatory modules each serve a distinct mandate in the blood system.
              </p>
              <p>
                <span className="font-semibold text-white">Field & public</span> — collection and donor-facing capabilities support drives, eligibility, and the public donation journey.
              </p>
              <p>
                <span className="font-semibold text-white">Briefings by appointment</span> — interactive walkthroughs are shared directly with your institution; this site describes the constellation, not open access to software.
              </p>
            </div>
          </div>
        </div>

        {!hasRoadmap ? (
          <div className="glass rounded-2xl border border-neon-green/20 p-6 text-center">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-green mb-2">
              Constellation map complete
            </p>
            <p className="text-sm text-[#8899A8] max-w-lg mx-auto">
              Every service domain in the national blood programme has a dedicated module in the Bloodchain suite. Contact us to arrange a briefing.
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

import { SITE } from '../content/site'

const STATS = [
  { value: '8',    label: 'Service domains'   },
  { value: '9',    label: 'Platform modules'  },
  { value: 'E2E',  label: 'Audit ledger'      },
  { value: '100%', label: 'Digital — no paper' },
]

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="relative isolate overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">

      {/* Fine grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Scan line effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px opacity-30"
        style={{ background: 'linear-gradient(90deg, transparent, #A81F38, transparent)' }}
      />

      <div className="mx-auto max-w-5xl px-6 text-center">

        {/* Eyebrow */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-burg-500/30 bg-burg-500/[0.08] px-5 py-2 animate-fade-up">
          <span className="h-1.5 w-1.5 rounded-full bg-burg-400 animate-glow" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-burg-300">
            {SITE.organization} · Platform Preview
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-6 text-5xl font-black leading-[1.06] tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-up"
          style={{ animationDelay: '0.08s', animationFillMode: 'both', opacity: 0 }}
        >
          {SITE.projectTagline}
        </h1>

        {/* Sub */}
        <p
          className="mx-auto mb-4 max-w-2xl text-base leading-relaxed text-[#8899A8] md:text-lg animate-fade-up"
          style={{ animationDelay: '0.16s', animationFillMode: 'both', opacity: 0 }}
        >
          {SITE.projectSubtitle}
        </p>
        <p
          className="mx-auto mb-12 max-w-xl text-sm leading-relaxed text-[#4A5568] animate-fade-up"
          style={{ animationDelay: '0.22s', animationFillMode: 'both', opacity: 0 }}
        >
          Purpose-built software platforms for blood donation, laboratory operations, logistics, clinical transfusion, chronic disease management, regulatory compliance, research, and national oversight.
        </p>

        {/* CTAs */}
        <div
          className="mb-16 flex flex-wrap items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.28s', animationFillMode: 'both', opacity: 0 }}
        >
          <button
            type="button"
            onClick={onExploreClick}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-burg-500 px-7 py-3.5 text-sm font-bold text-white shadow-glow-burg transition-all duration-200 hover:bg-burg-400 hover:shadow-[0_0_36px_rgba(168,31,56,0.6)] hover:-translate-y-0.5"
          >
            Explore the Platform
            <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-[#8899A8] backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Request a Demo
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Stats strip */}
        <div
          className="mx-auto grid max-w-2xl grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm sm:grid-cols-4 animate-fade-up"
          style={{ animationDelay: '0.34s', animationFillMode: 'both', opacity: 0 }}
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center px-4 py-5 ${i < STATS.length - 1 ? 'border-r border-white/[0.06]' : ''}`}
            >
              <p className="mb-1 font-mono text-2xl font-black text-white tracking-tight">{value}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4A5568]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { SITE, mailtoLink } from '../content/site'

function ctaHref(demo) {
  if (demo.launchUrl) return demo.launchUrl
  return mailtoLink(
    `Bloodchain — ${demo.org} demo access`,
    `Hello Bloodchain Botswana,\n\nWe would like access to the ${demo.modules.join(' + ')} demonstration prepared for ${demo.org}.\n\nOrganisation: ${demo.org}\nName:\nRole:\n\n— Sent from the ${demo.org} demo page`,
  )
}

export default function BespokeDemo({ demo }) {
  const accent = demo.accent
  const href = ctaHref(demo)
  const isExternal = Boolean(demo.launchUrl)

  return (
    <div className="relative min-h-screen bg-bc-base font-sans text-[#F0F4F8]">
      {/* Ambient glow tinted to the target accent */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-[0.08] blur-[120px]"
          style={{ background: `radial-gradient(ellipse, ${accent} 0%, transparent 70%)` }}
        />
      </div>

      {/* Slim brand bar (no public nav — this is an unlisted page) */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/branding/logo.png" alt="Bloodchain" className="h-8 w-8 rounded-lg object-contain" />
            <div>
              <p className="text-sm font-bold leading-none text-white">Bloodchain</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#4A5568]">
                {SITE.organization}
              </p>
            </div>
          </a>
          <span
            className="rounded-full border px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: accent, borderColor: accent + '40', background: accent + '12' }}
          >
            Prepared for {demo.org}
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center md:pt-24">
        <div
          className="mb-6 inline-flex items-center gap-2.5 rounded-full border px-5 py-2"
          style={{ borderColor: accent + '30', background: accent + '0F' }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-glow" style={{ background: accent }} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
            {demo.eyebrow}
          </span>
        </div>

        <h1 className="mx-auto mb-5 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white md:text-6xl">
          {demo.headline}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[#8899A8] md:text-lg">
          {demo.sub}
        </p>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href={href}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: accent, color: '#07090F', boxShadow: `0 0 30px ${accent}55` }}
          >
            {demo.ctaLabel}
          </a>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-[#8899A8] backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:text-white"
          >
            Talk to us
          </a>
        </div>

        {/* Stat strip */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] sm:grid-cols-3">
          {demo.stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center px-4 py-5 ${i < demo.stats.length - 1 ? 'sm:border-r border-white/[0.06]' : ''}`}
            >
              <p className="mb-1 font-mono text-2xl font-black tracking-tight" style={{ color: accent }}>{value}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4A5568]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain → solution */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
          What changes day one
        </p>
        <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {demo.audience}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {demo.painPoints.map((p) => (
            <div key={p.problem} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4A5568]">
                Today
              </p>
              <p className="mb-4 text-sm font-semibold text-[#8899A8]">{p.problem}</p>
              <div className="mb-3 h-px w-full" style={{ background: accent + '30' }} />
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                With Bloodchain
              </p>
              <p className="text-sm leading-relaxed text-white">{p.solution}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Module spotlight */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <div className="p-8 md:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {demo.modules.map((m) => (
                <span
                  key={m}
                  className="rounded-lg px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: accent, background: accent + '14', border: `1px solid ${accent}33` }}
                >
                  {m}
                </span>
              ))}
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">{demo.spotlight.title}</h3>
            <p className="max-w-2xl text-sm leading-relaxed text-[#8899A8]">{demo.spotlight.body}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-2 text-sm text-[#8899A8]">
            Questions? Reach{' '}
            <span className="font-semibold text-white">{SITE.contactName}</span> —{' '}
            <a href={`mailto:${SITE.contactEmail}`} className="underline hover:text-white">{SITE.contactEmail}</a>
            {' · '}
            <a href={`tel:${SITE.contactPhoneTel}`} className="hover:text-white">{SITE.contactPhoneDisplay}</a>
          </p>
          <p className="mx-auto max-w-xl text-[11px] leading-relaxed text-[#4A5568]">
            Demonstration software prepared for {demo.org}. Not a medical device. Not a substitute for licensed clinical systems or national blood policy.
          </p>
        </div>
      </footer>
    </div>
  )
}

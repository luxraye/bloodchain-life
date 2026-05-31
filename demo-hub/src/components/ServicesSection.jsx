import { SERVICES } from '../content/apps'

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-20 border-t border-white/[0.06]">

      {/* Side glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -z-10 -translate-y-1/2 h-96 w-80 rounded-full opacity-[0.06] blur-[80px]"
        style={{ background: '#3A82B8' }}
      />

      <div className="mx-auto max-w-7xl px-6">

        <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-burg-400">
          What we do
        </p>
        <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Blood management, end to end.
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed text-[#8899A8]">
          Bloodchain is a suite of software platforms that digitise every workflow where blood changes hands. We do not handle physical blood — we make the work of those who do faster, safer, and fully auditable.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICES.map(({ id, icon, title, line, color }) => (
            <div
              key={id}
              className="group relative glass glass-hover rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
              style={{ '--hover-color': color }}
            >
              {/* Top accent line on hover */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ background: color, boxShadow: `0 0 10px ${color}88` }}
              />

              <div
                className="mb-3 text-2xl"
                style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
              >
                {icon}
              </div>
              <h3 className="mb-1.5 text-xs font-bold text-white leading-snug">{title}</h3>
              <p className="text-[11px] leading-relaxed text-[#4A5568] group-hover:text-[#8899A8] transition-colors duration-200">
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

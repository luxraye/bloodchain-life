import { SITE } from '../content/site'

const PILLARS = [
  {
    icon: '⬡',
    color: '#A81F38',
    glow: 'rgba(168,31,56,0.2)',
    title: 'Chain of Custody',
    body: 'Every blood unit carries an unbroken, auditable record from the moment of donation through every handoff — collection, lab processing, transit, transfusion. Nothing is lost. Nothing is altered.',
  },
  {
    icon: '⬟',
    color: '#5BA4D4',
    glow: 'rgba(58,130,184,0.2)',
    title: 'Clinical Integrity',
    body: 'Role-based access ensures the right people see only what they need. Supervisory workflows, ISBT-128 labelling, and biohazard gates mirror real-world clinical protocols — built for safety, not convenience.',
  },
  {
    icon: '◉',
    color: '#00FF88',
    glow: 'rgba(0,255,136,0.15)',
    title: 'Independently Deployable',
    body: 'Each module works standalone. A hospital can deploy Mars Lab without touching Scyther. An NGO can run the donor portal without High Command. The constellation scales to any institutional footprint.',
  },
  {
    icon: '✦',
    color: '#00C8FF',
    glow: 'rgba(0,200,255,0.15)',
    title: 'Built for Regulators',
    body: 'SHA-256 document integrity, JWT-signed audit receipts, and append-only event logs give health ministries and regulatory bodies the evidence base they need — without manual data collection.',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 border-t border-white/[0.06]">

      <div className="mx-auto max-w-6xl px-6">

        <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-burg-400">
          Why Bloodchain
        </p>
        <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Trust through visibility.
        </h2>
        <p className="mx-auto mb-14 max-w-2xl text-center text-sm leading-relaxed text-[#8899A8]">
          Blood supply chains fail quietly. Units expire untracked. Lab results travel by phone. Transfusion records live in paper folders. Bloodchain replaces every one of those gaps with structured, verified digital workflows.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon, color, glow, title, body }) => (
            <div
              key={title}
              className="group glass glass-hover rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: `${color}18`,
                  color,
                  border:     `1px solid ${color}30`,
                  boxShadow:  `0 0 16px ${glow}`,
                }}
              >
                {icon}
              </div>
              <h3 className="mb-2 text-sm font-bold text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-[#4A5568] group-hover:text-[#8899A8] transition-colors duration-200">{body}</p>
            </div>
          ))}
        </div>

        {/* Who we are block */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #A81F38, #C4304E, #A81F38)' }} />
          <div className="p-8 text-center">
            <p className="mb-1 text-lg font-bold text-white">{SITE.organization}</p>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#4A5568]">{SITE.incubationLine}</p>
            <div className="mx-auto mb-6 h-px max-w-xs bg-white/[0.06]" />
            <p className="mx-auto max-w-md text-sm leading-relaxed text-[#8899A8]">
              {SITE.prototypeNote}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'React 19 · Vite',    color: '#00C8FF' },
                { label: 'Supabase Auth',       color: '#00FF88' },
                { label: 'Postgres · Prisma',   color: '#A78BFA' },
                { label: 'Render',              color: '#FFB800' },
                { label: 'Hyperledger Fabric',  color: '#A81F38' },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  className="rounded-lg border px-3 py-1 font-mono text-[10px] font-medium"
                  style={{
                    color,
                    background:   `${color}12`,
                    borderColor:  `${color}30`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

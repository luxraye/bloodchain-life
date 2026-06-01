import { SITE } from '../content/site'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] bg-bc-surface py-12">
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">

          {/* Brand */}
          <div className="flex items-center gap-3 md:items-start md:flex-col md:gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/branding/logo.png"
                alt="Bloodchain"
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl object-contain opacity-90"
              />
              <div>
                <p className="text-sm font-bold text-white">{SITE.organization}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4A5568] mt-0.5">
                  {SITE.incubationLine}
                </p>
              </div>
            </div>
            <p className="hidden md:block max-w-[220px] text-[11px] leading-relaxed text-[#4A5568]">
              The national blood chain, digitized — end-to-end digital infrastructure for every institution that works with blood.
            </p>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-8">
            {[
              { label: 'Services',  href: '#services' },
              { label: 'Platform',  href: '#constellation' },
              { label: 'About',     href: '#about' },
              { label: 'Contact',   href: '#contact' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#4A5568] transition hover:text-[#8899A8]"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="text-center text-[11px] text-[#4A5568] md:text-right">
            <p className="mb-1.5">© {year} {SITE.organization}. All rights reserved.</p>
            <p className="max-w-[240px] leading-relaxed">
              Demonstration software. Not a medical device. Not a substitute for licensed clinical systems or national blood policy.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.05] text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4A5568]">
            National blood platform — briefing by appointment
          </span>
        </div>
      </div>
    </footer>
  )
}

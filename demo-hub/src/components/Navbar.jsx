import { useState, useEffect } from 'react'
import { SITE } from '../content/site'

const NAV_LINKS = [
  { label: 'Services',      href: '#services' },
  { label: 'Platform',      href: '#constellation' },
  { label: 'About',         href: '#about' },
]

export default function Navbar({ onExploreClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.07] bg-bc-base/90 backdrop-blur-glass shadow-[0_1px_0_rgba(168,31,56,0.15)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* ── Brand ── */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 flex-shrink-0">
            <img
              src="/branding/logo.png"
              alt="Bloodchain"
              className="h-9 w-9 rounded-xl object-contain"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-neon-green border-2 border-bc-base animate-glow" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-white leading-none">
              Bloodchain
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4A5568] leading-none mt-0.5">
              {SITE.organization}
            </p>
          </div>
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-4 py-2 rounded-lg font-mono text-[11px] uppercase tracking-[0.12em] text-[#4A5568] transition-all duration-200 hover:text-[#8899A8] hover:bg-white/[0.04]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── CTAs ── */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg font-mono text-[11px] uppercase tracking-[0.12em] text-[#8899A8] border border-white/10 transition-all duration-200 hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
          >
            Contact
          </a>
          <button
            onClick={onExploreClick}
            className="px-5 py-2 rounded-lg bg-burg-500 text-white text-xs font-bold tracking-wide transition-all duration-200 hover:bg-burg-400 shadow-glow-burg hover:shadow-[0_0_32px_rgba(168,31,56,0.6)]"
          >
            Explore Platform
          </button>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 text-[#8899A8] hover:text-white transition"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-bc-surface px-6 pb-5 pt-4">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8899A8] border-b border-white/[0.05] hover:text-white transition"
            >
              {label}
            </a>
          ))}
          <div className="mt-4 flex gap-3">
            <a
              href="#contact"
              className="flex-1 text-center py-2.5 rounded-lg border border-white/10 font-mono text-[11px] uppercase tracking-widest text-[#8899A8]"
            >
              Contact
            </a>
            <button
              onClick={() => { setMenuOpen(false); onExploreClick() }}
              className="flex-1 py-2.5 rounded-lg bg-burg-500 text-white text-xs font-bold tracking-wide"
            >
              Explore
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

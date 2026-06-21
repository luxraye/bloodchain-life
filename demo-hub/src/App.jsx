import { useRef } from 'react'
import './index.css'
import Navbar           from './components/Navbar'
import HeroSection      from './components/HeroSection'
import ServicesSection  from './components/ServicesSection'
import ConstellationSection from './components/ConstellationSection'
import AboutSection     from './components/AboutSection'
import ContactSection   from './components/ContactSection'
import SiteFooter       from './components/SiteFooter'
import BespokeDemo      from './components/BespokeDemo'
import { getBespokeDemo } from './content/bespoke'

// Unlisted, target-specific entry points: /demo/<slug> (e.g. /demo/blb).
// Resolved client-side without a router so the public marketing build stays
// dependency-free; Vite's SPA fallback serves index.html for these deep links.
function resolveBespokeSlug() {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/^\/demo\/([a-z0-9-]+)\/?$/i)
  return match ? match[1] : null
}

export default function App() {
  const bespoke = getBespokeDemo(resolveBespokeSlug())
  if (bespoke) return <BespokeDemo demo={bespoke} />

  return <MarketingSite />
}

function MarketingSite() {
  const constellationRef = useRef(null)

  function scrollToConstellation() {
    constellationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative min-h-screen bg-bc-base font-sans text-[#F0F4F8]">

      {/* ── Global ambient glows ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, #A81F38 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-40 h-[400px] w-[600px] rounded-full opacity-[0.05] blur-[100px]"
          style={{ background: 'radial-gradient(ellipse, #3A82B8 0%, transparent 70%)' }}
        />
      </div>

      <Navbar onExploreClick={scrollToConstellation} />
      <HeroSection onExploreClick={scrollToConstellation} />
      <ServicesSection />

      <div ref={constellationRef}>
        <ConstellationSection />
      </div>

      <AboutSection />
      <ContactSection />
      <SiteFooter />
    </div>
  )
}

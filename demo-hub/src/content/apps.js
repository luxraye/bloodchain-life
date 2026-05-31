// ── App URLs ──────────────────────────────────────────────────────────
function normalizeUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const target = url.includes('.') || url.includes('localhost')
    ? url
    : `${url}.onrender.com` // legacy shorthand; production uses full https://*.bloodchain.life URLs
  const protocol = target.includes('localhost') || target.includes('127.0.0.1') ? 'http://' : 'https://'
  return protocol + target
}

function appendGuestParam(url) {
  if (!url) return ''
  const target = new URL(normalizeUrl(url))
  target.searchParams.set('guest', '1')
  return target.toString()
}

export const URLS = {
  highCommand: appendGuestParam(import.meta.env.VITE_HIGH_COMMAND_URL || 'http://localhost:5173'),
  marsLab:     appendGuestParam(import.meta.env.VITE_MARS_LAB_URL     || 'http://localhost:5174'),
  voyager:     appendGuestParam(import.meta.env.VITE_VOYAGER_URL      || 'http://localhost:5175'),
  scyther:     appendGuestParam(import.meta.env.VITE_SCYTHER_URL      || 'http://localhost:5176'),
  azure:       appendGuestParam(import.meta.env.VITE_AZURE_URL        || 'http://localhost:5177'),
  transfuse:   appendGuestParam(import.meta.env.VITE_TRANSFUSE_URL    || 'http://localhost:5178'),
  helix:       appendGuestParam(import.meta.env.VITE_HELIX_URL        || 'http://localhost:5179'),
  chronicle:   appendGuestParam(import.meta.env.VITE_CHRONICLE_URL    || 'http://localhost:5180'),
  sentinel:    appendGuestParam(import.meta.env.VITE_SENTINEL_URL     || 'http://localhost:5181'),
}

// ── Platform Modules ──────────────────────────────────────────────────
export const APPS = [
  {
    id: 'high-command',
    name: 'High Command',
    role: 'National oversight & analytics',
    icon: '⬟',
    accentColor: '#A81F38',
    tagline: 'National programme cockpit.',
    description:
      'National programme cockpit — supply KPIs, constellation module health, staff provisioning (Keymaster), donor KYC, master custody ledger, and ministry reports across the full blood OS.',
    stack: ['React', 'Vite', 'TanStack', 'Tremor', 'Supabase'],
    url: URLS.highCommand,
    deviceFrame: null,
    showQr: false,
    status: 'live',
    proposed: false,
  },
  {
    id: 'mars-lab',
    name: 'Mars Lab',
    role: 'Laboratory & screening workstation',
    icon: '⬡',
    accentColor: '#5BA4D4',
    tagline: 'Bench to release, verified.',
    description:
      'Clinical-grade laboratory workstation for blood bank staff. Barcode-driven specimen intake, infectious disease screening (HIV, Hep B/C, syphilis, malaria), blood grouping, component QC, and regulatory documentation export.',
    stack: ['React', 'TanStack Table', 'jsPDF', 'Supabase'],
    url: URLS.marsLab,
    deviceFrame: null,
    showQr: false,
    status: 'live',
    proposed: false,
  },
  {
    id: 'voyager',
    name: 'Voyager',
    role: 'Supply chain & logistics',
    icon: '➤',
    accentColor: '#84cc16',
    tagline: 'Dispatch, cold chain, custody.',
    description:
      'Logistics coordinator workstation — national dispatch queue, assign couriers, STAT expedite, cold-chain acknowledgement, Deck.gl map, and custody handovers. Couriers execute in the field; coordinators command from desktop.',
    stack: ['React', 'MapLibre GL', 'Deck.gl', 'Supabase'],
    url: URLS.voyager,
    deviceFrame: null,
    showQr: true,
    status: 'live',
    proposed: false,
  },
  {
    id: 'scyther',
    name: 'Scyther',
    role: 'Blood collection — field operations',
    icon: '✦',
    accentColor: '#00FF88',
    tagline: 'Field collection, offline-first.',
    description:
      'Edge-first collection platform for field staff. Donor eligibility screening, phlebotomy workflow guidance, ISBT-128 unit labelling, and mobile blood drive management. Offline-capable — syncs when connectivity returns.',
    stack: ['React', 'WatermelonDB', 'html5-qrcode', 'Supabase'],
    url: URLS.scyther,
    deviceFrame: 'ipad',
    showQr: true,
    status: 'live',
    proposed: false,
  },
  {
    id: 'azure',
    name: 'Azure',
    role: 'Donor & patient portal',
    icon: '◉',
    accentColor: '#00C8FF',
    tagline: 'Donor portal in your pocket.',
    description:
      'Public donor portal (PWA) — registration, trust & identity tiers, donation journey, scheduling, family blood requests, and nearby urgent appeals. Cyan-accent national chrome with demo seed data.',
    stack: ['React PWA', 'Framer Motion', 'Supabase', 'vite-pwa'],
    url: URLS.azure,
    deviceFrame: 'iphone',
    showQr: true,
    status: 'live',
    proposed: false,
  },
  {
    id: 'transfuse',
    name: 'Transfuse',
    role: 'Clinical transfusion management',
    icon: '♦',
    accentColor: '#FF2D55',
    tagline: 'Hospital transfusion workflows.',
    description:
      'Hospital-side blood request and approval workflows, transfusion committee management, crossmatch compatibility checking, and haemovigilance adverse event reporting.',
    stack: ['React', 'Vite', 'TanStack Table', 'Supabase'],
    url: URLS.transfuse,
    deviceFrame: null,
    showQr: false,
    status: 'live',
    proposed: false,
  },
  {
    id: 'helix',
    name: 'Helix',
    role: 'Research & clinical trials',
    icon: '⌬',
    accentColor: '#D96070',
    tagline: 'Research custody and trials.',
    description:
      'Data management backbone for blood-related clinical research. Sample chain-of-custody, participant enrolment, IRB-ready audit trails. Built for PEPFAR-funded and academic research environments.',
    stack: ['React', 'Vite', 'Supabase'],
    url: URLS.helix,
    deviceFrame: null,
    showQr: false,
    status: 'live',
    proposed: false,
  },
  {
    id: 'chronicle',
    name: 'Chronicle',
    role: 'Chronic care coordinator workstation',
    icon: '⊕',
    accentColor: '#FFB800',
    tagline: 'Chronic care coordination.',
    description:
      'Population health registry for haemophilia, sickle cell, and thalassaemia. Exception queues, care gaps, MCC-style care plans, factor lot tracking, and four report types for coordinators and BPOMAS aggregates.',
    stack: ['React', 'Vite', 'Supabase'],
    url: URLS.chronicle,
    deviceFrame: null,
    showQr: false,
    status: 'live',
    proposed: false,
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Regulatory compliance & reporting',
    icon: '⬛',
    accentColor: '#7c3aed',
    tagline: 'Regulatory returns and review.',
    description:
      'Regulator review console for structured BMRA returns, QMS surveillance, and hemovigilance filings. Thin Bloodchain client over Instances — JWT submission receipts, file hashes, approve/flag/reject queue.',
    stack: ['React', 'Vite', 'Instances API'],
    url: URLS.sentinel,
    deviceFrame: null,
    showQr: false,
    status: 'live',
    proposed: false,
  },
]

// ── Proposed Modules (roadmap) ─────────────────────────────────────────
export const PROPOSED_MODULES = []

// ── Services (for ServicesSection) ────────────────────────────────────
export const SERVICES = [
  {
    id: 'donation',
    icon: '🩸',
    title: 'Blood Donation Management',
    line: 'Digital operations for donor recruitment, eligibility, and collection.',
    color: '#A81F38',
  },
  {
    id: 'lab',
    icon: '🔬',
    title: 'Laboratory & Screening',
    line: 'Clinical-grade workflow software for blood screening and component QC.',
    color: '#5BA4D4',
  },
  {
    id: 'logistics',
    icon: '🗺',
    title: 'Supply Chain & Logistics',
    line: 'Real-time tracking and cold-chain compliance for blood unit movement.',
    color: '#7c3aed',
  },
  {
    id: 'transfusion',
    icon: '🏥',
    title: 'Clinical Transfusion',
    line: 'Hospital-side blood request, approval, and patient blood management.',
    color: '#00FF88',
  },
  {
    id: 'disorders',
    icon: '🧬',
    title: 'Chronic Blood Disorders',
    line: 'Patient registries and care coordination for lifelong blood conditions.',
    color: '#FFB800',
  },
  {
    id: 'compliance',
    icon: '🛡',
    title: 'Regulatory Compliance',
    line: 'Structured, verified reporting for health regulators.',
    color: '#00C8FF',
  },
  {
    id: 'research',
    icon: '⚗️',
    title: 'Research & Clinical Trials',
    line: 'Sample tracking and IRB-ready data management for blood research.',
    color: '#f59e0b',
  },
  {
    id: 'oversight',
    icon: '📊',
    title: 'National Oversight & Analytics',
    line: 'Population-level dashboards for health ministries.',
    color: '#FF2D55',
  },
]

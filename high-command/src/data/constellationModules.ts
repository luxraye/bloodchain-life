/**
 * National Blood OS — module registry for High Command oversight.
 * Production URLs from VITE_* env (set on Render via bc-demo-hub-links group or per-service).
 */

export type ModulePillar = 'operations' | 'clinical' | 'population' | 'governance'

export type ModuleStatus = 'live' | 'alert' | 'degraded'

export interface ConstellationModule {
  id: string
  name: string
  role: string
  pillar: ModulePillar
  icon: string
  accentColor: string
  launchUrl: string
  status: ModuleStatus
  demoMetric: { label: string; value: string }
  description: string
}

function withGuest(url: string) {
  if (!url) return ''
  const target = new URL(url.startsWith('http') ? url : `https://${url}`)
  target.searchParams.set('guest', '1')
  return target.toString()
}

function isLocalHost() {
  if (typeof window === 'undefined') return true
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1'
}

function moduleUrl(envValue: string | undefined, productionUrl: string, localPort: number) {
  const base = envValue || (isLocalHost() ? `http://localhost:${localPort}` : productionUrl)
  return withGuest(base)
}

export const PILLAR_LABEL: Record<ModulePillar, string> = {
  operations: 'Supply chain operations',
  clinical: 'Clinical & laboratory',
  population: 'Population health',
  governance: 'Governance & assurance',
}

export const CONSTELLATION_MODULES: ConstellationModule[] = [
  {
    id: 'scyther',
    name: 'Scyther',
    role: 'Collection & field ops',
    pillar: 'operations',
    icon: '✦',
    accentColor: '#00FF88',
    launchUrl: moduleUrl(import.meta.env.VITE_SCYTHER_URL, 'https://scyther.bloodchain.life', 5176),
    status: 'live',
    demoMetric: { label: 'Drives this week', value: '12' },
    description: 'Donor eligibility, phlebotomy, ISBT labelling, mobile drives.',
  },
  {
    id: 'mars-lab',
    name: 'Mars Lab',
    role: 'Laboratory & screening',
    pillar: 'clinical',
    icon: '⬡',
    accentColor: '#5BA4D4',
    launchUrl: moduleUrl(import.meta.env.VITE_MARS_LAB_URL, 'https://mars.bloodchain.life', 5174),
    status: 'live',
    demoMetric: { label: 'Testing queue', value: '9' },
    description: 'TTI screening, grouping, component QC, release documentation.',
  },
  {
    id: 'voyager',
    name: 'Voyager',
    role: 'Logistics & cold chain',
    pillar: 'operations',
    icon: '➤',
    accentColor: '#84cc16',
    launchUrl: moduleUrl(import.meta.env.VITE_VOYAGER_URL, 'https://voyager.bloodchain.life', 5175),
    status: 'alert',
    demoMetric: { label: 'In transit', value: '6' },
    description: 'Inter-facility transfers, custody handshakes, expiry alerts.',
  },
  {
    id: 'transfuse',
    name: 'Transfuse',
    role: 'Hospital transfusion',
    pillar: 'clinical',
    icon: '♦',
    accentColor: '#FF2D55',
    launchUrl: moduleUrl(import.meta.env.VITE_TRANSFUSE_URL, 'https://transfuse.bloodchain.life', 5178),
    status: 'live',
    demoMetric: { label: 'Open requests', value: '4' },
    description: 'Blood orders, crossmatch, committee workflows, haemovigilance.',
  },
  {
    id: 'azure',
    name: 'Azure',
    role: 'Donor & patient portal',
    pillar: 'operations',
    icon: '◉',
    accentColor: '#00C8FF',
    launchUrl: moduleUrl(import.meta.env.VITE_AZURE_URL, 'https://azure.bloodchain.life', 5177),
    status: 'live',
    demoMetric: { label: 'Pending KYC', value: '18' },
    description: 'Public registration, trust tiers, donation journey visibility.',
  },
  {
    id: 'chronicle',
    name: 'Chronicle',
    role: 'Chronic care registry',
    pillar: 'population',
    icon: '⊕',
    accentColor: '#FFB800',
    launchUrl: moduleUrl(import.meta.env.VITE_CHRONICLE_URL, 'https://chronicle.bloodchain.life', 5180),
    status: 'live',
    demoMetric: { label: 'Open exceptions', value: '6' },
    description: 'Haemophilia, sickle cell, thalassaemia — care gaps and cohorts.',
  },
  {
    id: 'helix',
    name: 'Helix',
    role: 'Research & trials',
    pillar: 'population',
    icon: '⌬',
    accentColor: '#D96070',
    launchUrl: moduleUrl(import.meta.env.VITE_HELIX_URL, 'https://helix.bloodchain.life', 5179),
    status: 'live',
    demoMetric: { label: 'Active studies', value: '3' },
    description: 'Specimen custody, participants, IRB-ready audit trails.',
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Regulatory compliance',
    pillar: 'governance',
    icon: '⬛',
    accentColor: '#7c3aed',
    launchUrl: moduleUrl(import.meta.env.VITE_SENTINEL_URL, 'https://sentinel.bloodchain.life', 5181),
    status: 'live',
    demoMetric: { label: 'Review queue', value: '3' },
    description: 'BMRA returns, QMS surveillance — reviewer console over Instances.',
  },
]

export function modulesByPillar(pillar: ModulePillar) {
  return CONSTELLATION_MODULES.filter((m) => m.pillar === pillar)
}

export function constellationHealthSummary() {
  const live = CONSTELLATION_MODULES.filter((m) => m.status === 'live').length
  const alert = CONSTELLATION_MODULES.filter((m) => m.status === 'alert').length
  return { total: CONSTELLATION_MODULES.length, live, alert }
}

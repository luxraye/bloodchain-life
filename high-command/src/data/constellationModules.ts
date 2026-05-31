/**
 * National Blood OS — module registry for High Command oversight.
 * URLs match demo-hub local defaults; override via env in production.
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
  localPath: string
  status: ModuleStatus
  demoMetric: { label: string; value: string }
  description: string
}

const host = (port: number) => `http://localhost:${port}?guest=1`

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
    localPath: host(5176),
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
    localPath: host(5174),
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
    localPath: host(5175),
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
    localPath: host(5178),
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
    localPath: host(5177),
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
    localPath: host(5180),
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
    localPath: host(5179),
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
    localPath: host(5181),
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

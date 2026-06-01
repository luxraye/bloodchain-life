// ── Platform modules (marketing only — no public app URLs) ───────────────

export const APPS = [
  {
    id: 'high-command',
    name: 'High Command',
    role: 'National oversight & analytics',
    icon: '⬟',
    accentColor: '#A81F38',
    tagline: 'National programme cockpit.',
    description:
      'Programme-level visibility across supply, logistics, wastage, staff access, donor verification, custody records, and ministry reporting for the national blood system.',
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
      'Laboratory workflows for specimen intake, infectious disease screening, blood grouping, component quality control, and release documentation.',
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
      'Coordination of inter-facility transfers, courier assignment, cold-chain checkpoints, and custody handovers from dispatch through delivery.',
    status: 'live',
    proposed: false,
  },
  {
    id: 'scyther',
    name: 'Scyther',
    role: 'Blood collection — field operations',
    icon: '✦',
    accentColor: '#00FF88',
    tagline: 'Field collection, offline-capable.',
    description:
      'Field collection workflows for eligibility screening, phlebotomy support, unit labelling, and mobile drive management with sync when connectivity returns.',
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
      'Donor registration, identity verification tiers, donation scheduling, family blood requests, and visibility into the donation journey.',
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
      'Hospital blood requests, committee workflows, compatibility checking, and haemovigilance reporting for clinical transfusion teams.',
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
      'Study management, specimen chain-of-custody, participant enrolment, and audit-ready exports for institutional review and sponsors.',
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
      'Population health coordination for haemophilia, sickle cell, and thalassaemia — exception queues, care plans, and coordinator reporting.',
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
      'Structured regulatory returns, quality surveillance, and reviewer workflows for national blood programme compliance teams.',
    status: 'live',
    proposed: false,
  },
]

export const PROPOSED_MODULES = []

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
    line: 'Sample tracking and audit-ready data management for blood research.',
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

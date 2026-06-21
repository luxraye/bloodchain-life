// ─────────────────────────────────────────────────────────────────────────────
// Bespoke demo landings — unlisted, target-specific entry points.
//
// These power clean URLs we hand to a single prospect (e.g. /demo/blb) so they
// land directly on the module(s) that matter to them, with copy that speaks to
// their pain — without the noise of the rest of the constellation.
//
// Not linked from anywhere in the public site. Resolved by slug in App.jsx.
//
// The module launch URL per target is optional and read from an env var so we
// never hardcode private app URLs. When unset, the CTA falls back to a bespoke
// briefing-request mailto (consistent with the briefing-by-appointment posture).
// ─────────────────────────────────────────────────────────────────────────────

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {}

export const BESPOKE_DEMOS = {
  blb: {
    slug: 'blb',
    org: 'Blood for Life Botswana',
    audience: 'Volunteer-led community blood drives',
    accent: '#00FF88',
    modules: ['Scyther', 'Azure'],
    launchUrl: env.VITE_DEMO_BLB_URL || '',
    eyebrow: 'For Blood for Life Botswana',
    headline: 'Digitise the drive. Keep the donors.',
    sub: 'Run a paperless community blood drive — Omang-verified check-in, deduplicated donors, and a portal that brings the same people back next time. Built to chip away at Botswana’s 17,000-unit annual shortfall, one drive at a time.',
    stats: [
      { value: '17,000', label: 'Annual unit deficit we target' },
      { value: '0', label: 'Paper eligibility forms' },
      { value: 'Omang', label: 'ID-verified, deduplicated' },
    ],
    painPoints: [
      {
        problem: 'Paper sign-in sheets at every drive',
        solution: 'Tablet check-in with Omang lookup — eligibility and deferral rules applied on the spot.',
      },
      {
        problem: 'No way to know who already donated',
        solution: 'Local deduplication flags repeat and recently-deferred donors before the needle, not after.',
      },
      {
        problem: 'Donors come once and disappear',
        solution: 'The Azure donor portal tracks returning donors across drives and prompts them when they’re eligible again.',
      },
    ],
    spotlight: {
      title: 'Scyther + Azure, working together',
      body: 'Scyther runs the drive on the ground; Azure keeps the donor relationship alive between drives. A donor verified at one community drive is recognised at the next — retention without a spreadsheet.',
    },
    ctaLabel: 'Open the BLB drive simulator',
  },

  baylor: {
    slug: 'baylor',
    org: 'Baylor Children’s Clinical Centre of Excellence',
    audience: 'Paediatric sickle cell care coordination',
    accent: '#FFB800',
    modules: ['Chronicle'],
    launchUrl: env.VITE_DEMO_BAYLOR_URL || '',
    eyebrow: 'For Baylor Children’s CCE',
    headline: 'No child misses a transfusion.',
    sub: 'A care-coordination registry for paediatric sickle cell patients — scheduled transfusions tracked, missed appointments flagged the day they slip, and funder-ready reports generated in one click. Fifty patients, ninety days, real coordination.',
    stats: [
      { value: '50', label: 'Paediatric sickle cell patients' },
      { value: 'Day-0', label: 'Missed-transfusion alerts' },
      { value: 'BIPAI', label: 'Funder-audit exports' },
    ],
    painPoints: [
      {
        problem: 'Transfusion schedules live in a paper diary',
        solution: 'A live registry shows who is due, who is overdue, and who is at rising risk — at a glance.',
      },
      {
        problem: 'A missed transfusion is noticed weeks later',
        solution: 'Missed-transfusion alerts surface in the exception queue the moment a scheduled date passes.',
      },
      {
        problem: 'Funder reports take days to assemble',
        solution: 'One-click care-gap and cohort exports formatted for international funder audits (e.g. BIPAI / PEPFAR).',
      },
    ],
    spotlight: {
      title: 'Built tight, on purpose',
      body: 'This is not a national registry. It is a focused coordination tool for the Baylor paediatric transfusion programme — narrow scope, real children, measurable adherence.',
    },
    ctaLabel: 'Open the Baylor registry simulator',
  },

  gph: {
    slug: 'gph',
    org: 'Gaborone Private Hospital',
    audience: 'Clinical governance & transfusion safety',
    accent: '#FF2D55',
    modules: ['Transfuse'],
    launchUrl: env.VITE_DEMO_GPH_URL || '',
    eyebrow: 'For Gaborone Private Hospital',
    headline: 'Give your Transfusion Committee its evidence base.',
    sub: 'A clinical governance and risk-management tool for hospital transfusion safety — capture an adverse reaction, auto-generate a SADCAS-ready incident report, and run a live Hospital Transfusion Committee review queue. The active HTC the WHO assessment said was missing.',
    stats: [
      { value: 'SADCAS', label: 'Audit-ready incident reports' },
      { value: 'HTC', label: 'Live committee review queue' },
      { value: 'WHO', label: 'Closes the documented gap' },
    ],
    painPoints: [
      {
        problem: 'No active Hospital Transfusion Committee record',
        solution: 'A standing review queue gives the committee a real, time-stamped caseload to govern.',
      },
      {
        problem: 'Adverse reactions recorded ad hoc, if at all',
        solution: 'A guided haemovigilance workflow captures the reaction and routes it straight to committee review.',
      },
      {
        problem: 'Accreditation audits scramble for paperwork',
        solution: 'Every reaction generates a SADCAS-aligned incident report on demand — ready for the auditor.',
      },
    ],
    spotlight: {
      title: 'Risk management, not bureaucracy',
      body: 'Framed for accreditation and patient safety: faster than the public route, and exactly what a private hospital group needs to evidence governance.',
    },
    ctaLabel: 'Open the GPH transfusion simulator',
  },
}

export function getBespokeDemo(slug) {
  if (!slug) return null
  return BESPOKE_DEMOS[slug.toLowerCase()] ?? null
}

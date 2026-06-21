/** Chronicle demo registry — coordinator workstation seed data */

export const CONDITION_LABEL = {
  HAEMOPHILIA: 'Haemophilia',
  SICKLE_CELL: 'Sickle cell disease',
  THALASSEMIA: 'Thalassaemia',
}

export const CONDITION_STYLE = {
  HAEMOPHILIA: { color: '#D96070', bg: 'rgba(168,31,56,0.12)' },
  SICKLE_CELL: { color: '#FF2D55', bg: 'rgba(255,45,85,0.1)' },
  THALASSEMIA: { color: '#5BA4D4', bg: 'rgba(58,130,184,0.12)' },
}

const mkPatient = (p) => ({
  careGaps: [],
  auditLog: [],
  sdohFlags: [],
  ...p,
})

export const DEMO_COHORTS = [
  {
    id: 'cohort-haem',
    condition: 'HAEMOPHILIA',
    label: 'Haemophilia — active prophylaxis',
    encounterWindow: '≥1 visit in prior 36 months',
    ruleSummary: 'ICD-10 D66–D68 · factor deficiency on problem list',
    memberCount: 0,
  },
  {
    id: 'cohort-sickle',
    condition: 'SICKLE_CELL',
    label: 'Sickle cell — HbSS / HbSC',
    encounterWindow: '≥1 visit in prior 36 months',
    ruleSummary: 'ICD-10 D57.x · NHSRC programme enrolment',
    memberCount: 0,
  },
  {
    id: 'cohort-thal',
    condition: 'THALASSEMIA',
    label: 'Thalassaemia — transfusion dependent',
    encounterWindow: '≥1 visit in prior 24 months',
    ruleSummary: 'ICD-10 D56.x · regular transfusion schedule',
    memberCount: 0,
  },
]

export const DEMO_PATIENTS = [
  mkPatient({
    id: 'chr-001', registryId: 'CHR-2024-0142', name: 'T. Nakedi', condition: 'HAEMOPHILIA', bloodType: 'O+',
    severity: 'Moderate', site: 'Princess Marina · Haemophilia Clinic', enrolledAt: '2022-03-14', nextReview: '2026-06-15',
    carePlan: { custodian: 'Princess Marina Haemophilia Clinic', prophylaxis: 'Factor VIII 40 IU/kg 3×/week', lastFactorLot: 'FVIII-LOT-8821', target: 'Trough >1%', goals: [{ text: 'Zero spontaneous bleeds', status: 'IN_PROGRESS' }] },
    transfusions: [{ date: '2026-04-12', product: 'Factor VIII concentrate', units: '1 lot', site: 'Ward 4' }],
    careGaps: [{ id: 'gap-001-1', type: 'REVIEW_OVERDUE', severity: 'MODERATE', status: 'OPEN', summary: 'Annual review due in 16 days' }],
    sdohFlags: [],
    notes: 'Stable on prophylaxis; no inhibitors 2025 panel.',
    auditLog: [{ at: '2026-05-01T10:00:00Z', action: 'Care plan reviewed', user: 'Demo Coordinator' }],
  }),
  mkPatient({
    id: 'chr-002', registryId: 'CHR-2023-0088', name: 'R. Dlamini', condition: 'SICKLE_CELL', bloodType: 'AS',
    severity: 'HbSS', site: 'NHSRC · Sickle Cell Programme', enrolledAt: '2021-08-02', nextReview: '2026-05-28',
    carePlan: { custodian: 'NHSRC Sickle Cell Programme', prophylaxis: 'Hydroxyurea 20 mg/kg', lastFactorLot: null, target: 'Hb 8–10 g/dL', goals: [{ text: 'Reduce VOC frequency', status: 'IN_PROGRESS' }] },
    transfusions: [{ date: '2026-03-20', product: 'Leucodepleted RBC', units: '2', site: 'NHSRC' }],
    careGaps: [{ id: 'gap-002-1', type: 'MISSED_VISIT', severity: 'HIGH', status: 'OPEN', summary: 'No PCP encounter in 94 days' }],
    sdohFlags: ['Transportation barrier (Z59.0)'],
    notes: 'Last VOC admission Jan 2026.',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-003', registryId: 'CHR-2024-0201', name: 'M. Phiri', condition: 'THALASSEMIA', bloodType: 'B+',
    severity: 'Beta-thal major', site: 'Bokamoso · Thalassaemia Unit', enrolledAt: '2023-01-19', nextReview: '2026-07-01',
    carePlan: { custodian: 'Bokamoso Thalassaemia Unit', prophylaxis: 'Chelation deferasirox 30 mg/kg', lastFactorLot: null, target: 'Ferritin <1000 µg/L', goals: [] },
    transfusions: [{ date: '2026-05-02', product: 'Leucodepleted RBC', units: '2', site: 'Bokamoso' }],
    careGaps: [],
    sdohFlags: [],
    notes: 'Regular 3-week transfusion schedule.',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-004', registryId: 'CHR-2022-0034', name: 'L. Kgosana', condition: 'HAEMOPHILIA', bloodType: 'A+',
    severity: 'Severe', site: 'Princess Marina', enrolledAt: '2020-11-05', nextReview: '2026-06-02',
    carePlan: { custodian: 'Princess Marina', prophylaxis: 'Emicizumab SC weekly', lastFactorLot: 'EMI-LOT-4410', target: 'Bleed-free days', goals: [] },
    transfusions: [{ date: '2026-01-15', product: 'Factor VIII on demand', units: '1 lot', site: 'Emergency' }],
    careGaps: [{ id: 'gap-004-1', type: 'FACTOR_LAPSE', severity: 'HIGH', status: 'OPEN', summary: 'Prophylaxis refill overdue 12 days' }],
    sdohFlags: [],
    notes: 'On emicizumab since 2024.',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-005', registryId: 'CHR-2025-0012', name: 'K. Moagi', condition: 'SICKLE_CELL', bloodType: 'SS',
    severity: 'HbSS', site: 'Scottish Livingstone', enrolledAt: '2025-02-10', nextReview: '2026-05-20',
    carePlan: { custodian: 'Scottish Livingstone Paediatrics', prophylaxis: 'Penicillin V + folate', lastFactorLot: null, target: 'Transition to adult clinic 2027', goals: [] },
    transfusions: [],
    careGaps: [{ id: 'gap-005-1', type: 'UNCONTROLLED_HBA1C', severity: 'MODERATE', status: 'OPEN', summary: 'HbA1c 9.2% — no endocrine follow-up 120d' }],
    sdohFlags: [],
    notes: 'Baseline imaging pending.',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-006', registryId: 'CHR-2023-0156', name: 'P. Tshosa', condition: 'THALASSEMIA', bloodType: 'O+',
    severity: 'Beta-thal intermedia', site: 'NHSRC', enrolledAt: '2022-06-22', nextReview: '2026-06-18',
    carePlan: { custodian: 'NHSRC', prophylaxis: 'Splenectomy follow-up', lastFactorLot: null, target: 'Transfuse if Hb <7', goals: [] },
    transfusions: [{ date: '2026-02-14', product: 'Leucodepleted RBC', units: '1', site: 'NHSRC' }],
    careGaps: [],
    sdohFlags: [],
    notes: 'Post-splenectomy improved baseline Hb.',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-007', registryId: 'CHR-2024-0310', name: 'S. Molefe', condition: 'SICKLE_CELL', bloodType: 'SC',
    severity: 'HbSC', site: 'Nyangabgwe', enrolledAt: '2023-11-01', nextReview: '2026-06-10',
    carePlan: { custodian: 'Nyangabgwe Haematology', prophylaxis: 'Hydroxyurea 15 mg/kg', lastFactorLot: null, target: 'VOC <2/year', goals: [] },
    transfusions: [{ date: '2025-12-01', product: 'Leucodepleted RBC', units: '1', site: 'Nyangabgwe' }],
    careGaps: [{ id: 'gap-007-1', type: 'MISSED_VISIT', severity: 'MODERATE', status: 'OPEN', summary: 'No clinic visit in 78 days' }],
    sdohFlags: ['Food insecurity (Z59.4)'],
    notes: '',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-008', registryId: 'CHR-2021-0099', name: 'B. Tau', condition: 'HAEMOPHILIA', bloodType: 'O-',
    severity: 'Moderate', site: 'NHSRC', enrolledAt: '2019-04-18', nextReview: '2026-05-25',
    carePlan: { custodian: 'NHSRC', prophylaxis: 'Factor IX 50 IU/kg 2×/week', lastFactorLot: 'FIX-LOT-2209', target: 'Trough >1%', goals: [] },
    transfusions: [],
    careGaps: [],
    sdohFlags: [],
    notes: 'Haemophilia B — stable.',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-009', registryId: 'CHR-2024-0444', name: 'N. Batsumi', condition: 'THALASSEMIA', bloodType: 'AB+',
    severity: 'Beta-thal major', site: 'Princess Marina', enrolledAt: '2024-07-30', nextReview: '2026-06-22',
    carePlan: { custodian: 'Princess Marina', prophylaxis: 'Transfusion + chelation', lastFactorLot: null, target: 'Ferritin trend down', goals: [] },
    transfusions: [{ date: '2026-04-20', product: 'Leucodepleted RBC', units: '2', site: 'PMH' }],
    careGaps: [{ id: 'gap-009-1', type: 'CHELATION_GAP', severity: 'MODERATE', status: 'OPEN', summary: 'Ferritin 1850 µg/L — chelation adherence review' }],
    sdohFlags: [],
    notes: '',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-010', registryId: 'CHR-2025-0077', name: 'G. Sebego', condition: 'SICKLE_CELL', bloodType: 'SS',
    severity: 'HbSS', site: 'Letlhakane DH', enrolledAt: '2025-06-12', nextReview: '2026-05-30',
    carePlan: { custodian: 'Letlhakane · outreach', prophylaxis: 'Hydroxyurea', lastFactorLot: null, target: 'Link to NHSRC hub', goals: [] },
    transfusions: [],
    careGaps: [{ id: 'gap-010-1', type: 'RISING_RISK', severity: 'HIGH', status: 'OPEN', summary: '2 ED visits in 60 days — outreach required' }],
    sdohFlags: ['Transportation barrier (Z59.0)', 'Rural access'],
    notes: 'Telehealth follow-up scheduled.',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-011', registryId: 'CHR-2023-0222', name: 'A. Keletso', condition: 'HAEMOPHILIA', bloodType: 'B+',
    severity: 'Mild', site: 'Gaborone Private', enrolledAt: '2022-09-01', nextReview: '2026-07-05',
    carePlan: { custodian: 'Gaborone Private Hospital', prophylaxis: 'On-demand factor', lastFactorLot: 'FVIII-LOT-9012', target: 'Dental prophylaxis before procedures', goals: [] },
    transfusions: [],
    careGaps: [],
    sdohFlags: [],
    notes: '',
    auditLog: [],
  }),
  mkPatient({
    id: 'chr-012', registryId: 'CHR-2024-0555', name: 'D. Motlhomi', condition: 'SICKLE_CELL', bloodType: 'AS',
    severity: 'HbAS trait carrier — child patient', site: 'NHSRC', enrolledAt: '2024-02-14', nextReview: '2026-06-01',
    carePlan: { custodian: 'NHSRC Paediatrics', prophylaxis: 'Penicillin prophylaxis', lastFactorLot: null, target: 'Parent counselling complete', goals: [] },
    transfusions: [],
    careGaps: [],
    sdohFlags: [],
    notes: 'Trait surveillance only.',
    auditLog: [],
  }),
]

// ─────────────────────────────────────────────────────────────────────────────
// Baylor Children's CCE — paediatric sickle cell cohort (50 profiles)
//
// Generated deterministically so the registry, exception queue, and funder
// exports stay stable across reloads. Adds a transfusion-schedule concept and
// MISSED_TRANSFUSION care gaps — the core of the Baylor "no child misses a
// scheduled transfusion" story.
// ─────────────────────────────────────────────────────────────────────────────

export const BAYLOR_SITE = 'Baylor Children\u2019s CCE \u00b7 Sickle Cell Clinic'

const PAED_FIRST_NAMES = [
  'Tshepo', 'Lesego', 'Karabo', 'Naledi', 'Bonolo', 'Kgomotso', 'Oratile', 'Thato',
  'Amantle', 'Warona', 'Atang', 'Lebogang', 'Reabetswe', 'Goitseone', 'Bokang', 'Tumelo',
  'Larona', 'Boago', 'Kgalalelo', 'Pako', 'Tirelo', 'Onalenna', 'Loago', 'Mosa',
  'Resego', 'Tlotlo', 'Boikanyo', 'Kefilwe', 'Neo', 'Phenyo', 'Tshiamo', 'Uyapo',
  'Wame', 'Aobakwe', 'Dineo', 'Emang', 'Gaone', 'Itumeleng', 'Kabo', 'Lorato',
  'Mompati', 'Nkagiso', 'Oarabile', 'Sethunya', 'Tefo', 'Wapula', 'Yarona', 'Boitshepo',
  'Maatla', 'Refentse',
]

const PAED_LAST_INITIALS = [
  'Mokwena', 'Seretse', 'Phiri', 'Tau', 'Kgosana', 'Moeng', 'Dube', 'Molefe',
  'Ramotswa', 'Pule', 'Modise', 'Kebonang', 'Selepeng', 'Letsholo', 'Morwaeng',
  'Khama', 'Mogapi', 'Sebina', 'Galebotswe', 'Bathobakae',
]

const PAED_GENOTYPES = ['HbSS', 'HbSS', 'HbSS', 'HbSC', 'HbS\u03b2-thal'] // HbSS-weighted
const PAED_BLOOD = ['O+', 'A+', 'B+', 'O-', 'A+', 'O+', 'AB+', 'B-', 'A-', 'O+']
const REFERRAL_SITES = ['Princess Marina \u00b7 referral', 'Nyangabgwe \u00b7 referral', 'Molepolole \u00b7 outreach']
const SDOH_POOL = [
  ['Transportation barrier (Z59.0)'],
  ['Caregiver employment (Z59.6)'],
  ['Rural access'],
  [],
  [],
  ['Food insecurity (Z59.4)'],
]

const DAY_MS = 86400000
const isoFromNow = (days) => new Date(Date.now() + days * DAY_MS).toISOString()
const dateFromNow = (days) => isoFromNow(days).slice(0, 10)

/** Build the 50-patient Baylor paediatric sickle cell cohort + matching exceptions. */
function buildPaediatricSickleCohort() {
  const patients = []
  const exceptions = []

  for (let i = 0; i < 50; i++) {
    const seq = String(i + 1).padStart(3, '0')
    const id = `bay-${seq}`
    const registryId = `BAY-2026-${seq}`
    const first = PAED_FIRST_NAMES[i % PAED_FIRST_NAMES.length]
    const last = PAED_LAST_INITIALS[(i * 3) % PAED_LAST_INITIALS.length]
    const name = `${first} ${last[0]}.`
    const age = 2 + ((i * 7) % 16) // 2–17 yrs (paediatric)
    const genotype = PAED_GENOTYPES[i % PAED_GENOTYPES.length]
    const bloodType = PAED_BLOOD[i % PAED_BLOOD.length]
    const guardian = `${PAED_FIRST_NAMES[(i * 5) % PAED_FIRST_NAMES.length]} ${last}`

    // Chronic transfusion programme: HbSS on a 3–4 week schedule; others hydroxyurea-led.
    const onTransfusionProgramme = genotype === 'HbSS' && i % 3 !== 0
    const intervalWeeks = onTransfusionProgramme ? (i % 2 === 0 ? 3 : 4) : null
    const site = i % 9 === 4 ? REFERRAL_SITES[i % REFERRAL_SITES.length] : BAYLOR_SITE

    // Transfusion timing → drives MISSED_TRANSFUSION gaps.
    // Every 4th programme patient is overdue (missed), rest are upcoming/on-time.
    let nextTransfusionDue = null
    let lastTransfusionAt = null
    let overdueDays = 0
    if (onTransfusionProgramme) {
      const intervalDays = intervalWeeks * 7
      if (i % 4 === 0) {
        overdueDays = 7 + (i % 21) // 7–28 days overdue
        nextTransfusionDue = dateFromNow(-overdueDays)
        lastTransfusionAt = dateFromNow(-(intervalDays + overdueDays))
      } else {
        const dueIn = (i % intervalDays) - 2 // mostly upcoming, a couple due now
        nextTransfusionDue = dateFromNow(Math.max(dueIn, 1))
        lastTransfusionAt = dateFromNow(-(intervalDays - Math.max(dueIn, 1)))
      }
    }

    const careGaps = []
    if (overdueDays > 0) {
      careGaps.push({
        id: `${id}-gap-tx`,
        type: 'MISSED_TRANSFUSION',
        severity: overdueDays > 14 ? 'HIGH' : 'MODERATE',
        status: 'OPEN',
        summary: `Scheduled transfusion overdue ${overdueDays} days (q${intervalWeeks}w)`,
      })
    }
    if (i % 7 === 3) {
      careGaps.push({
        id: `${id}-gap-visit`,
        type: 'MISSED_VISIT',
        severity: 'MODERATE',
        status: 'OPEN',
        summary: `No clinic encounter in ${60 + (i % 40)} days`,
      })
    }
    if (i % 11 === 5) {
      careGaps.push({
        id: `${id}-gap-risk`,
        type: 'RISING_RISK',
        severity: 'HIGH',
        status: 'OPEN',
        summary: `${2 + (i % 2)} VOC admissions in 90 days — review`,
      })
    }
    if (i % 13 === 6) {
      careGaps.push({
        id: `${id}-gap-tcd`,
        type: 'TCD_SCREEN_DUE',
        severity: 'MODERATE',
        status: 'OPEN',
        summary: 'Transcranial Doppler stroke screen overdue',
      })
    }

    const transfusions = lastTransfusionAt
      ? [{ date: lastTransfusionAt, product: 'Leucodepleted RBC (paediatric)', units: '1', site: 'Baylor Day Unit' }]
      : []

    patients.push(mkPatient({
      id,
      registryId,
      name,
      condition: 'SICKLE_CELL',
      bloodType,
      severity: genotype,
      age,
      paediatric: true,
      guardian,
      site,
      enrolledAt: dateFromNow(-(120 + i * 11)),
      nextReview: dateFromNow((i % 30) - 5),
      nextTransfusionDue,
      transfusionIntervalWeeks: intervalWeeks,
      carePlan: {
        custodian: 'Baylor Children\u2019s CCE',
        prophylaxis: onTransfusionProgramme
          ? `Chronic transfusion q${intervalWeeks}w + folate`
          : 'Hydroxyurea 20 mg/kg + penicillin V + folate',
        lastFactorLot: null,
        target: onTransfusionProgramme ? 'HbS <30% pre-transfusion' : 'Reduce VOC frequency',
        goals: [{ text: 'Zero missed scheduled transfusions', status: 'IN_PROGRESS' }],
      },
      transfusions,
      careGaps,
      sdohFlags: SDOH_POOL[i % SDOH_POOL.length],
      notes: `Paediatric ${genotype} · age ${age} · guardian ${guardian}.`,
      auditLog: [],
    }))

    // Surface high-priority gaps into the shared exception queue.
    const txGap = careGaps.find((g) => g.type === 'MISSED_TRANSFUSION')
    if (txGap) {
      exceptions.push({
        id: `ex-${id}-tx`,
        patientId: id,
        patientName: name,
        registryId,
        type: 'MISSED_TRANSFUSION',
        severity: txGap.severity,
        status: 'OPEN',
        assignee: null,
        summary: txGap.summary,
        createdAt: isoFromNow(-(overdueDays)),
      })
    }
    const riskGap = careGaps.find((g) => g.type === 'RISING_RISK')
    if (riskGap) {
      exceptions.push({
        id: `ex-${id}-risk`,
        patientId: id,
        patientName: name,
        registryId,
        type: 'RISING_RISK',
        severity: 'HIGH',
        status: 'OPEN',
        assignee: null,
        summary: riskGap.summary,
        createdAt: isoFromNow(-(i % 20)),
      })
    }
  }

  return { patients, exceptions }
}

const PAED_SICKLE_COHORT = buildPaediatricSickleCohort()
DEMO_PATIENTS.push(...PAED_SICKLE_COHORT.patients)

export const DEMO_EXCEPTIONS = [
  { id: 'ex-001', patientId: 'chr-002', patientName: 'R. Dlamini', registryId: 'CHR-2023-0088', type: 'MISSED_VISIT', severity: 'HIGH', status: 'OPEN', assignee: null, summary: 'No PCP encounter in 94 days', createdAt: '2026-05-20T08:00:00Z' },
  { id: 'ex-002', patientId: 'chr-004', patientName: 'L. Kgosana', registryId: 'CHR-2022-0034', type: 'FACTOR_LAPSE', severity: 'HIGH', status: 'OPEN', assignee: 'Demo Coordinator', summary: 'Prophylaxis refill overdue 12 days', createdAt: '2026-05-22T09:00:00Z' },
  { id: 'ex-003', patientId: 'chr-010', patientName: 'G. Sebego', registryId: 'CHR-2025-0077', type: 'RISING_RISK', severity: 'HIGH', status: 'OPEN', assignee: null, summary: '2 ED visits in 60 days', createdAt: '2026-05-25T11:00:00Z' },
  { id: 'ex-004', patientId: 'chr-007', patientName: 'S. Molefe', registryId: 'CHR-2024-0310', type: 'MISSED_VISIT', severity: 'MODERATE', status: 'IN_PROGRESS', assignee: 'Demo Coordinator', summary: 'No clinic visit in 78 days', createdAt: '2026-05-18T10:00:00Z' },
  { id: 'ex-005', patientId: 'chr-005', patientName: 'K. Moagi', registryId: 'CHR-2025-0012', type: 'UNCONTROLLED_HBA1C', severity: 'MODERATE', status: 'OPEN', assignee: null, summary: 'HbA1c 9.2%', createdAt: '2026-05-26T14:00:00Z' },
  { id: 'ex-006', patientId: 'chr-009', patientName: 'N. Batsumi', registryId: 'CHR-2024-0444', type: 'CHELATION_GAP', severity: 'MODERATE', status: 'CONTACTED', assignee: 'Demo Coordinator', summary: 'Ferritin 1850 µg/L', createdAt: '2026-05-15T08:00:00Z' },
  ...PAED_SICKLE_COHORT.exceptions,
]

export const DEMO_DISCREPANCIES = [
  { id: 'disc-001', patientId: 'chr-002', registryId: 'CHR-2023-0088', issue: 'Billing D57.1 without active problem list entry', status: 'OPEN', detectedAt: '2026-05-28' },
  { id: 'disc-002', patientId: 'chr-008', registryId: 'CHR-2021-0099', issue: 'Problem list haemophilia B — no matching claim in 18 months', status: 'OPEN', detectedAt: '2026-05-27' },
  { id: 'disc-003', patientId: 'chr-012', registryId: 'CHR-2024-0555', issue: 'Trait on problem list — enrolled in HbSS cohort (review)', status: 'UNDER_REVIEW', detectedAt: '2026-05-26' },
]

// sync cohort counts
DEMO_COHORTS.forEach((c) => {
  c.memberCount = DEMO_PATIENTS.filter((p) => p.condition === c.condition).length
})

export function getPatientById(id) {
  return DEMO_PATIENTS.find((p) => p.id === id) ?? null
}

export function registryStats(patients, exceptions) {
  const byCondition = {}
  patients.forEach((p) => { byCondition[p.condition] = (byCondition[p.condition] || 0) + 1 })
  const reviewsDue = patients.filter((p) => {
    const d = new Date(p.nextReview)
    const in14 = Date.now() + 14 * 86400000
    return d <= new Date(in14)
  }).length
  const openExceptions = exceptions.filter((e) => e.status !== 'RESOLVED' && e.status !== 'CLOSED').length
  return { total: patients.length, byCondition, reviewsDue, openExceptions }
}

export function toCsv(rows, columns) {
  const header = columns.join(',')
  const body = rows.map((r) => columns.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  return `${header}\n${body}`
}

// ── Care-gap / missed-transfusion helpers (Baylor paediatric sickle cell) ────

export const MISSED_TRANSFUSION = 'MISSED_TRANSFUSION'

export function isTransfusionOverdue(patient) {
  if (!patient?.nextTransfusionDue) return false
  return new Date(patient.nextTransfusionDue) < new Date()
}

/** Patients with an open missed-transfusion care gap. */
export function missedTransfusionPatients(patients) {
  return patients.filter((p) =>
    (p.careGaps || []).some((g) => g.type === 'MISSED_TRANSFUSION' && g.status === 'OPEN'),
  )
}

/** Flatten all open care gaps with patient context attached. */
export function openCareGaps(patients) {
  return patients.flatMap((p) =>
    (p.careGaps || [])
      .filter((g) => g.status === 'OPEN')
      .map((g) => ({ ...g, patientId: p.id, patientName: p.name, registryId: p.registryId, site: p.site })),
  )
}

/** Aggregate counts for the registry / exception dashboards. */
export function careGapSummary(patients) {
  const gaps = openCareGaps(patients)
  const byType = {}
  gaps.forEach((g) => { byType[g.type] = (byType[g.type] || 0) + 1 })
  return {
    total: gaps.length,
    byType,
    missedTransfusions: byType.MISSED_TRANSFUSION || 0,
    highSeverity: gaps.filter((g) => g.severity === 'HIGH').length,
  }
}

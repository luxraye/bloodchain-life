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

export const DEMO_EXCEPTIONS = [
  { id: 'ex-001', patientId: 'chr-002', patientName: 'R. Dlamini', registryId: 'CHR-2023-0088', type: 'MISSED_VISIT', severity: 'HIGH', status: 'OPEN', assignee: null, summary: 'No PCP encounter in 94 days', createdAt: '2026-05-20T08:00:00Z' },
  { id: 'ex-002', patientId: 'chr-004', patientName: 'L. Kgosana', registryId: 'CHR-2022-0034', type: 'FACTOR_LAPSE', severity: 'HIGH', status: 'OPEN', assignee: 'Demo Coordinator', summary: 'Prophylaxis refill overdue 12 days', createdAt: '2026-05-22T09:00:00Z' },
  { id: 'ex-003', patientId: 'chr-010', patientName: 'G. Sebego', registryId: 'CHR-2025-0077', type: 'RISING_RISK', severity: 'HIGH', status: 'OPEN', assignee: null, summary: '2 ED visits in 60 days', createdAt: '2026-05-25T11:00:00Z' },
  { id: 'ex-004', patientId: 'chr-007', patientName: 'S. Molefe', registryId: 'CHR-2024-0310', type: 'MISSED_VISIT', severity: 'MODERATE', status: 'IN_PROGRESS', assignee: 'Demo Coordinator', summary: 'No clinic visit in 78 days', createdAt: '2026-05-18T10:00:00Z' },
  { id: 'ex-005', patientId: 'chr-005', patientName: 'K. Moagi', registryId: 'CHR-2025-0012', type: 'UNCONTROLLED_HBA1C', severity: 'MODERATE', status: 'OPEN', assignee: null, summary: 'HbA1c 9.2%', createdAt: '2026-05-26T14:00:00Z' },
  { id: 'ex-006', patientId: 'chr-009', patientName: 'N. Batsumi', registryId: 'CHR-2024-0444', type: 'CHELATION_GAP', severity: 'MODERATE', status: 'CONTACTED', assignee: 'Demo Coordinator', summary: 'Ferritin 1850 µg/L', createdAt: '2026-05-15T08:00:00Z' },
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

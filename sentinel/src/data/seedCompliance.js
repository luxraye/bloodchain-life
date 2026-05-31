/** Demo compliance filings — mirrors Instances API shapes (BMRA / hemovigilance themed). */

export const STATUS_STYLE = {
  PENDING: { color: '#8899A8', bg: 'rgba(136,153,168,0.12)' },
  IN_PROGRESS: { color: '#8EC4E8', bg: 'rgba(58,130,184,0.12)' },
  SUBMITTED: { color: '#a78bfa', bg: 'rgba(124,58,237,0.15)' },
  APPROVED: { color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  FLAGGED: { color: '#FFB800', bg: 'rgba(255,184,0,0.12)' },
  REJECTED: { color: '#FF2D55', bg: 'rgba(255,45,85,0.12)' },
}

export const TEMPLATES = [
  { id: 'tpl-bmra-qtr', code: 'BMRA-QTR-RETURN', name: 'Quarterly blood bank return', version: 2 },
  { id: 'tpl-hemovig', code: 'HEMOVIG-INCIDENT', name: 'Serious adverse transfusion event', version: 1 },
  { id: 'tpl-qms', code: 'QMS-SURVEILLANCE', name: 'QMS surveillance checklist', version: 3 },
  { id: 'tpl-who', code: 'WHO-HEMOVIG-AGG', name: 'WHO hemovigilance aggregate return', version: 1 },
]

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function daysAhead(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export function buildSeedInstances() {
  const assignees = [
    { id: 'u-francistown', name: 'Francistown Regional BB', email: 'quality@francistown.bb.bw' },
    { id: 'u-gaborone', name: 'National Blood Transfusion Service', email: 'compliance@nbts.gov.bw' },
    { id: 'u-maun', name: 'Maun District Hospital BB', email: 'lab@maun.hospital.bw' },
    { id: 'u-private', name: 'Bokamoso Private Hospital', email: 'qms@bokamoso.bw' },
  ]

  return [
    {
      id: 'inst-demo-001',
      status: 'SUBMITTED',
      deadline: daysAhead(5),
      submittedAt: daysAgo(2),
      submissionJwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.receipt',
      template: TEMPLATES[0],
      assignee: assignees[1],
      submissionPayload: { reportingPeriod: '2026-Q1', unitsCollected: 8420, wastageRate: 0.04 },
      files: [{ id: 'f1', slotKey: 'signed_return', fileName: 'NBTS_Q1_2026_signed.pdf', clientHash: 'sha256:abc…', serverHash: 'sha256:abc…' }],
    },
    {
      id: 'inst-demo-002',
      status: 'SUBMITTED',
      deadline: daysAhead(3),
      submittedAt: daysAgo(1),
      submissionJwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.receipt2',
      template: TEMPLATES[1],
      assignee: assignees[0],
      submissionPayload: { incidentDate: '2026-05-22', severity: 'serious', component: 'RBC' },
      files: [],
    },
    {
      id: 'inst-demo-003',
      status: 'SUBMITTED',
      deadline: daysAhead(7),
      submittedAt: daysAgo(4),
      template: TEMPLATES[2],
      assignee: assignees[3],
      submissionPayload: { auditScore: 94, nonConformities: 2 },
      files: [{ id: 'f2', slotKey: 'evidence_pack', fileName: 'QMS_evidence.zip', clientHash: 'sha256:def…', serverHash: 'sha256:def…' }],
    },
    {
      id: 'inst-demo-004',
      status: 'FLAGGED',
      deadline: daysAgo(2),
      submittedAt: daysAgo(10),
      reviewedAt: daysAgo(3),
      reviewNotes: 'Wastage rate exceeds BMRA threshold — resubmit with root-cause CAPA.',
      template: TEMPLATES[0],
      assignee: assignees[2],
      submissionPayload: { reportingPeriod: '2026-Q1', unitsCollected: 1200, wastageRate: 0.11 },
      files: [],
    },
    {
      id: 'inst-demo-005',
      status: 'APPROVED',
      deadline: daysAgo(14),
      submittedAt: daysAgo(20),
      reviewedAt: daysAgo(12),
      template: TEMPLATES[3],
      assignee: assignees[1],
      submissionPayload: { year: 2025, aggregateReports: 18 },
      files: [],
    },
    {
      id: 'inst-demo-006',
      status: 'IN_PROGRESS',
      deadline: daysAhead(14),
      template: TEMPLATES[0],
      assignee: assignees[0],
      draftPayload: { reportingPeriod: '2026-Q2', unitsCollected: null },
      files: [],
    },
    {
      id: 'inst-demo-007',
      status: 'PENDING',
      deadline: daysAhead(21),
      template: TEMPLATES[2],
      assignee: assignees[2],
      files: [],
    },
    {
      id: 'inst-demo-008',
      status: 'REJECTED',
      deadline: daysAgo(30),
      submittedAt: daysAgo(35),
      reviewedAt: daysAgo(28),
      reviewNotes: 'Incomplete hemovigilance narrative — missing imputability assessment.',
      template: TEMPLATES[1],
      assignee: assignees[3],
      submissionPayload: { incidentDate: '2026-04-01' },
      files: [],
    },
  ]
}

export const SEED_AUDIT = [
  { id: 'aud-1', action: 'INSTANCE_SUBMITTED', entityType: 'Instance', entityId: 'inst-demo-001', actor: 'compliance@nbts.gov.bw', createdAt: daysAgo(2) },
  { id: 'aud-2', action: 'INSTANCE_REVIEWED', entityType: 'Instance', entityId: 'inst-demo-004', actor: 'reviewer@bmra.gov.bw', createdAt: daysAgo(3), metadata: { status: 'FLAGGED' } },
  { id: 'aud-3', action: 'INSTANCE_APPROVED', entityType: 'Instance', entityId: 'inst-demo-005', actor: 'reviewer@bmra.gov.bw', createdAt: daysAgo(12) },
  { id: 'aud-4', action: 'FILE_UPLOADED', entityType: 'InstanceFile', entityId: 'f1', actor: 'compliance@nbts.gov.bw', createdAt: daysAgo(2) },
  { id: 'aud-5', action: 'API_KEY_USED', entityType: 'ApiKey', entityId: 'key-sentinel', actor: 'sentinel-integration', createdAt: daysAgo(0) },
]

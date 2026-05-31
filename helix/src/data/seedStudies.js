/**
 * Demo research data — institution-agnostic sponsor/site fields.
 */

export const STUDY_STATUS = ['DRAFT', 'IRB_APPROVED', 'ACTIVE', 'CLOSED']
export const CONSENT_STATUS = ['PENDING', 'SIGNED', 'WITHDRAWN']
export const SAMPLE_STATUS = [
  'REGISTERED', 'COLLECTED', 'IN_TRANSIT', 'RECEIVED_BIOBANK',
  'ALIQUOTED', 'IN_ANALYSIS', 'ARCHIVED', 'DESTROYED',
]

const sites = ['Gaborone — UB Faculty of Medicine', 'Francistown — Partner Hospital', 'Mobile — Field Site A']

function custody(sampleId, events) {
  return events.map((e, i) => ({
    id: `ce-${sampleId}-${i}`,
    sampleId,
    status: e.status,
    actorName: e.actor,
    actorRole: e.role,
    location: e.location,
    notes: e.notes ?? null,
    createdAt: e.at,
  }))
}

const participants = [
  { id: 'P-001', studyParticipantId: 'HELIX-2026-001', arm: 'Intervention', consent: 'SIGNED', consentDate: '2026-01-15', site: sites[0], enrolledAt: '2026-01-16' },
  { id: 'P-002', studyParticipantId: 'HELIX-2026-002', arm: 'Control', consent: 'SIGNED', consentDate: '2026-01-18', site: sites[0], enrolledAt: '2026-01-19' },
  { id: 'P-003', studyParticipantId: 'HELIX-2026-003', arm: 'Intervention', consent: 'SIGNED', consentDate: '2026-02-02', site: sites[1], enrolledAt: '2026-02-03' },
  { id: 'P-004', studyParticipantId: 'HELIX-2026-004', arm: 'Intervention', consent: 'PENDING', consentDate: null, site: sites[0], enrolledAt: '2026-03-10' },
  { id: 'P-005', studyParticipantId: 'HELIX-2026-005', arm: 'Control', consent: 'SIGNED', consentDate: '2026-02-20', site: sites[2], enrolledAt: '2026-02-21' },
  { id: 'P-006', studyParticipantId: 'HELIX-2026-006', arm: 'Intervention', consent: 'WITHDRAWN', consentDate: '2026-01-22', site: sites[0], enrolledAt: '2026-01-23' },
  { id: 'P-007', studyParticipantId: 'HELIX-2026-007', arm: 'Control', consent: 'SIGNED', consentDate: '2026-03-01', site: sites[1], enrolledAt: '2026-03-02' },
  { id: 'P-008', studyParticipantId: 'HELIX-2026-008', arm: 'Intervention', consent: 'SIGNED', consentDate: '2026-03-05', site: sites[0], enrolledAt: '2026-03-06' },
  { id: 'P-009', studyParticipantId: 'HELIX-2026-009', arm: 'Intervention', consent: 'SIGNED', consentDate: '2026-03-08', site: sites[2], enrolledAt: '2026-03-09' },
  { id: 'P-010', studyParticipantId: 'HELIX-2026-010', arm: 'Control', consent: 'SIGNED', consentDate: '2026-03-12', site: sites[0], enrolledAt: '2026-03-13' },
  { id: 'P-011', studyParticipantId: 'HELIX-2026-011', arm: 'Intervention', consent: 'SIGNED', consentDate: '2026-03-14', site: sites[1], enrolledAt: '2026-03-15' },
  { id: 'P-012', studyParticipantId: 'HELIX-2026-012', arm: 'Control', consent: 'SIGNED', consentDate: '2026-03-18', site: sites[0], enrolledAt: '2026-03-19' },
]

function buildSamples() {
  const rows = []
  let n = 1
  for (const p of participants.filter(x => x.consent === 'SIGNED')) {
    const count = p.id === 'P-003' ? 4 : 2
    for (let v = 0; v < count; v++) {
      const sid = `RS-2026-${String(n).padStart(4, '0')}`
      const visit = v === 0 ? 'Baseline' : `Week ${v * 4}`
      const finalStatus = n % 7 === 0 ? 'IN_ANALYSIS' : n % 5 === 0 ? 'ALIQUOTED' : 'RECEIVED_BIOBANK'
      const isAliquot = v > 0 && v % 2 === 1
      const parentId = isAliquot ? `RS-2026-${String(n - 1).padStart(4, '0')}` : null
      rows.push({
        id: sid,
        participantId: p.id,
        studyParticipantId: p.studyParticipantId,
        specimenType: isAliquot ? 'Plasma aliquot' : 'Whole blood',
        visit,
        status: finalStatus,
        parentSampleId: parentId,
        bloodAssetId: null,
        site: p.site,
        receiptQC: {
          acceptable: n !== 3,
          coldChainPreserved: n !== 3,
          tempRange: n === 3 ? '8.2°C — excursion' : '4.1°C',
          packagingIntact: n !== 3,
          receivedAt: '2026-03-01T13:00:00Z',
        },
        custodyEvents: custody(sid, [
          { status: 'REGISTERED', actor: 'T. Molefe', role: 'RESEARCH_COORDINATOR', location: p.site, at: '2026-03-01T08:00:00Z' },
          { status: 'COLLECTED', actor: 'K. Phiri', role: 'RESEARCH', location: p.site, at: '2026-03-01T09:15:00Z', notes: 'Venipuncture complete' },
          { status: 'IN_TRANSIT', actor: 'Courier Unit 3', role: 'TRANSIT', location: 'In transit — 2–6°C', at: '2026-03-01T11:00:00Z' },
          { status: 'RECEIVED_BIOBANK', actor: 'L. Kgosana', role: 'RESEARCH', location: 'National Biobank — Gaborone', at: '2026-03-01T14:30:00Z' },
          ...(finalStatus === 'ALIQUOTED' || finalStatus === 'IN_ANALYSIS' ? [
            { status: 'ALIQUOTED', actor: 'L. Kgosana', role: 'RESEARCH', location: 'Biobank Freezer B2', at: '2026-03-02T09:00:00Z' },
          ] : []),
          ...(finalStatus === 'IN_ANALYSIS' ? [
            { status: 'IN_ANALYSIS', actor: 'Analysis Lab', role: 'RESEARCH', location: 'Molecular Lab — Block C', at: '2026-03-05T10:00:00Z' },
          ] : []),
        ]),
      })
      n++
    }
  }
  return rows
}

export const DEMO_STUDIES = [
  {
    id: 'study-001',
    code: 'HELIX-BW-2026-001',
    title: 'Haemoglobinopathies & Blood Biomarkers — Prospective Cohort',
    sponsor: 'National Health Research Institution (pilot sponsor)',
    principalInvestigator: 'Dr. T. Nakedi',
    status: 'ACTIVE',
    protocolVersion: 'v2.1',
    ethicsRef: 'UB-IRB-2025-1847',
    ethicsExpiry: '2027-06-30',
    sites,
    participants,
    samples: buildSamples(),
    worksheets: [
      { id: 'WS-001', name: 'Batch 2026-W12 — Biomarker panel', status: 'VERIFIED', qcStatus: 'PASS', sampleCount: 12, priority: 'ROUTINE', verifiedBy: 'Lab Manager' },
      { id: 'WS-002', name: 'Batch 2026-W12 — Confirmatory reflex', status: 'HELD', qcStatus: 'HOLD', sampleCount: 6, priority: 'URGENT', qcNote: 'Westgard 2₂s — controls repeat required before release' },
    ],
    deviations: [
      { id: 'dev-1', description: 'Visit window exceeded by 3 days — P-003 Week 4', reportedAt: '2026-03-22', severity: 'MINOR' },
    ],
    actionLog: [
      { action: 'Study activated', userName: 'Dr. T. Nakedi', userRole: 'RESEARCH_PI', facility: sites[0], createdAt: '2026-01-10T10:00:00Z' },
      { action: 'IRB approval recorded', userName: 'Ethics Secretariat', userRole: 'ETHICS_READ', facility: 'IRB Office', createdAt: '2026-01-08T14:00:00Z' },
      { action: 'Participant HELIX-2026-006 withdrawn', userName: 'Study Coordinator', userRole: 'RESEARCH_COORDINATOR', facility: sites[0], createdAt: '2026-02-01T09:30:00Z' },
      { action: 'Specimen RS-2026-0001 received at biobank', userName: 'L. Kgosana', userRole: 'RESEARCH', facility: 'National Biobank', createdAt: '2026-03-01T14:30:00Z' },
      { action: 'FIELD_CHANGED', userName: 'L. Kgosana', userRole: 'RESEARCH', facility: 'Biobank', field: 'receiptQC.acceptable', oldValue: 'pending', newValue: 'true', reason: 'Cold chain verified on receipt', createdAt: '2026-03-01T14:31:00Z' },
      { action: 'Worksheet WS-002 placed on QC hold', userName: 'Lab Manager', userRole: 'RESEARCH_PI', facility: 'Research Lab', createdAt: '2026-03-02T11:00:00Z' },
    ],
  },
  {
    id: 'study-002',
    code: 'HELIX-BW-2026-002',
    title: 'Plasma Therapy Feasibility — Phase I Observational',
    sponsor: 'International Research Partnership (anonymous pilot)',
    principalInvestigator: 'Prof. M. Dube',
    status: 'IRB_APPROVED',
    protocolVersion: 'v1.0',
    ethicsRef: 'NHSRC-ETH-2026-042',
    ethicsExpiry: '2026-12-31',
    sites: [sites[0]],
    participants: [],
    samples: [],
    deviations: [],
    actionLog: [
      { action: 'Study draft created', userName: 'Prof. M. Dube', userRole: 'RESEARCH_PI', facility: sites[0], createdAt: '2026-04-01T08:00:00Z' },
      { action: 'IRB approval recorded', userName: 'NHSRC Review', userRole: 'ETHICS_READ', facility: 'NHSRC', createdAt: '2026-04-15T16:00:00Z' },
    ],
  },
]

export function getStudyById(id) {
  return DEMO_STUDIES.find(s => s.id === id) ?? null
}

export function buildIrbExport(study) {
  const enrolled = study.participants.length
  const consented = study.participants.filter(p => p.consent === 'SIGNED').length
  const withdrawn = study.participants.filter(p => p.consent === 'WITHDRAWN').length
  const pending = study.participants.filter(p => p.consent === 'PENDING').length
  const samples = study.samples.length
  const inAnalysis = study.samples.filter(s => s.status === 'IN_ANALYSIS').length
  const custodyGaps = study.samples.filter(s => s.custodyEvents.length < 4).length
  const receiptRejected = study.samples.filter(s => s.receiptQC && !s.receiptQC.acceptable).length
  const worksheetsHeld = (study.worksheets ?? []).filter(w => w.qcStatus === 'HOLD').length

  const participantRows = study.participants.map(p => ({
    studyParticipantId: p.studyParticipantId,
    arm: p.arm,
    consent: p.consent,
    consentDate: p.consentDate ?? '',
    site: p.site,
    enrolledAt: p.enrolledAt,
  }))

  const sampleRows = study.samples.map(s => ({
    sampleId: s.id,
    participantId: s.studyParticipantId,
    visit: s.visit,
    specimenType: s.specimenType,
    status: s.status,
    lastCustody: s.custodyEvents[s.custodyEvents.length - 1]?.status ?? '',
    eventCount: s.custodyEvents.length,
  }))

  return {
    summary: {
      studyCode: study.code,
      title: study.title,
      status: study.status,
      generatedAt: new Date().toISOString(),
      enrolled,
      consented,
      withdrawn,
      pendingConsent: pending,
      specimens: samples,
      inAnalysis,
      protocolDeviations: study.deviations.length,
      custodyGaps,
      receiptRejected,
      worksheetsHeld,
    },
    participantRows,
    sampleRows,
    deviations: study.deviations,
    actionLog: study.actionLog,
  }
}

export function toCsv(rows, headers) {
  const escape = (v) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map(h => escape(row[h])).join(','))
  }
  return lines.join('\n')
}

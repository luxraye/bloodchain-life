import { CONDITION_LABEL, toCsv, openCareGaps, missedTransfusionPatients } from '../data/seedRegistry.js'

export function buildPatientReport(patients) {
  const rows = patients.map((p) => ({
    registryId: p.registryId,
    name: p.name,
    condition: CONDITION_LABEL[p.condition],
    site: p.site,
    nextReview: p.nextReview,
    openGaps: p.careGaps.filter((g) => g.status === 'OPEN').length,
    prophylaxis: p.carePlan?.prophylaxis ?? '',
  }))
  return {
    filename: 'chronicle-patient-report.csv',
    csv: toCsv(rows, ['registryId', 'name', 'condition', 'site', 'nextReview', 'openGaps', 'prophylaxis']),
    summary: `Patient report — ${rows.length} enrollees`,
  }
}

export function buildExceptionReport(exceptions) {
  const open = exceptions.filter((e) => !['RESOLVED', 'CLOSED'].includes(e.status))
  const rows = open.map((e) => ({
    id: e.id,
    registryId: e.registryId,
    patientName: e.patientName,
    type: e.type,
    severity: e.severity,
    status: e.status,
    summary: e.summary,
  }))
  return {
    filename: 'chronicle-exception-report.csv',
    csv: toCsv(rows, ['id', 'registryId', 'patientName', 'type', 'severity', 'status', 'summary']),
    summary: `Exception report — ${rows.length} open items`,
  }
}

export function buildProgressReport(patients) {
  const bySite = {}
  patients.forEach((p) => {
    const site = p.site.split('·')[0].trim()
    if (!bySite[site]) bySite[site] = { site, enrolled: 0, reviewsDue: 0, openGaps: 0 }
    bySite[site].enrolled += 1
    if (new Date(p.nextReview) <= new Date(Date.now() + 14 * 86400000)) bySite[site].reviewsDue += 1
    bySite[site].openGaps += p.careGaps.filter((g) => g.status === 'OPEN').length
  })
  const rows = Object.values(bySite)
  return {
    filename: 'chronicle-progress-report.csv',
    csv: toCsv(rows, ['site', 'enrolled', 'reviewsDue', 'openGaps']),
    summary: `Progress report — ${rows.length} sites`,
  }
}

export function buildCareGapReport(patients) {
  const gaps = openCareGaps(patients)
  const rows = gaps.map((g) => ({
    registryId: g.registryId,
    patientName: g.patientName,
    site: g.site,
    gapType: g.type,
    severity: g.severity,
    summary: g.summary,
  }))
  return {
    filename: 'chronicle-care-gap-report.csv',
    csv: toCsv(rows, ['registryId', 'patientName', 'site', 'gapType', 'severity', 'summary']),
    summary: `Care-gap report — ${rows.length} open gaps`,
  }
}

/**
 * Funder-audit export tailored for international funders (e.g. BIPAI / PEPFAR).
 * Anonymised programme-adherence aggregates — no patient names — suitable for
 * grant reporting on the Baylor paediatric sickle cell transfusion programme.
 */
export function buildFunderAuditReport(patients) {
  const sickle = patients.filter((p) => p.condition === 'SICKLE_CELL')
  const paediatric = sickle.filter((p) => p.paediatric)
  const onProgramme = paediatric.filter((p) => p.transfusionIntervalWeeks)
  const missed = missedTransfusionPatients(paediatric)
  const adherence = onProgramme.length
    ? Math.round(((onProgramme.length - missed.length) / onProgramme.length) * 100)
    : 0
  const rows = [
    { metric: 'Programme', value: 'Baylor Children\u2019s CCE — paediatric sickle cell' },
    { metric: 'Reporting period end', value: new Date().toISOString().slice(0, 10) },
    { metric: 'Paediatric sickle cell enrolled', value: paediatric.length },
    { metric: 'On chronic transfusion programme', value: onProgramme.length },
    { metric: 'Scheduled-transfusion adherence (%)', value: adherence },
    { metric: 'Missed transfusions (open)', value: missed.length },
    { metric: 'Open care gaps (all types)', value: openCareGaps(paediatric).length },
    { metric: 'De-identified', value: 'YES — no patient identifiers in this export' },
    { metric: 'Funder format', value: 'BIPAI / PEPFAR programme indicators' },
  ]
  return {
    filename: 'chronicle-funder-audit-BIPAI.csv',
    csv: toCsv(rows, ['metric', 'value']),
    summary: `Funder audit (BIPAI) — ${paediatric.length} paediatric patients · ${adherence}% transfusion adherence`,
  }
}

export function buildPopulationReport(patients) {
  const byCondition = {}
  patients.forEach((p) => {
    const label = CONDITION_LABEL[p.condition]
    if (!byCondition[label]) byCondition[label] = { condition: label, count: 0, withSdoh: 0 }
    byCondition[label].count += 1
    if (p.sdohFlags?.length) byCondition[label].withSdoh += 1
  })
  const rows = Object.values(byCondition).map((r) => ({
    ...r,
    anonymised: 'YES',
    note: 'No patient names in population export',
  }))
  return {
    filename: 'chronicle-population-report.csv',
    csv: toCsv(rows, ['condition', 'count', 'withSdoh', 'anonymised', 'note']),
    summary: `Population report — ${patients.length} total (anonymised aggregates for BPOMAS/MoH)`,
  }
}

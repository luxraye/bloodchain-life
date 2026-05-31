import { CONDITION_LABEL, toCsv } from '../data/seedRegistry.js'

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

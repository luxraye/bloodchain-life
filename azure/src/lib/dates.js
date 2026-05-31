/** Copy when there is no on-record donation date to compute the next eligible calendar day */
export const NEXT_ELIGIBLE_RULE =
  'Every 3 months from your last donation'

export const NEXT_ELIGIBLE_RULE_DETAIL =
  'Your next eligible date will appear here after your first donation is recorded.'

export function parseValidDate(value) {
  if (value == null || value === '') return null
  const d = value instanceof Date ? new Date(value.getTime()) : new Date(value)
  return Number.isFinite(d.getTime()) ? d : null
}

export function addCalendarMonths(value, months) {
  const d = parseValidDate(value)
  if (!d) return null
  const next = new Date(d)
  next.setMonth(next.getMonth() + months)
  return Number.isFinite(next.getTime()) ? next : null
}

export function formatLocalDate(value, options) {
  const d = parseValidDate(value)
  if (!d) return null
  return d.toLocaleDateString(undefined, options)
}

export function compareCollectionDateDesc(a, b) {
  const da = parseValidDate(a?.collectionDate)?.getTime() ?? Number.NEGATIVE_INFINITY
  const db = parseValidDate(b?.collectionDate)?.getTime() ?? Number.NEGATIVE_INFINITY
  return db - da
}

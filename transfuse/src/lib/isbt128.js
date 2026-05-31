/** Format a unit ID to ISBT-128 display style */
export function formatIsbt128(id) {
  if (!id) return ''
  const clean = String(id).replace(/[^A-Z0-9a-z-]/g, '').toUpperCase()
  return clean.length > 12 ? `${clean.slice(0, 6)}-${clean.slice(6, 12)}-${clean.slice(12)}` : clean
}

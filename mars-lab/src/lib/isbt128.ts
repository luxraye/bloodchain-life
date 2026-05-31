/**
 * Format an asset ID as an ISBT-128 style display string.
 * Real ISBT-128 is a 13-char DIN; we approximate for visual consistency.
 * Input:  "unit_998877" or any string
 * Output: "=W0000 26 998877" style block
 */
export function formatIsbt128(id: string): string {
  const digits = id.replace(/\D/g, '').padStart(6, '0').slice(-6)
  const year = new Date().getFullYear().toString().slice(-2)
  return `=W0000 ${year} ${digits}`
}

/**
 * Returns the raw numeric portion for barcode rendering.
 */
export function isbt128Digits(id: string): string {
  return id.replace(/\D/g, '').padStart(12, '0').slice(-12)
}

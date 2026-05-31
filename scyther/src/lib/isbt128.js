/**
 * Format an asset ID as an ISBT-128 style display string.
 * Real ISBT-128 is a 13-char DIN; we approximate for visual consistency.
 * Input:  "unit_998877" or any string
 * Output: "=W0000 26 998877" style block
 *
 * @param {string} id
 * @returns {string}
 */
export function formatIsbt128(id) {
    const digits = id.replace(/\D/g, '').padStart(6, '0').slice(-6);
    const year = new Date().getFullYear().toString().slice(-2);
    return `=W0000 ${year} ${digits}`;
}

/**
 * Returns the raw numeric portion for barcode rendering.
 *
 * @param {string} id
 * @returns {string}
 */
export function isbt128Digits(id) {
    return id.replace(/\D/g, '').padStart(12, '0').slice(-12);
}

/** Trigger a client-side file download from in-memory content. */
export function downloadFile(filename, content, mime = 'text/csv') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Download a report pack ({ filename, csv }) produced by reportBuilders. */
export function downloadReport(pack) {
  if (!pack) return
  downloadFile(pack.filename, pack.csv)
}

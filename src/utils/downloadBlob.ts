function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** Ej: ventas_2026-06-08_14-30-45.xlsx */
export function buildExportFilename(prefix: 'ventas' | 'compras'): string {
  const now = new Date()
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  return `${prefix}_${date}_${time}.xlsx`
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function formatCurrency(value: number | string | undefined): string {
  const num = Number(value ?? 0)
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatDateTime(value: string | undefined): string {
  if (!value) return '-'
  return new Date(value).toLocaleString('es-CO')
}

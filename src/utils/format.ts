export function formatCurrency(value: number | string | undefined): string {
  const num = Number(value ?? 0)
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/** Número simple con 2 decimales, sin símbolo de moneda */
export function formatPrice(value: number | string | undefined): string {
  const num = Number(value ?? 0)
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatNumber(value: number | string | undefined): string {
  const num = Number(value ?? 0)
  return new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 0,
  }).format(num)
}

export function roundPrice(value: number | string | undefined): number {
  return Number(Number(value ?? 0).toFixed(2))
}

export function formatDateTime(value: string | undefined): string {
  if (!value) return '-'
  return new Date(value).toLocaleString('es-PE')
}

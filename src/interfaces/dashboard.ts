export interface SupplierPurchaseStat {
  supplier: string
  total: number
}

export interface TopProductStat {
  product: string
  quantity: number
}

export interface LowStockStat {
  product: string
  stock: number
  minStock: number
}

export interface SalesTrendStat {
  day: number
  total: number
}

export interface InventorySummaryStat {
  product: string
  entries: number
  exits: number
  balance: number
}

export interface ReplenishmentAlertStat {
  product: string
  stock: number
  minStock: number
  deficit: number
  suggestedReorder: number
  priority: 'CRITICAL' | 'LOW'
}

export interface PeriodTrendStat {
  day: number
  sales: number
  purchases: number
}

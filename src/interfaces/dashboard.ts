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

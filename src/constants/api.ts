export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '/api'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  USERS: '/users',
  PRODUCTS: '/products',
  PRODUCTS_LOW_STOCK: '/products/low-stock',
  CATEGORIES: '/categories',
  CUSTOMERS: '/customers',
  SUPPLIERS: '/suppliers',
  SALES: '/sales',
  PURCHASES: '/purchases',
  INVENTORY: {
    ADJUSTMENT_POSITIVE: '/inventory/adjustment/positive',
    ADJUSTMENT_NEGATIVE: '/inventory/adjustment/negative',
    HISTORY: '/inventory/history',
    HISTORY_BY_PRODUCT: (productId: number) => `/inventory/history/${productId}`,
  },
  DASHBOARD: {
    SALES_DAY: '/dashboard/sales/day',
    SALES_MONTH: '/dashboard/sales/month',
    PURCHASES_SUPPLIERS: '/dashboard/purchases/suppliers',
    PRODUCTS_TOP: '/dashboard/products/top',
    STOCK_LOW: '/dashboard/stock/low',
    SALES_TREND: '/dashboard/sales/trend',
  },
  EXPORT: {
    SALES: '/export/sales',
    PURCHASES: '/export/purchases',
  },
} as const

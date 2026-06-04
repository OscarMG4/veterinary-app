import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type {
  LowStockStat,
  SupplierPurchaseStat,
  TopProductStat,
} from '../interfaces/dashboard'

export const dashboardService = {
  salesDay: () =>
    apiClient.get<number>(API_ENDPOINTS.DASHBOARD.SALES_DAY),
  salesMonth: (month: number, year: number) =>
    apiClient.get<number>(API_ENDPOINTS.DASHBOARD.SALES_MONTH, {
      params: { month, year },
    }),
  purchasesBySupplier: () =>
    apiClient.get<SupplierPurchaseStat[]>(
      API_ENDPOINTS.DASHBOARD.PURCHASES_SUPPLIERS,
    ),
  topProducts: () =>
    apiClient.get<TopProductStat[]>(API_ENDPOINTS.DASHBOARD.PRODUCTS_TOP),
  lowStock: () =>
    apiClient.get<LowStockStat[]>(API_ENDPOINTS.DASHBOARD.STOCK_LOW),
}

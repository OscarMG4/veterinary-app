import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type {
  InventorySummaryStat,
  LowStockStat,
  ReplenishmentAlertStat,
  SalesTrendStat,
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
  purchasesMonth: (month: number, year: number) =>
    apiClient.get<number>(API_ENDPOINTS.DASHBOARD.PURCHASES_MONTH, {
      params: { month, year },
    }),
  salesTrend: (month: number, year: number) =>
    apiClient.get<SalesTrendStat[]>(API_ENDPOINTS.DASHBOARD.SALES_TREND, {
      params: { month, year },
    }),
  purchasesTrend: (month: number, year: number) =>
    apiClient.get<SalesTrendStat[]>(API_ENDPOINTS.DASHBOARD.PURCHASES_TREND, {
      params: { month, year },
    }),
  purchasesBySupplier: () =>
    apiClient.get<SupplierPurchaseStat[]>(
      API_ENDPOINTS.DASHBOARD.PURCHASES_SUPPLIERS,
    ),
  purchasesBySupplierInPeriod: (month: number, year: number) =>
    apiClient.get<SupplierPurchaseStat[]>(
      API_ENDPOINTS.DASHBOARD.PURCHASES_SUPPLIERS_PERIOD,
      { params: { month, year } },
    ),
  topProducts: () =>
    apiClient.get<TopProductStat[]>(API_ENDPOINTS.DASHBOARD.PRODUCTS_TOP),
  topProductsByPeriod: (month: number, year: number, limit = 5) =>
    apiClient.get<TopProductStat[]>(
      API_ENDPOINTS.DASHBOARD.PRODUCTS_TOP_PERIOD,
      { params: { month, year, limit } },
    ),
  lowRotationProducts: (month: number, year: number, limit = 5) =>
    apiClient.get<TopProductStat[]>(
      API_ENDPOINTS.DASHBOARD.PRODUCTS_LOW_ROTATION,
      { params: { month, year, limit } },
    ),
  totalProducts: () =>
    apiClient.get<number>(API_ENDPOINTS.DASHBOARD.PRODUCTS_TOTAL),
  totalStock: () =>
    apiClient.get<number>(API_ENDPOINTS.DASHBOARD.STOCK_TOTAL),
  inventoryEntries: (month: number, year: number) =>
    apiClient.get<number>(API_ENDPOINTS.DASHBOARD.INVENTORY_ENTRIES, {
      params: { month, year },
    }),
  inventoryExits: (month: number, year: number) =>
    apiClient.get<number>(API_ENDPOINTS.DASHBOARD.INVENTORY_EXITS, {
      params: { month, year },
    }),
  inventorySummary: () =>
    apiClient.get<InventorySummaryStat[]>(
      API_ENDPOINTS.DASHBOARD.INVENTORY_SUMMARY,
    ),
  replenishmentAlerts: () =>
    apiClient.get<ReplenishmentAlertStat[]>(
      API_ENDPOINTS.DASHBOARD.INVENTORY_REPLENISHMENT,
    ),
  lowStock: () =>
    apiClient.get<LowStockStat[]>(API_ENDPOINTS.DASHBOARD.STOCK_LOW),
}

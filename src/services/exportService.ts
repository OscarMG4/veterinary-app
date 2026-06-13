import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'

export const exportService = {
  downloadSales: () =>
    apiClient.get<Blob>(API_ENDPOINTS.EXPORT.SALES, {
      responseType: 'blob',
    }),
  downloadPurchases: () =>
    apiClient.get<Blob>(API_ENDPOINTS.EXPORT.PURCHASES, {
      responseType: 'blob',
    }),
  downloadInventoryEntries: () =>
    apiClient.get<Blob>(API_ENDPOINTS.EXPORT.INVENTORY_ENTRIES, {
      responseType: 'blob',
    }),
  downloadInventoryExits: () =>
    apiClient.get<Blob>(API_ENDPOINTS.EXPORT.INVENTORY_EXITS, {
      responseType: 'blob',
    }),
  downloadInventoryBalances: () =>
    apiClient.get<Blob>(API_ENDPOINTS.EXPORT.INVENTORY_BALANCES, {
      responseType: 'blob',
    }),
  downloadProductRotation: () =>
    apiClient.get<Blob>(API_ENDPOINTS.EXPORT.INVENTORY_ROTATION, {
      responseType: 'blob',
    }),
}

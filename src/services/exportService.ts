import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'

export const exportService = {
  downloadSales: () =>
    apiClient.get<Blob>(API_ENDPOINTS.EXPORT.SALES, {
      responseType: 'blob',
    }),
}

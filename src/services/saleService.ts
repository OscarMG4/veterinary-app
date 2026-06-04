import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { SaleRequest, SaleResponse } from '../interfaces/sale'

export const saleService = {
  create: (data: SaleRequest) =>
    apiClient.post<SaleResponse>(API_ENDPOINTS.SALES, data),
}

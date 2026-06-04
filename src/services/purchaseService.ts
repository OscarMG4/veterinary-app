import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { PurchaseRequest, PurchaseResponse } from '../interfaces/purchase'

export const purchaseService = {
  create: (data: PurchaseRequest) =>
    apiClient.post<PurchaseResponse>(API_ENDPOINTS.PURCHASES, data),
}

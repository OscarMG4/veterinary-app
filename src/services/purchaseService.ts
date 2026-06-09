import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type {
  PurchaseDetailResponse,
  PurchaseListResponse,
  PurchaseRequest,
  PurchaseResponse,
} from '../interfaces/purchase'

export const purchaseService = {
  getAll: () => apiClient.get<PurchaseListResponse[]>(API_ENDPOINTS.PURCHASES),
  getById: (id: number) =>
    apiClient.get<PurchaseDetailResponse>(`${API_ENDPOINTS.PURCHASES}/${id}`),
  create: (data: PurchaseRequest) =>
    apiClient.post<PurchaseResponse>(API_ENDPOINTS.PURCHASES, data),
  update: (id: number, data: PurchaseRequest) =>
    apiClient.put<PurchaseResponse>(`${API_ENDPOINTS.PURCHASES}/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`${API_ENDPOINTS.PURCHASES}/${id}`),
}

import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type {
  SaleDetailResponse,
  SaleListResponse,
  SaleRequest,
  SaleResponse,
} from '../interfaces/sale'

export const saleService = {
  getAll: () => apiClient.get<SaleListResponse[]>(API_ENDPOINTS.SALES),
  getById: (id: number) =>
    apiClient.get<SaleDetailResponse>(`${API_ENDPOINTS.SALES}/${id}`),
  create: (data: SaleRequest) =>
    apiClient.post<SaleResponse>(API_ENDPOINTS.SALES, data),
  update: (id: number, data: SaleRequest) =>
    apiClient.put<SaleResponse>(`${API_ENDPOINTS.SALES}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.SALES}/${id}`),
}

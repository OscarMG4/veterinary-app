import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { SupplierRequest, SupplierResponse } from '../interfaces/supplier'

export const supplierService = {
  getAll: () => apiClient.get<SupplierResponse[]>(API_ENDPOINTS.SUPPLIERS),
  getById: (id: number) =>
    apiClient.get<SupplierResponse>(`${API_ENDPOINTS.SUPPLIERS}/${id}`),
  create: (data: SupplierRequest) =>
    apiClient.post<SupplierResponse>(API_ENDPOINTS.SUPPLIERS, data),
  update: (id: number, data: SupplierRequest) =>
    apiClient.put<SupplierResponse>(`${API_ENDPOINTS.SUPPLIERS}/${id}`, data),
  remove: (id: number) =>
    apiClient.delete(`${API_ENDPOINTS.SUPPLIERS}/${id}`),
}

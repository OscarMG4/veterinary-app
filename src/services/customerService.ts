import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { CustomerRequest, CustomerResponse } from '../interfaces/customer'

export const customerService = {
  getAll: () => apiClient.get<CustomerResponse[]>(API_ENDPOINTS.CUSTOMERS),
  getById: (id: number) =>
    apiClient.get<CustomerResponse>(`${API_ENDPOINTS.CUSTOMERS}/${id}`),
  create: (data: CustomerRequest) =>
    apiClient.post<CustomerResponse>(API_ENDPOINTS.CUSTOMERS, data),
  update: (id: number, data: CustomerRequest) =>
    apiClient.put<CustomerResponse>(`${API_ENDPOINTS.CUSTOMERS}/${id}`, data),
  remove: (id: number) =>
    apiClient.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`),
}

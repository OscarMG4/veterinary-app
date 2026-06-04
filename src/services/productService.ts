import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { ProductRequest, ProductResponse } from '../interfaces/product'

export const productService = {
  getAll: () => apiClient.get<ProductResponse[]>(API_ENDPOINTS.PRODUCTS),
  getLowStock: () =>
    apiClient.get<ProductResponse[]>(API_ENDPOINTS.PRODUCTS_LOW_STOCK),
  getById: (id: number) =>
    apiClient.get<ProductResponse>(`${API_ENDPOINTS.PRODUCTS}/${id}`),
  create: (data: ProductRequest) =>
    apiClient.post<ProductResponse>(API_ENDPOINTS.PRODUCTS, data),
  update: (id: number, data: ProductRequest) =>
    apiClient.put<ProductResponse>(`${API_ENDPOINTS.PRODUCTS}/${id}`, data),
  remove: (id: number) =>
    apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`),
}

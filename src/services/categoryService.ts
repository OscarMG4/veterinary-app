import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { CategoryRequest, CategoryResponse } from '../interfaces/category'

export const categoryService = {
  getAll: () => apiClient.get<CategoryResponse[]>(API_ENDPOINTS.CATEGORIES),
  getById: (id: number) =>
    apiClient.get<CategoryResponse>(`${API_ENDPOINTS.CATEGORIES}/${id}`),
  create: (data: CategoryRequest) =>
    apiClient.post<CategoryResponse>(API_ENDPOINTS.CATEGORIES, data),
  update: (id: number, data: CategoryRequest) =>
    apiClient.put<CategoryResponse>(
      `${API_ENDPOINTS.CATEGORIES}/${id}`,
      data,
    ),
  remove: (id: number) =>
    apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`),
}

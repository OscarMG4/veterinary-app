import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { UserRequest, UserResponse } from '../interfaces/user'

export const userService = {
  getAll: () => apiClient.get<UserResponse[]>(API_ENDPOINTS.USERS),
  getById: (id: number) =>
    apiClient.get<UserResponse>(`${API_ENDPOINTS.USERS}/${id}`),
  create: (data: UserRequest) =>
    apiClient.post<UserResponse>(API_ENDPOINTS.USERS, data),
  update: (id: number, data: UserRequest) =>
    apiClient.put<UserResponse>(`${API_ENDPOINTS.USERS}/${id}`, data),
  remove: (id: number) => apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`),
}

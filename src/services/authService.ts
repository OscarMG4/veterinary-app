import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type { LoginRequest, LoginResponse } from '../interfaces/auth'

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data),

  me: () => apiClient.get<string>(API_ENDPOINTS.AUTH.ME),
}

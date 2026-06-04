export type UserRole = 'ADMIN' | 'STAFF'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  role: UserRole
}

export interface AuthState {
  token: string | null
  role: UserRole | null
  username: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

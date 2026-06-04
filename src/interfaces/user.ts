import type { UserRole } from './auth'

export interface UserRequest {
  username: string
  email: string
  password?: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface UserResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  active: boolean
}

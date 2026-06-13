import type { UserRole } from '../interfaces/auth'
import { ROUTES } from '../constants/routes'

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN'
}

export function isStaff(role: UserRole | null | undefined): boolean {
  return role === 'STAFF'
}

export function canManageUsers(role: UserRole | null | undefined): boolean {
  return isAdmin(role)
}

export function canManageCategories(role: UserRole | null | undefined): boolean {
  return isAdmin(role)
}

export function canDeleteRecords(role: UserRole | null | undefined): boolean {
  return isAdmin(role)
}

export function canAdjustInventory(role: UserRole | null | undefined): boolean {
  return isAdmin(role)
}

export function canExport(role: UserRole | null | undefined): boolean {
  return isAdmin(role)
}

export function canAccessDashboard(role: UserRole | null | undefined): boolean {
  return isAdmin(role)
}

export function canRegisterSales(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN' || role === 'STAFF'
}

export function getHomeRoute(role: UserRole | null | undefined): string {
  return isStaff(role) ? ROUTES.SALES_REGISTER : ROUTES.DASHBOARD
}

import type { UserRole } from '../interfaces/auth'

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN'
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

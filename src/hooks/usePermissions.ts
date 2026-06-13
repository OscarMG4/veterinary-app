import { useAuth } from './useAuth'
import {
  canAccessDashboard,
  canAdjustInventory,
  canDeleteRecords,
  canExport,
  canManageCategories,
  canManageUsers,
  canRegisterSales,
  getHomeRoute,
  isAdmin,
  isStaff,
} from '../utils/permissions'

export function usePermissions() {
  const { role } = useAuth()

  return {
    isAdmin: isAdmin(role),
    isStaff: isStaff(role),
    canManageUsers: canManageUsers(role),
    canManageCategories: canManageCategories(role),
    canDelete: canDeleteRecords(role),
    canAdjustInventory: canAdjustInventory(role),
    canExport: canExport(role),
    canAccessDashboard: canAccessDashboard(role),
    canRegisterSales: canRegisterSales(role),
    homeRoute: getHomeRoute(role),
  }
}

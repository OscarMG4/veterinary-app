import { Navigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { ROUTES } from '../constants/routes'
import { usePermissions } from '../hooks/usePermissions'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../interfaces/auth'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth()
  const { homeRoute } = usePermissions()

  if (isLoading) {
    return (
      <div className="app-loading">
        <Spin size="large" tip="Cargando sesión..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to={homeRoute} replace />
  }

  return <Outlet />
}

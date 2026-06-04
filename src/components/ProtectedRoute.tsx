import { Navigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../interfaces/auth'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth()

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
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}

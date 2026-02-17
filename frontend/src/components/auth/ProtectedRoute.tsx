import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../utils/auth'
import { ROUTES } from '../../utils/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Wraps routes that require authentication.
 * Frontend-only: redirects to login if no token in localStorage.
 * When backend is ready, 401 from API will also trigger redirect (handled in api.ts).
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}

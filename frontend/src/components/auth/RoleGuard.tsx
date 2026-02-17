import { Navigate } from 'react-router-dom'
import { getRole } from '../../utils/auth'
import { ROLES, ROUTES } from '../../utils/constants'
import type { Role } from '../../utils/constants'

interface RoleGuardProps {
  children: React.ReactNode
  /** Only these roles can access. Default: admin only. */
  allowedRoles?: Role[]
  /** Where to redirect when role is not allowed. */
  fallbackTo?: string
}

/**
 * Renders children only if the current user's role is in allowedRoles.
 * Otherwise redirects to fallbackTo (default: dashboard).
 */
export function RoleGuard({
  children,
  allowedRoles = [ROLES.ADMIN],
  fallbackTo = ROUTES.DASHBOARD,
}: RoleGuardProps) {
  const role = getRole()

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallbackTo} replace /> 
  }

  return <>{children}</>
}

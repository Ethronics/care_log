import { ROUTES, ROLES, type Role } from './constants'

export interface NavItem {
  to: string
  label: string
  /** Roles that can see this item. If empty, all authenticated users see it. */
  roles: Role[]
}

export const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.ROTA, label: 'Rota', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.STAFF, label: 'Staff', roles: [ROLES.ADMIN] },
  { to: ROUTES.SERVICE_USERS, label: 'Service users', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.CARE_LOGS, label: 'Care logs', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.ABSENCES, label: 'Leave & absence', roles: [ROLES.ADMIN, ROLES.STAFF] },
]

export function getNavItemsForRole(role: Role | null): { to: string; label: string }[] {
  if (!role) return []
  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map(({ to, label }) => ({ to, label }))
}

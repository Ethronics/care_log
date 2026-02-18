import { ROUTES, ROLES, type Role } from './constants'

export type NavIconName =
  | 'dashboard'
  | 'rota'
  | 'staff'
  | 'serviceUsers'
  | 'careLogs'
  | 'absences'
  | 'profile'

export interface NavItem {
  to: string
  label: string
  icon: NavIconName
  /** Roles that can see this item. If empty, all authenticated users see it. */
  roles: Role[]
}

export const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'dashboard', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.ROTA, label: 'Rota', icon: 'rota', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.STAFF, label: 'Staff', icon: 'staff', roles: [ROLES.ADMIN] },
  { to: ROUTES.SERVICE_USERS, label: 'Service users', icon: 'serviceUsers', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.CARE_LOGS, label: 'Care logs', icon: 'careLogs', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { to: ROUTES.ABSENCES, label: 'Leave & absence', icon: 'absences', roles: [ROLES.ADMIN, ROLES.STAFF] },
]

export const PROFILE_NAV_ITEM: NavItem = {
  to: ROUTES.PROFILE,
  label: 'Profile',
  icon: 'profile',
  roles: [ROLES.ADMIN, ROLES.STAFF],
}

export function getNavItemsForRole(role: Role | null): { to: string; label: string; icon: NavIconName }[] {
  if (!role) return []
  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map(({ to, label, icon }) => ({ to, label, icon }))
}

export function getProfileNavItem(role: Role | null): { to: string; label: string; icon: NavIconName } | null {
  if (!role || !PROFILE_NAV_ITEM.roles.includes(role)) return null
  const { to, label, icon } = PROFILE_NAV_ITEM
  return { to, label, icon }
}

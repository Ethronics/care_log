// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ROTA: '/rota',
  STAFF: '/staff',
  SERVICE_USERS: '/service-users',
  CARE_LOGS: '/care-logs',
  ABSENCES: '/absences',
  PROFILE: '/profile',
} as const

export const ROUTES_PROFILE = {
  VIEW: '/profile',
  EDIT: '/profile/edit',
} as const

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'care_log_theme',
  DEMO_DATA: 'care_log_demo_data',
  SIDEBAR_COLLAPSED: 'care_log_sidebar_collapsed',
} as const

export const ROUTES_STAFF = {
  LIST: '/staff',
  NEW: '/staff/new',
  EDIT: (id: string) => `/staff/${id}/edit`,
} as const

export const ROUTES_SERVICE_USERS = {
  LIST: '/service-users',
  NEW: '/service-users/new',
  EDIT: (id: string) => `/service-users/${id}/edit`,
  DETAIL: (id: string) => `/service-users/${id}`,
} as const

export const ROUTES_ROTA = {
  LIST: '/rota',
  NEW: '/rota/new',
  EDIT: (id: string) => `/rota/${id}/edit`,
  MY_SHIFTS: '/rota/my-shifts',
} as const

export const ROUTES_CARE_LOGS = {
  LIST: '/care-logs',
  NEW: (serviceUserId: string) => `/care-logs/new?serviceUser=${serviceUserId}`,
  EDIT: (id: string) => `/care-logs/${id}/edit`,
} as const

export const ROUTES_ABSENCES = {
  LIST: '/absences',
  REQUEST: '/absences/request',
} as const

export type ThemeMode = 'light' | 'dark'

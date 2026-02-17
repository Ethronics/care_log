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
} as const

export const ROUTES_STAFF = {
  LIST: '/staff',
  NEW: '/staff/new',
  EDIT: (id: string) => `/staff/${id}/edit`,
} as const

export type ThemeMode = 'light' | 'dark'

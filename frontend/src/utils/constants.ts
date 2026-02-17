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

export const USER_ROLES = {
  MANAGER: 'manager',
  SENIOR_CARER: 'senior_carer',
  CARER: 'carer',
} as const

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'care_log_theme',
} as const

export type ThemeMode = 'light' | 'dark'

// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
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

/** Staff classification: carer or senior carer (applies to care staff). */
export const STAFF_LEVELS = {
  CARER: 'carer',
  SENIOR_CARER: 'senior_carer',
} as const

export type StaffLevel = (typeof STAFF_LEVELS)[keyof typeof STAFF_LEVELS]

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'care_log_theme',
  DEMO_DATA: 'care_log_demo_data',
  SIDEBAR_COLLAPSED: 'care_log_sidebar_collapsed',
  ROTA_WEEK_START: 'care_log_rota_week_start',
  ROTA_STAFF_FILTER: 'care_log_rota_staff_filter',
  ROTA_HIGHLIGHT_TODAY: 'care_log_rota_highlight_today',
} as const

export const ROUTES_STAFF = {
  LIST: '/staff',
  NEW: '/staff/new',
  DETAIL: (id: string) => `/staff/${id}`,
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

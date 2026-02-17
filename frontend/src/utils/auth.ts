// Authentication utilities and role-based access

import { ROLES, STORAGE_KEYS, type Role } from './constants'
import type { User } from '../types/user'

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (!userStr) return null
  try {
    const parsed = JSON.parse(userStr) as User
    if (parsed?.role && (parsed.role === ROLES.ADMIN || parsed.role === ROLES.STAFF)) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export const setUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export const isAuthenticated = (): boolean => {
  return getToken() !== null
}

export const getRole = (): Role | null => {
  const user = getUser()
  return user?.role ?? null
}

export const hasRole = (role: Role): boolean => {
  return getRole() === role
}

export const isAdmin = (): boolean => {
  return hasRole(ROLES.ADMIN)
}

export const isStaff = (): boolean => {
  return hasRole(ROLES.STAFF)
}

export const logout = (): void => {
  removeToken()
  removeUser()
}

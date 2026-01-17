// Authentication utilities

import { STORAGE_KEYS } from './constants'

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

export const getUser = (): any | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  return userStr ? JSON.parse(userStr) : null
}

export const setUser = (user: any): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export const isAuthenticated = (): boolean => {
  return getToken() !== null
}

export const logout = (): void => {
  removeToken()
  removeUser()
}

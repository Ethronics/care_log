import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getToken, getUser, setToken, setUser, removeToken, removeUser, logout as logoutUtil } from '../utils/auth'

interface User {
  id: string
  email: string
  role: string
  name?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedToken = getToken()
    const storedUser = getUser()

    if (storedToken && storedUser) {
      setTokenState(storedToken)
      setUserState(storedUser)
    }

    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    setTokenState(newToken)
    setUserState(newUser)
  }

  const logout = () => {
    logoutUtil()
    setTokenState(null)
    setUserState(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

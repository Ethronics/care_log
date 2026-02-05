import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts'
import { ROUTES } from '../utils/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div className="loading"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}

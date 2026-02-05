import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts'
import { ROUTES } from '../utils/constants'

interface PublicRouteProps {
  children: React.ReactNode
  redirectIfAuthenticated?: boolean
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectIfAuthenticated = false
}) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
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

  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}

import React from 'react'
import { RouteObject } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

// Lazy load pages (will be implemented later)
const HomePage = React.lazy(() => import('../pages/Home'))
const LoginPage = React.lazy(() => import('../pages/Login'))
const DashboardPage = React.lazy(() => import('../pages/Dashboard'))

// Placeholder components for routes that will be implemented
const RotaPage = () => <div>Rota Page - Coming Soon</div>
const StaffPage = () => <div>Staff Page - Coming Soon</div>
const ServiceUsersPage = () => <div>Service Users Page - Coming Soon</div>
const CareLogsPage = () => <div>Care Logs Page - Coming Soon</div>
const AbsencesPage = () => <div>Absences Page - Coming Soon</div>

export const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: (
      <PublicRoute>
        <HomePage />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute redirectIfAuthenticated>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ROTA,
    element: (
      <ProtectedRoute>
        <RotaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.STAFF,
    element: (
      <ProtectedRoute>
        <StaffPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SERVICE_USERS,
    element: (
      <ProtectedRoute>
        <ServiceUsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CARE_LOGS,
    element: (
      <ProtectedRoute>
        <CareLogsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ABSENCES,
    element: (
      <ProtectedRoute>
        <AbsencesPage />
      </ProtectedRoute>
    ),
  },
]

import React from 'react'
import { RouteObject } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

// Lazy load pages
const HomePage = React.lazy(() => import('../pages/Home'))
const LoginPage = React.lazy(() => import('../pages/Login'))
const DashboardPage = React.lazy(() => import('../pages/Dashboard'))

// Staff pages
const StaffListPage = React.lazy(() => import('../features/staff/pages/StaffListPage'))
const StaffCreatePage = React.lazy(() => import('../features/staff/pages/StaffCreatePage'))
const StaffEditPage = React.lazy(() => import('../features/staff/pages/StaffEditPage'))
const StaffDetailPage = React.lazy(() => import('../features/staff/pages/StaffDetailPage'))

// Placeholder components for routes that will be implemented
const RotaPage = () => <div>Rota Page - Coming Soon</div>
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
        <StaffListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: `${ROUTES.STAFF}/new`,
    element: (
      <ProtectedRoute requiredRole="manager">
        <StaffCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: `${ROUTES.STAFF}/:id`,
    element: (
      <ProtectedRoute>
        <StaffDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: `${ROUTES.STAFF}/:id/edit`,
    element: (
      <ProtectedRoute requiredRole="manager">
        <StaffEditPage />
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

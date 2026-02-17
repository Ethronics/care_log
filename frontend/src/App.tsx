import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { BreadcrumbProvider } from './contexts/BreadcrumbContext'
import { DemoStoreProvider } from './store/demoStoreContext'
import { MainLayout } from './components/layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RoleGuard } from './components/auth/RoleGuard'
import {
  HomePage,
  LoginPage,
  DashboardPage,
  PlaceholderPage,
} from './pages'
import { StaffListPage, StaffCreatePage, StaffEditPage } from './pages/staff'
import {
  ServiceUserListPage,
  ServiceUserCreatePage,
  ServiceUserEditPage,
  ServiceUserDetailPage,
} from './pages/serviceUsers'
import { ROUTES, ROLES } from './utils/constants'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <DemoStoreProvider>
        <Router>
          <BreadcrumbProvider>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route
                path={ROUTES.ROTA}
                element={<PlaceholderPage title="Rota" description="Shift scheduling and calendar." />}
              />
              <Route
                path="staff"
                element={
                  <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                    <Outlet />
                  </RoleGuard>
                }
              >
                <Route index element={<StaffListPage />} />
                <Route path="new" element={<StaffCreatePage />} />
                <Route path=":id/edit" element={<StaffEditPage />} />
              </Route>
              <Route path="service-users">
                <Route index element={<ServiceUserListPage />} />
                <Route path="new" element={<ServiceUserCreatePage />} />
                <Route path=":id" element={<ServiceUserDetailPage />} />
                <Route path=":id/edit" element={<ServiceUserEditPage />} />
              </Route>
              <Route
                path={ROUTES.CARE_LOGS}
                element={
                  <PlaceholderPage
                    title="Care logs"
                    description="Care activity and timeline entries."
                  />
                }
              />
              <Route
                path={ROUTES.ABSENCES}
                element={
                  <PlaceholderPage
                    title="Leave & absence"
                    description="Leave requests and absence management."
                  />
                }
              />
            </Route>
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
          </BreadcrumbProvider>
        </Router>
      </DemoStoreProvider>
    </ThemeProvider>
  )
}

export default App

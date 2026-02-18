import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { BreadcrumbProvider } from './contexts/BreadcrumbContext'
import { DemoStoreProvider } from './store/demoStoreContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MainLayout } from './components/layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RoleGuard } from './components/auth/RoleGuard'
import {
  HomePage,
  LoginPage,
  DashboardPage,
  NotFoundPage,
  PlaceholderPage,
} from './pages'
import { StaffListPage, StaffCreatePage, StaffEditPage } from './pages/staff'
import {
  ServiceUserListPage,
  ServiceUserCreatePage,
  ServiceUserEditPage,
  ServiceUserDetailPage,
} from './pages/serviceUsers'
import {
  RotaPage,
  MyShiftsPage,
  ShiftCreatePage,
  ShiftEditPage,
} from './pages/rota'
import { CareLogsListPage, CareLogEditPage } from './pages/careLogs'
import { AbsencesPage } from './pages/absences'
import { ProfilePage, ProfileEditPage } from './pages/profile'
import { ROUTES, ROLES } from './utils/constants'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <DemoStoreProvider>
        <Router>
          <ErrorBoundary>
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
              <Route path="rota">
                <Route index element={<RotaPage />} />
                <Route path="my-shifts" element={<MyShiftsPage />} />
                <Route
                  path="new"
                  element={
                    <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                      <ShiftCreatePage />
                    </RoleGuard>
                  }
                />
                <Route
                  path=":id/edit"
                  element={
                    <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                      <ShiftEditPage />
                    </RoleGuard>
                  }
                />
              </Route>
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
              <Route path="care-logs">
                <Route index element={<CareLogsListPage />} />
                <Route path=":id/edit" element={<CareLogEditPage />} />
              </Route>
              <Route path={ROUTES.ABSENCES} element={<AbsencesPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </BreadcrumbProvider>
          </ErrorBoundary>
        </Router>
      </DemoStoreProvider>
    </ThemeProvider>
  )
}

export default App

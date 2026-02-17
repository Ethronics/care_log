import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { BreadcrumbProvider } from './contexts/BreadcrumbContext'
import { MainLayout } from './components/layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import {
  HomePage,
  LoginPage,
  DashboardPage,
  PlaceholderPage,
} from './pages'
import { ROUTES } from './utils/constants'
import './App.css'

function App() {
  return (
    <ThemeProvider>
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
                path={ROUTES.STAFF}
                element={<PlaceholderPage title="Staff" description="Staff profiles and management." />}
              />
              <Route
                path={ROUTES.SERVICE_USERS}
                element={
                  <PlaceholderPage
                    title="Service users"
                    description="People receiving care – profiles and timeline."
                  />
                }
              />
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
    </ThemeProvider>
  )
}

export default App

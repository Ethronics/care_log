import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import { Suspense } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AppLayout } from './components/layout'
import { routes } from './routes'
import './App.css'

function AppRoutes() {
  const element = useRoutes(routes)
  return element
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout>
            <Suspense
              fallback={
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '50vh'
                }}>
                  <div className="loading"></div>
                </div>
              }
            >
              <AppRoutes />
            </Suspense>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

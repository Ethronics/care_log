import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert } from '../components/ui'
import { ROUTES } from '../utils/constants'
import { setToken, setUser } from '../utils/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Frontend-only: mock login for development. Replace with API call when backend is ready.
    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setToken('mock-jwt-token')
    setUser({ email, role: 'manager' })
    navigate(from, { replace: true })
  }

  return (
    <div className="login-wrapper">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button type="submit" variant="primary" fullWidth>
                Sign in
              </Button>
            </div>
          </form>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-4)' }}>
            Frontend-only mode: any email and password will sign you in.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert } from '../components/ui'
import { ROUTES, ROLES } from '../utils/constants'
import { setToken, setUser } from '../utils/auth'
import type { Role } from '../utils/constants'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>(ROLES.ADMIN)
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
    setUser({ email, role })
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
            <div style={{ marginTop: 'var(--space-4)' }}>
              <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                style={{
                  width: '100%',
                  minHeight: 44,
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-input-border)',
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--text-base)',
                }}
                aria-label="Sign in as role"
              >
                <option value={ROLES.ADMIN}>Admin</option>
                <option value={ROLES.STAFF}>Staff</option>
              </select>
            </div>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button type="submit" variant="primary" fullWidth>
                Sign in
              </Button>
            </div>
          </form>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-4)' }}>
            Frontend-only mode: any email and password will sign you in with the selected role.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

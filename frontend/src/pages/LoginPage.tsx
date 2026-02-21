import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert } from '../components/ui'
import { ROUTES } from '../utils/constants'
import { setToken, setUser } from '../utils/auth'
import { useDemoStore } from '../store/demoStoreContext'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getStaffByEmail } = useDemoStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Please enter your email.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    // Role comes from the staff record (admin adds staff with a role). No role selection at login.
    const staff = getStaffByEmail(trimmedEmail)
    if (!staff) {
      setError('Invalid email or password.')
      return
    }
    if (!staff.isActive) {
      setError('This account is deactivated. Contact your administrator.')
      return
    }
    setToken('mock-jwt-token')
    setUser({ email: trimmedEmail, role: staff.role, name: staff.name })
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
            Your access is determined by your account. Contact your administrator to be added or to reset your password.
          </p>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-2)' }}>
            <Link to={ROUTES.FORGOT_PASSWORD}>Forgot password?</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

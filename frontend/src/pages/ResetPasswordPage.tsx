import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert } from '../components/ui'
import { ROUTES } from '../utils/constants'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="login-wrapper">
        <Card>
          <CardHeader>
            <CardTitle>Password updated</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="success">
              Your password has been reset. You can now sign in with your new password.
            </Alert>
            <Link to={ROUTES.LOGIN} style={{ display: 'inline-block', marginTop: 'var(--space-4)' }}>
              <Button variant="primary">Sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="login-wrapper">
      <Card>
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          {!token && (
            <Alert variant="warning" style={{ marginBottom: 'var(--space-4)' }}>
              Invalid or missing reset link. Request a new one from the sign-in page.
            </Alert>
          )}
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>
            Mock: no token is validated. Enter a new password to complete the flow.
          </p>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              label="New password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
            />
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Input
                type="password"
                label="Confirm new password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button type="submit" variant="primary" fullWidth>
                Reset password
              </Button>
            </div>
          </form>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-4)' }}>
            <Link to={ROUTES.LOGIN}>Back to sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

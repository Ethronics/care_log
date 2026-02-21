import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert } from '../components/ui'
import { ROUTES } from '../utils/constants'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="login-wrapper">
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="success">
              If an account exists for {email}, you will receive password reset instructions. Check your inbox and spam folder.
            </Alert>
            <p className="text-sm text-muted" style={{ marginTop: 'var(--space-4)' }}>
              Mock: no email is sent. Use <Link to={ROUTES.LOGIN}>Sign in</Link> to continue.
            </p>
            <Link to={ROUTES.LOGIN} style={{ display: 'inline-block', marginTop: 'var(--space-4)' }}>
              <Button variant="secondary">Back to sign in</Button>
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
          <CardTitle>Forgot password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
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
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button type="submit" variant="primary" fullWidth>
                Send reset link
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

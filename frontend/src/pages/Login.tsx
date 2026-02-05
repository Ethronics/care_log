import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, Input, Alert } from '../components/ui'
import { useAuth } from '../contexts'
import { ROUTES } from '../utils/constants'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // For now, this is a placeholder
      // const response = await api.post('/auth/login', { email, password })
      // login(response.data.token, response.data.user)

      // Placeholder login for development
      if (email && password) {
        login('mock-token', {
          id: '1',
          email,
          role: 'carer',
          name: email.split('@')[0],
        })
        navigate(from, { replace: true })
      } else {
        setError('Please enter email and password')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '0 auto', padding: 'var(--spacing-8) var(--spacing-4)' }}>
      <Card>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          Login
        </h2>
        {error && (
          <Alert variant="error" style={{ marginBottom: 'var(--spacing-4)' }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{ marginBottom: 'var(--spacing-4)' }}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{ marginBottom: 'var(--spacing-6)' }}
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Login

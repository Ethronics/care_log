import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button } from '../components/ui'
import { ROUTES } from '../utils/constants'
import { useAuth } from '../contexts'

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-8) var(--spacing-4)' }}>
      <Card>
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          Welcome to Log My Care
        </h1>
        <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)', color: 'var(--color-text-secondary)' }}>
          A comprehensive care management system for healthcare professionals
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Home

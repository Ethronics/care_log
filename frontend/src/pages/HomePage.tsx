import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui'
import { ROUTES } from '../utils/constants'

export function HomePage() {
  return (
    <div className="container">
      <h1 className="page-title">
        Welcome to Log My Care
      </h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Smart Edition – Less paperwork, more care.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Get started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="body-text text-muted" style={{ marginBottom: 'var(--space-4)' }}>
            Use the sidebar or navigation to explore. When the backend is connected, sign in to
            access the dashboard and full features.
          </p>
          <div className="actions-stack">
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="primary" fullWidth>Go to Dashboard</Button>
            </Link>
            <Link to={ROUTES.LOGIN} style={{ display: 'block' }}>
              <Button variant="secondary" fullWidth>Sign in</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

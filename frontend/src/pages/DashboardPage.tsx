import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui'
import { useBreadcrumbs } from '../contexts/BreadcrumbContext'
import { ROUTES } from '../utils/constants'

export function DashboardPage() {
  const { setItems } = useBreadcrumbs()

  useEffect(() => {
    setItems([{ label: 'Home', to: ROUTES.HOME }, { label: 'Dashboard' }])
    return () => setItems([])
  }, [setItems])

  return (
    <div className="container">
      <h1 className="page-title">
        Dashboard
      </h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Overview and quick actions. Backend integration coming next.
      </p>
      <div className="dashboard-grid">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s shifts</CardTitle>
            <Badge variant="info">Placeholder</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted text-sm">Connect API to see live data.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending leave</CardTitle>
            <Badge variant="warning">Placeholder</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted text-sm">Connect API to see leave requests.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent care logs</CardTitle>
            <Badge variant="default">Placeholder</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted text-sm">Connect API to see care activity.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

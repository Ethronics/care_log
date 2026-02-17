import { Card, CardContent } from '../components/ui'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container">
      <h1 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>
        {title}
      </h1>
      {description && (
        <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
          {description}
        </p>
      )}
      <Card>
        <CardContent>
          <p className="text-muted text-sm">
            This section will be implemented when the backend is connected and Phase 2 features are
            built.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

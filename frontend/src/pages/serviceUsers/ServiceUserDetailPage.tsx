import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_SERVICE_USERS } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui'
import styles from './ServiceUserDetailPage.module.css'

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export function ServiceUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { setItems } = useBreadcrumbs()
  const { getServiceUser } = useDemoStore()

  const user = id ? getServiceUser(id) : undefined

  useEffect(() => {
    if (user) {
      setItems([
        { label: 'Home', to: ROUTES.HOME },
        { label: 'Service users', to: ROUTES.SERVICE_USERS },
        { label: user.name },
      ])
    }
    return () => setItems([])
  }, [user, setItems])

  if (!id || !user) {
    return (
      <div className="container">
        <p className="text-muted">Service user not found.</p>
        <Link to={ROUTES_SERVICE_USERS.LIST}>
          <Button variant="secondary">Back to list</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <Link
        to={ROUTES_SERVICE_USERS.LIST}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to service users
      </Link>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">{user.name}</h1>
          <p className="body-text text-muted" style={{ marginBottom: 0 }}>
            Date of birth: {formatDate(user.dateOfBirth)}
          </p>
        </div>
        <Link to={ROUTES_SERVICE_USERS.EDIT(id)}>
          <Button variant="primary">Edit profile</Button>
        </Link>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }} />

      <div className={styles.grid}>
        <Card>
          <CardHeader>
            <CardTitle>Medical information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.bodyText}>
              {user.medicalInfo || 'No medical information recorded.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences & notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.bodyText}>
              {user.preferences || 'No preferences recorded.'}
            </p>
          </CardContent>
        </Card>

        <Card className={styles.fullWidth}>
          <CardHeader>
            <CardTitle>Emergency contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {user.emergencyContacts.length === 0 ? (
              <p className="text-muted text-sm">No emergency contacts recorded.</p>
            ) : (
              <ul className={styles.contactList}>
                {user.emergencyContacts.map((c, i) => (
                  <li key={i} className={styles.contactItem}>
                    <strong>{c.name}</strong>
                    {c.relationship && ` (${c.relationship})`}
                    {c.phone && ` · ${c.phone}`}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

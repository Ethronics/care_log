import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_STAFF, ROLES, STAFF_LEVELS } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui'
import type { Staff } from '../../types/staff'
import styles from './StaffDetailPage.module.css'

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function trainingStatus(s: Staff): string {
  const exp = s.trainingExpiryDate
  if (!exp) return '—'
  const today = new Date().toISOString().slice(0, 10)
  return exp < today ? 'Expired' : `Valid until ${formatDate(exp)}`
}

export function StaffDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { setItems } = useBreadcrumbs()
  const { getStaff } = useDemoStore()
  const staff = id ? getStaff(id) : undefined

  useEffect(() => {
    if (staff) {
      setItems([
        { label: 'Home', to: ROUTES.HOME },
        { label: 'Staff', to: ROUTES.STAFF },
        { label: staff.name },
      ])
    }
    return () => setItems([])
  }, [staff, setItems])

  if (!id || !staff) {
    return (
      <div className="container">
        <p className="text-muted">Staff member not found.</p>
        <Link to={ROUTES_STAFF.LIST}>
          <Button variant="secondary">Back to staff</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <Link
        to={ROUTES_STAFF.LIST}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to staff
      </Link>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">{staff.name}</h1>
          <div className={styles.badges}>
            <Badge variant={staff.role === ROLES.ADMIN ? 'info' : 'default'}>
              {staff.role === ROLES.ADMIN ? 'Admin' : 'Staff'}
            </Badge>
            {staff.staffLevel === STAFF_LEVELS.SENIOR_CARER && (
              <Badge variant="default">Senior carer</Badge>
            )}
            {staff.staffLevel === STAFF_LEVELS.CARER && (
              <Badge variant="default">Carer</Badge>
            )}
            {!staff.isActive && (
              <Badge variant="warning">Inactive</Badge>
            )}
          </div>
        </div>
        <Link to={ROUTES_STAFF.EDIT(staff.id)}>
          <Button variant="primary">Edit profile</Button>
        </Link>
      </div>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        View and manage this team member&apos;s profile.
      </p>

      <div className={styles.grid}>
        <Card padding="sm">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className={styles.dl}>
              <dt>Email</dt>
              <dd>{staff.email}</dd>
              <dt>Phone</dt>
              <dd>{staff.phone || '—'}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card padding="sm">
          <CardHeader>
            <CardTitle>Training & compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className={styles.dl}>
              <dt>Mandatory training</dt>
              <dd>
                <span className={trainingStatus(staff) === 'Expired' ? styles.expired : ''}>
                  {trainingStatus(staff)}
                </span>
              </dd>
              <dt>DBS check</dt>
              <dd>{staff.dbsCheckExpiry ? `Valid until ${formatDate(staff.dbsCheckExpiry)}` : '—'}</dd>
              <dt>Safeguarding</dt>
              <dd>{staff.safeguardingCompletedDate ? `Completed ${formatDate(staff.safeguardingCompletedDate)}` : '—'}</dd>
              <dt>Contracted hours</dt>
              <dd>{staff.contractedHoursPerWeek != null ? `${staff.contractedHoursPerWeek} hours/week` : '—'}</dd>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

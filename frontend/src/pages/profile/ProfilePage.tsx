import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../../components/ui'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser, setUser } from '../../utils/auth'
import { ROUTES, ROUTES_PROFILE, ROLES } from '../../utils/constants'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const staff = user?.email
    ? store.getStaffList({ includeInactive: true }).find((s) => s.email === user.email)
    : null

  useEffect(() => {
    setItems([{ label: 'Home', to: ROUTES.HOME }, { label: 'Profile' }])
    return () => setItems([])
  }, [setItems])

  useEffect(() => {
    if (user && staff && !user.name) {
      setUser({ ...user, name: staff.name })
    }
  }, [user, staff])

  if (!user) return null

  return (
    <div className="container">
      <h1 className="page-title">My profile</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        View and manage your account details.
      </p>

      <div className={styles.grid}>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <Badge variant={user.role === ROLES.ADMIN ? 'info' : 'default'}>
              {user.role === ROLES.ADMIN ? 'Admin' : 'Staff'}
            </Badge>
          </CardHeader>
          <CardContent>
            <dl className={styles.dl}>
              <dt>Email</dt>
              <dd>{user.email}</dd>
              <dt>Role</dt>
              <dd className="capitalize">{user.role}</dd>
            </dl>
          </CardContent>
        </Card>

        {staff ? (
          <Card>
            <CardHeader>
              <CardTitle>Staff profile</CardTitle>
              {!staff.isActive && (
                <Badge variant="warning">Inactive</Badge>
              )}
            </CardHeader>
            <CardContent>
              <dl className={styles.dl}>
                <dt>Name</dt>
                <dd>{staff.name}</dd>
                <dt>Phone</dt>
                <dd>{staff.phone || '—'}</dd>
                <dt>Email</dt>
                <dd>{staff.email}</dd>
              </dl>
              <Link to={ROUTES_PROFILE.EDIT}>
                <Button variant="primary" size="sm" className={styles.editBtn}>
                  Edit profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Staff profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted text-sm">
                No staff record is linked to your sign-in email. You can still use the app with your account role.
                Contact an admin to add you as staff if you need a linked profile (e.g. for shifts and care logs).
              </p>
              <p className="text-sm text-muted" style={{ marginTop: 'var(--space-3)' }}>
                You can set a display name below.
              </p>
              <Link to={ROUTES_PROFILE.EDIT}>
                <Button variant="secondary" size="sm" className={styles.editBtn}>
                  Edit display name
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

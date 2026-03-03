import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Badge } from '../../components/ui'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser, setUser } from '../../utils/auth'
import { ROUTES, ROUTES_PROFILE, ROLES } from '../../utils/constants'
import type { Staff } from '../../types/staff'
import styles from './ProfilePage.module.css'

const today = () => new Date().toISOString().slice(0, 10)

function isExpired(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false
  return dateStr < today()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ProfilePage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const staff = user?.email ? store.getStaffByEmail(user.email) ?? null : null

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

  const displayName = staff?.name ?? user.name ?? user.email.split('@')[0]
  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.avatar} aria-hidden>
            {initials}
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>{displayName}</h1>
            <div className={styles.heroMeta}>
              <Badge variant={user.role === ROLES.ADMIN ? 'info' : 'default'}>
                {user.role === ROLES.ADMIN ? 'Admin' : 'Staff'}
              </Badge>
              {staff && !staff.isActive && (
                <Badge variant="warning" className={styles.heroBadge}>Inactive</Badge>
              )}
            </div>
          </div>
          <div className={styles.heroAction}>
            <Link to={ROUTES_PROFILE.EDIT}>
              <Button variant="primary" size="sm">
                {staff ? 'Edit profile' : 'Edit display name'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <Card padding="sm" className={styles.card}>
            <div className={styles.rowList}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Email</span>
                <span>{user.email}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Role</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </Card>
        </section>

        {staff ? (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <Card padding="sm" className={styles.card}>
                <div className={styles.rowList}>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Name</span>
                    <span>{staff.name}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Phone</span>
                    <span>{staff.phone || '—'}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Email</span>
                    <span>{staff.email}</span>
                  </div>
                </div>
              </Card>
            </section>

            <section className={styles.sectionFull}>
              <h2 className={styles.sectionTitle}>Training & compliance</h2>
              <Card padding="sm" className={styles.card}>
                <ProfileTrainingSection staff={staff} />
                <div className={styles.complianceBlock}>
                  <ProfileComplianceSection staff={staff} />
                </div>
              </Card>
            </section>
          </>
        ) : (
          <section className={styles.sectionFull}>
            <h2 className={styles.sectionTitle}>Staff profile</h2>
            <Card padding="sm" className={styles.card}>
              <p className={styles.noStaffText}>
                No staff record is linked to your sign-in email. You can still use the app with your account role.
                Contact an admin to add you as staff if you need a linked profile (e.g. for shifts and care logs).
              </p>
              <p className={styles.noStaffHint}>
                You can set a display name in the button above.
              </p>
            </Card>
          </section>
        )}
      </div>
    </div>
  )
}

function ProfileTrainingSection({ staff }: { staff: Staff }) {
  const exp = staff.trainingExpiryDate
  const expired = isExpired(exp)
  return (
    <div className={styles.trainingBlock}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Mandatory training</span>
        <span className={styles.rowValue}>
          {exp ? (
            <>
              <span>Valid until {formatDate(exp)}</span>
              <Badge variant={expired ? 'error' : 'success'} className={styles.statusBadge}>
                {expired ? 'Expired' : 'Valid'}
              </Badge>
            </>
          ) : (
            <span className="text-muted">Not set</span>
          )}
        </span>
      </div>
      {expired && (
        <p className={styles.renewalNote}>
          Renew training to be eligible for shift assignment. Contact your manager.
        </p>
      )}
    </div>
  )
}

function ProfileComplianceSection({ staff }: { staff: Staff }) {
  const todayStr = today()
  const dbsExp = staff.dbsCheckExpiry
  const dbsExpired = dbsExp ? dbsExp < todayStr : null
  const safeguarding = staff.safeguardingCompletedDate

  return (
    <div className={styles.rowList} role="list">
      <div className={styles.row} role="listitem">
        <span className={styles.rowLabel}>DBS check</span>
        <span className={styles.rowValue}>
          {dbsExp ? (
            <>
              <span>Valid until {formatDate(dbsExp)}</span>
              {dbsExpired !== null && (
                <Badge variant={dbsExpired ? 'error' : 'success'} className={styles.statusBadge}>
                  {dbsExpired ? 'Expired' : 'Current'}
                </Badge>
              )}
            </>
          ) : (
            <span className="text-muted">Not recorded</span>
          )}
        </span>
      </div>
      <div className={styles.row} role="listitem">
        <span className={styles.rowLabel}>Safeguarding</span>
        <span>
          {safeguarding ? (
            <span>Completed {formatDate(safeguarding)}</span>
          ) : (
            <span className="text-muted">Not recorded</span>
          )}
        </span>
      </div>
      <div className={styles.row} role="listitem">
        <span className={styles.rowLabel}>Contracted hours</span>
        <span>
          {staff.contractedHoursPerWeek != null ? (
            <span>{staff.contractedHoursPerWeek} hours/week</span>
          ) : (
            <span className="text-muted">—</span>
          )}
        </span>
      </div>
    </div>
  )
}

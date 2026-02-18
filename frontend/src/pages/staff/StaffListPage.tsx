import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_STAFF, ROLES } from '../../utils/constants'
import { Button, Badge, Card, ConfirmDialog, EmptyState } from '../../components/ui'
import styles from './StaffListPage.module.css'

export function StaffListPage() {
  const { setItems } = useBreadcrumbs()
  const { getStaffList, deactivateStaff } = useDemoStore()
  const [deactivateId, setDeactivateId] = useState<string | null>(null)

  const staff = getStaffList({ includeInactive: false })
  const today = new Date().toISOString().slice(0, 10)
  const trainingStatus = (s: { trainingExpiryDate?: string | null }) => {
    const exp = s.trainingExpiryDate
    if (!exp) return '—'
    return exp < today ? 'Expired' : `Valid until ${new Date(exp + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
  }

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Staff', to: ROUTES.STAFF },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className="page-title">Staff</h1>
        <Link to={ROUTES_STAFF.NEW}>
          <Button variant="primary">Add staff</Button>
        </Link>
      </div>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Manage team members and their roles. Data is stored in this browser until you connect a backend.
      </p>

      {staff.length === 0 ? (
        <Card className={styles.emptyCard}>
          <EmptyState
            title="No staff yet"
            description="Add your first team member to get started."
            action={
              <Link to={ROUTES_STAFF.NEW}>
                <Button variant="primary">Add staff</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Training</th>
                  <th>Hours</th>
                  <th className={styles.actionsCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className={styles.name}>{s.name}</span>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.phone || '—'}</td>
                    <td>
                      <Badge variant={s.role === ROLES.ADMIN ? 'info' : 'default'}>
                        {s.role === ROLES.ADMIN ? 'Admin' : 'Staff'}
                      </Badge>
                    </td>
                    <td>
                      <span className={trainingStatus(s) === 'Expired' ? styles.trainingExpired : ''}>
                        {trainingStatus(s)}
                      </span>
                    </td>
                    <td>{s.contractedHoursPerWeek != null ? `${s.contractedHoursPerWeek} h/wk` : '—'}</td>
                    <td className={styles.actionsCell}>
                      <Link to={ROUTES_STAFF.EDIT(s.id)} className={styles.link}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deactivateBtn}
                        onClick={() => setDeactivateId(s.id)}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.cardList}>
            {staff.map((s) => (
              <Card key={s.id} padding="md" className={styles.staffCard}>
                <div className={styles.cardName}>{s.name}</div>
                <div className="text-sm text-muted">{s.email}</div>
                {s.phone && (
                  <div className="text-sm text-muted">{s.phone}</div>
                )}
                <div className="text-sm text-muted">
                  Training: {trainingStatus(s)}
                  {s.contractedHoursPerWeek != null && ` · ${s.contractedHoursPerWeek} h/wk`}
                </div>
                <Badge
                  variant={s.role === ROLES.ADMIN ? 'info' : 'default'}
                  className={styles.cardBadge}
                >
                  {s.role === ROLES.ADMIN ? 'Admin' : 'Staff'}
                </Badge>
                <div className={styles.cardActions}>
                  <Link to={ROUTES_STAFF.EDIT(s.id)}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.deactivateBtn}
                    onClick={() => setDeactivateId(s.id)}
                  >
                    Deactivate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={deactivateId !== null}
        title="Deactivate staff"
        message="This person will no longer appear in the active staff list and cannot be assigned to shifts. You can reactivate them later from inactive staff."
        confirmLabel="Deactivate"
        variant="danger"
        onConfirm={() => {
          if (deactivateId) {
            deactivateStaff(deactivateId)
            setDeactivateId(null)
          }
        }}
        onCancel={() => setDeactivateId(null)}
      />
    </div>
  )
}

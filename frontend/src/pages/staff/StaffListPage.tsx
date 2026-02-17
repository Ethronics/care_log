import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_STAFF, ROLES } from '../../utils/constants'
import { Button, Badge, Card, ConfirmDialog } from '../../components/ui'
import styles from './StaffListPage.module.css'

export function StaffListPage() {
  const { setItems } = useBreadcrumbs()
  const { getStaffList, deactivateStaff } = useDemoStore()
  const [deactivateId, setDeactivateId] = useState<string | null>(null)

  const staff = getStaffList({ includeInactive: false })

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
          <div className={styles.emptyContent}>
            <p className={styles.emptyTitle}>No staff yet</p>
            <p className="text-muted text-sm">
              Add your first team member to get started.
            </p>
            <Link to={ROUTES_STAFF.NEW}>
              <Button variant="primary" className={styles.emptyButton}>
                Add staff
              </Button>
            </Link>
          </div>
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

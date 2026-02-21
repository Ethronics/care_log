import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_STAFF, ROLES, STAFF_LEVELS } from '../../utils/constants'
import { Button, Badge, Card, ConfirmDialog, EmptyState, Input } from '../../components/ui'
import styles from './StaffListPage.module.css'

export function StaffListPage() {
  const { setItems } = useBreadcrumbs()
  const { getStaffList, deactivateStaff } = useDemoStore()
  const [deactivateId, setDeactivateId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const allStaff = getStaffList({ includeInactive: false })
  const staff = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allStaff
    return allStaff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q))
    )
  }, [allStaff, searchQuery])
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
      <p className="page-description">
        Manage team members and their roles. Data is stored in this browser until you connect a backend.
      </p>

      {allStaff.length > 0 && (
        <div className={styles.searchWrap}>
          <Input
            type="search"
            placeholder="Search by name, email or phone…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search staff"
          />
          {searchQuery.trim() && (
            <p className={styles.searchHint}>
              Showing {staff.length} of {allStaff.length}
            </p>
          )}
        </div>
      )}

      {allStaff.length === 0 ? (
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
      ) : staff.length === 0 ? (
        <Card className={styles.emptyCard}>
          <p className="text-muted">No staff match &quot;{searchQuery.trim()}&quot;.</p>
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
                  <th>Classification</th>
                  <th>Training</th>
                  <th>Hours</th>
                  <th className={styles.actionsCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link to={ROUTES_STAFF.DETAIL(s.id)} className={styles.nameLink}>
                        {s.name}
                      </Link>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.phone || '—'}</td>
                    <td>
                      <Badge variant={s.role === ROLES.ADMIN ? 'info' : 'default'}>
                        {s.role === ROLES.ADMIN ? 'Admin' : 'Staff'}
                      </Badge>
                    </td>
                    <td>
                      {s.staffLevel === STAFF_LEVELS.SENIOR_CARER
                        ? 'Senior carer'
                        : s.staffLevel === STAFF_LEVELS.CARER
                          ? 'Carer'
                          : '—'}
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
                <Link to={ROUTES_STAFF.DETAIL(s.id)} className={styles.cardName}>
                  {s.name}
                </Link>
                <div className="text-sm text-muted">{s.email}</div>
                {s.phone && (
                  <div className="text-sm text-muted">{s.phone}</div>
                )}
                <div className="text-sm text-muted">
                  {s.staffLevel === STAFF_LEVELS.SENIOR_CARER
                    ? 'Senior carer'
                    : s.staffLevel === STAFF_LEVELS.CARER
                      ? 'Carer'
                      : null}
                  {s.staffLevel && ' · '}
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

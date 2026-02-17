import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES, ROUTES_ABSENCES, ROLES } from '../../utils/constants'
import { Button, Card, Badge } from '../../components/ui'
import { LeaveRequestForm, type LeaveRequestFormValues } from './LeaveRequestForm'
import { ABSENCE_TYPES, ABSENCE_STATUS } from '../../types/absence'
import type { Absence } from '../../types/absence'
import styles from './AbsencesPage.module.css'

const TYPE_LABELS: Record<string, string> = {
  [ABSENCE_TYPES.SICK]: 'Sick',
  [ABSENCE_TYPES.ANNUAL]: 'Annual',
  [ABSENCE_TYPES.OTHER]: 'Other',
}

const STATUS_VARIANT: Record<string, 'warning' | 'success' | 'error' | 'default'> = {
  [ABSENCE_STATUS.PENDING]: 'warning',
  [ABSENCE_STATUS.APPROVED]: 'success',
  [ABSENCE_STATUS.REJECTED]: 'error',
}

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatRequested(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AbsencesPage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const isAdmin = user?.role === ROLES.ADMIN
  const currentStaffId = store.getStaffList().find((s) => s.email === user?.email)?.id ?? null

  const [showRequestForm, setShowRequestForm] = useState(false)

  const myAbsences = currentStaffId ? store.getAbsences({ staffId: currentStaffId }) : []
  const pendingAbsences = store.getPendingAbsences()
  const allAbsences = store.getAbsences()

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Leave & absence', to: ROUTES.ABSENCES },
    ])
    return () => setItems([])
  }, [setItems])

  const handleSubmitRequest = (values: LeaveRequestFormValues) => {
    if (!currentStaffId) return
    store.addAbsence({
      staffId: currentStaffId,
      startDate: values.startDate,
      endDate: values.endDate,
      type: values.type,
      notes: values.notes.trim(),
    })
    setShowRequestForm(false)
  }

  const handleApprove = (id: string) => {
    if (!currentStaffId || !isAdmin) return
    store.approveAbsence(id, currentStaffId)
  }

  const handleReject = (id: string) => {
    if (!currentStaffId || !isAdmin) return
    store.rejectAbsence(id, currentStaffId)
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className="page-title">
          {isAdmin ? 'Leave & absence' : 'My leave'}
        </h1>
        {!isAdmin && currentStaffId && (
          <Button
            variant="primary"
            onClick={() => setShowRequestForm((v) => !v)}
          >
            {showRequestForm ? 'Cancel' : 'Request leave'}
          </Button>
        )}
      </div>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-4)' }}>
        {isAdmin
          ? 'Review and approve leave requests. Approved leave marks staff unavailable for shifts.'
          : 'Submit leave requests and view your leave history.'}
      </p>

      {!isAdmin && currentStaffId && showRequestForm && (
        <Card className={styles.formCard}>
          <LeaveRequestForm
            onSubmit={handleSubmitRequest}
            onCancel={() => setShowRequestForm(false)}
          />
        </Card>
      )}

      {isAdmin && pendingAbsences.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pending requests</h2>
          <ul className={styles.list}>
            {pendingAbsences.map((a) => (
              <AbsenceCard
                key={a.id}
                absence={a}
                store={store}
                isAdmin={isAdmin}
                onApprove={() => handleApprove(a.id)}
                onReject={() => handleReject(a.id)}
              />
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {isAdmin ? 'All leave' : 'My leave'}
        </h2>
        {((isAdmin ? allAbsences : myAbsences).length === 0) ? (
          <Card className={styles.emptyCard}>
            <p className="text-muted">
              {isAdmin
                ? 'No leave records yet.'
                : 'You have no leave requests. Request leave to get started.'}
            </p>
          </Card>
        ) : (
          <ul className={styles.list}>
            {(isAdmin ? allAbsences : myAbsences).map((a) => (
              <AbsenceCard
                key={a.id}
                absence={a}
                store={store}
                isAdmin={isAdmin}
                onApprove={() => handleApprove(a.id)}
                onReject={() => handleReject(a.id)}
              />
            ))}
          </ul>
        )}
      </section>

      {!isAdmin && !currentStaffId && (
        <Card className={styles.emptyCard}>
          <p className="text-muted">
            No staff profile matches your sign-in email. Ask an admin to add you as staff to request leave.
          </p>
        </Card>
      )}
    </div>
  )
}

function AbsenceCard({
  absence,
  store,
  isAdmin,
  onApprove,
  onReject,
}: {
  absence: Absence
  store: ReturnType<typeof useDemoStore>
  isAdmin: boolean
  onApprove: () => void
  onReject: () => void
}) {
  const staff = store.getStaff(absence.staffId)

  return (
    <li className={styles.cardItem}>
      <Card padding="md" className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardMeta}>
            {isAdmin && (
              <span className={styles.staffName}>{staff?.name ?? 'Unknown'}</span>
            )}
            <span className={styles.dates}>
              {formatDate(absence.startDate)} – {formatDate(absence.endDate)}
            </span>
            <Badge variant={STATUS_VARIANT[absence.status] ?? 'default'}>
              {absence.status}
            </Badge>
            <span className={styles.type}>{TYPE_LABELS[absence.type] ?? absence.type}</span>
          </div>
          {isAdmin && absence.status === ABSENCE_STATUS.PENDING && (
            <div className={styles.actions}>
              <Button variant="primary" size="sm" onClick={onApprove}>
                Approve
              </Button>
              <Button variant="danger" size="sm" onClick={onReject}>
                Reject
              </Button>
            </div>
          )}
        </div>
        {absence.notes && (
          <p className={styles.notes}>{absence.notes}</p>
        )}
        <p className={styles.requested}>
          Requested {formatRequested(absence.requestedAt)}
        </p>
      </Card>
    </li>
  )
}

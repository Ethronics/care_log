import { useState, useEffect } from 'react'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES, ROLES } from '../../utils/constants'
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

function getMonthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const flat: (string | null)[] = []
  for (let i = 0; i < startPad; i++) flat.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    flat.push(
      `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    )
  }
  const weeks: (string | null)[][] = []
  for (let i = 0; i < flat.length; i += 7) {
    const row = flat.slice(i, i + 7)
    while (row.length < 7) row.push(null)
    weeks.push(row)
  }
  return weeks
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function LeaveCalendar({
  year,
  month,
  approvedAbsences,
  store,
  onPrevMonth,
  onNextMonth,
}: {
  year: number
  month: number
  approvedAbsences: Absence[]
  store: ReturnType<typeof useDemoStore>
  onPrevMonth: () => void
  onNextMonth: () => void
}) {
  const grid = getMonthGrid(year, month)
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  const getLeaveForDate = (dateStr: string | null): string[] => {
    if (!dateStr) return []
    return approvedAbsences
      .filter((a) => a.startDate <= dateStr && a.endDate >= dateStr)
      .map((a) => store.getStaff(a.staffId)?.name ?? 'Unknown')
  }

  return (
    <Card padding="sm" className={styles.calendarCard}>
      <div className={styles.calendarHeader}>
        <Button variant="ghost" size="sm" onClick={onPrevMonth} type="button">
          ←
        </Button>
        <span className={styles.calendarMonthLabel}>{monthLabel}</span>
        <Button variant="ghost" size="sm" onClick={onNextMonth} type="button">
          →
        </Button>
      </div>
      <div className={styles.calendarGrid}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={styles.calendarWeekday}>
            {label}
          </div>
        ))}
        {grid.flat().map((dateStr, idx) => {
          const leave = getLeaveForDate(dateStr)
          const day = dateStr ? dateStr.slice(8, 10) : ''
          return (
            <div
              key={idx}
              className={`${styles.calendarDay} ${leave.length > 0 ? styles.calendarDayHasLeave : ''}`}
            >
              {day && <span className={styles.calendarDayNum}>{day}</span>}
              {leave.length > 0 && (
                <ul className={styles.calendarDayList}>
                  {leave.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export function AbsencesPage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const isAdmin = user?.role === ROLES.ADMIN
  const currentStaffId = store.getStaffList().find((s) => s.email === user?.email)?.id ?? null

  const [showRequestForm, setShowRequestForm] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() + 1 }
  })

  const myAbsences = currentStaffId ? store.getAbsences({ staffId: currentStaffId }) : []
  const pendingAbsences = store.getPendingAbsences()
  const allAbsences = store.getAbsences()
  const approvedAbsences = allAbsences.filter((a) => a.status === ABSENCE_STATUS.APPROVED)

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

  // Mock: use current user's staff id if present, else first admin in store (admin may not be in staff list)
  const decidedBy =
    currentStaffId ??
    store.getStaffList().find((s) => s.role === ROLES.ADMIN)?.id ??
    'admin-mock'

  const handleApprove = (id: string) => {
    if (!isAdmin) return
    store.approveAbsence(id, decidedBy)
  }

  const handleReject = (id: string) => {
    if (!isAdmin) return
    store.rejectAbsence(id, decidedBy)
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

      {isAdmin && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Leave calendar</h2>
          <LeaveCalendar
            year={calendarMonth.year}
            month={calendarMonth.month}
            approvedAbsences={approvedAbsences}
            store={store}
            onPrevMonth={() =>
              setCalendarMonth((prev) =>
                prev.month === 1
                  ? { year: prev.year - 1, month: 12 }
                  : { year: prev.year, month: prev.month - 1 }
              )
            }
            onNextMonth={() =>
              setCalendarMonth((prev) =>
                prev.month === 12
                  ? { year: prev.year + 1, month: 1 }
                  : { year: prev.year, month: prev.month + 1 }
              )
            }
          />
        </section>
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

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES, ROUTES_ROTA, ROLES } from '../../utils/constants'
import { Button, Card, Badge } from '../../components/ui'
import { getWeekRange, formatWeekLabel, addWeek, getWeekDays, formatDayShort } from './weekUtils'
import styles from './RotaPage.module.css'

export function RotaPage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const isAdmin = user?.role === ROLES.ADMIN
  const currentStaffId = isAdmin
    ? null
    : store.getStaffList().find((s) => s.email === user?.email)?.id ?? null

  const [weekStart, setWeekStart] = useState(() => getWeekRange(new Date()).from)
  const { from, to } = getWeekRange(new Date(weekStart + 'T12:00:00'))
  const shifts = store.getShifts(
    currentStaffId ? { from, to, staffId: currentStaffId } : { from, to }
  )
  const weekDays = getWeekDays(from)

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: isAdmin ? 'Rota' : 'My shifts', to: ROUTES.ROTA },
    ])
    return () => setItems([])
  }, [setItems, isAdmin])

  const shiftsByDate = weekDays.reduce((acc, day) => {
    acc[day] = shifts.filter((s) => s.date === day)
    return acc
  }, {} as Record<string, typeof shifts>)

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className="page-title">{isAdmin ? 'Rota' : 'My shifts'}</h1>
        {isAdmin && (
          <Link to={ROUTES_ROTA.NEW}>
            <Button variant="primary">Add shift</Button>
          </Link>
        )}
      </div>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-4)' }}>
        {isAdmin
          ? 'Schedule and assign shifts. Drag or use assign to allocate staff.'
          : 'Your upcoming shifts for this week.'}
      </p>

      <div className={styles.weekNav}>
        <Button variant="ghost" size="sm" onClick={() => setWeekStart(addWeek(from, -1))}>
          ← Previous
        </Button>
        <span className={styles.weekLabel}>{formatWeekLabel(from)}</span>
        <Button variant="ghost" size="sm" onClick={() => setWeekStart(addWeek(from, 1))}>
          Next →
        </Button>
      </div>

      {shifts.length === 0 ? (
        <Card className={styles.emptyCard}>
          <p className="text-muted">
            {isAdmin ? 'No shifts this week. Add a shift to get started.' : 'No shifts scheduled for you this week.'}
          </p>
          {isAdmin && (
            <Link to={ROUTES_ROTA.NEW}>
              <Button variant="primary" className={styles.emptyButton}>
                Add shift
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className={styles.weekGrid}>
          {weekDays.map((day) => (
            <div key={day} className={styles.dayColumn}>
              <div className={styles.dayHeader}>{formatDayShort(day)}</div>
              <div className={styles.shifts}>
                {(shiftsByDate[day] ?? []).map((shift) => (
                  <ShiftCard key={shift.id} shift={shift} isAdmin={isAdmin} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <p className="text-sm text-muted" style={{ marginTop: 'var(--space-4)' }}>
          <Link to={ROUTES_ROTA.MY_SHIFTS}>View my shifts</Link>
        </p>
      )}
    </div>
  )
}

function ShiftCard({
  shift,
  isAdmin,
}: {
  shift: import('../../types/shift').Shift
  isAdmin: boolean
}) {
  const store = useDemoStore()
  const serviceUser = store.getServiceUser(shift.serviceUserId)
  const staff = shift.staffId ? store.getStaff(shift.staffId) : null

  return (
    <Card key={shift.id} padding="sm" className={styles.shiftCard}>
      <div className={styles.shiftTime}>
        {shift.startTime} – {shift.endTime}
      </div>
      <div className={styles.shiftServiceUser}>
        {serviceUser?.name ?? 'Unknown'}
      </div>
      {shift.notes && (
        <div className="text-sm text-muted">{shift.notes}</div>
      )}
      <div className={styles.shiftStaff}>
        {staff ? (
          <Badge variant="default">{staff.name}</Badge>
        ) : (
          <Badge variant="warning">Unassigned</Badge>
        )}
      </div>
      {isAdmin && (
        <div className={styles.shiftActions}>
          <Link to={ROUTES_ROTA.EDIT(shift.id)} className={styles.link}>
            Edit
          </Link>
          <AssignDropdown shift={shift} />
        </div>
      )}
    </Card>
  )
}

function AssignDropdown({ shift }: { shift: import('../../types/shift').Shift }) {
  const store = useDemoStore()
  const [open, setOpen] = useState(false)
  const staffList = store.getStaffList()

  return (
    <div className={styles.dropdownWrap}>
      <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
        {shift.staffId ? 'Change' : 'Assign'}
      </Button>
      {open && (
        <>
          <div className={styles.dropdownBackdrop} onClick={() => setOpen(false)} />
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                store.unassignShift(shift.id)
                setOpen(false)
              }}
            >
              Unassign
            </button>
            {staffList.map((s) => (
              <button
                key={s.id}
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  store.assignShift(shift.id, s.id)
                  setOpen(false)
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

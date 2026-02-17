import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES, ROUTES_ROTA, ROLES } from '../../utils/constants'
import { Button, Card } from '../../components/ui'
import { getWeekRange, formatWeekLabel, addWeek, getWeekDays, formatDayShort } from './weekUtils'
import styles from './RotaPage.module.css'

/**
 * My Shifts: week view filtered to current user's staff profile only.
 * Used when admin clicks "View my shifts" or when staff navigates to Rota (nav can point here for staff).
 */
export function MyShiftsPage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const currentStaffId = store.getStaffList().find((s) => s.email === user?.email)?.id ?? null

  const [weekStart, setWeekStart] = useState(() => getWeekRange(new Date()).from)
  const { from, to } = getWeekRange(new Date(weekStart + 'T12:00:00'))
  const shifts = store.getShifts({ from, to, staffId: currentStaffId ?? undefined })
  const weekDays = getWeekDays(from)

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'My shifts', to: ROUTES_ROTA.MY_SHIFTS },
    ])
    return () => setItems([])
  }, [setItems])

  const shiftsByDate = weekDays.reduce((acc, day) => {
    acc[day] = shifts.filter((s) => s.date === day)
    return acc
  }, {} as Record<string, typeof shifts>)

  const isAdmin = user?.role === ROLES.ADMIN

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className="page-title">My shifts</h1>
        {isAdmin && (
          <Link to={ROUTES.ROTA}>
            <Button variant="secondary">View full rota</Button>
          </Link>
        )}
      </div>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-4)' }}>
        Your shifts for this week. You are signed in as {user?.email}.
      </p>

      {!currentStaffId ? (
        <Card className={styles.emptyCard}>
          <p className="text-muted">
            No staff profile matches your sign-in email. Ask an admin to add you as staff, or sign in with a staff email.
          </p>
        </Card>
      ) : (
        <>
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
              <p className="text-muted">No shifts scheduled for you this week.</p>
            </Card>
          ) : (
            <div className={styles.weekGrid}>
              {weekDays.map((day) => (
                <div key={day} className={styles.dayColumn}>
                  <div className={styles.dayHeader}>{formatDayShort(day)}</div>
                  <div className={styles.shifts}>
                    {(shiftsByDate[day] ?? []).map((shift) => {
                      const serviceUser = store.getServiceUser(shift.serviceUserId)
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
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

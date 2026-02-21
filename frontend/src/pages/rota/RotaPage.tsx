import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES, ROUTES_ROTA, ROLES, STORAGE_KEYS } from '../../utils/constants'
import { Button, Card, Badge, Input } from '../../components/ui'
import { IconUserPlus } from '../../components/icons'
import { getWeekRange, formatWeekLabel, addWeek, getWeekDays, formatDayShort } from './weekUtils'
import { ABSENCE_STATUS } from '../../types/absence'
import styles from './RotaPage.module.css'

export function RotaPage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const isAdmin = user?.role === ROLES.ADMIN
  const currentStaffId = isAdmin
    ? null
    : store.getStaffList().find((s) => s.email === user?.email)?.id ?? null

  const [weekStart, setWeekStart] = useState(() => {
    if (typeof sessionStorage === 'undefined') return getWeekRange(new Date()).from
    const saved = sessionStorage.getItem(STORAGE_KEYS.ROTA_WEEK_START)
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved
    return getWeekRange(new Date()).from
  })
  const [staffFilter, setStaffFilter] = useState(() => {
    if (typeof sessionStorage === 'undefined') return ''
    return sessionStorage.getItem(STORAGE_KEYS.ROTA_STAFF_FILTER) ?? ''
  })
  const [highlightToday, setHighlightToday] = useState(() => {
    if (typeof sessionStorage === 'undefined') return true
    const saved = sessionStorage.getItem(STORAGE_KEYS.ROTA_HIGHLIGHT_TODAY)
    return saved !== 'false'
  })
  const [autoFillResult, setAutoFillResult] = useState<{ assigned: number; skipped: number } | null>(null)
  const [unassignCount, setUnassignCount] = useState<number | null>(null)
  const { from, to } = getWeekRange(new Date(weekStart + 'T12:00:00'))
  const allShifts = store.getShifts(
    currentStaffId ? { from, to, staffId: currentStaffId } : { from, to }
  )
  const shifts =
    isAdmin && staffFilter.trim()
      ? allShifts.filter((shift) => {
          if (!shift.staffId) return true
          const staff = store.getStaff(shift.staffId)
          return staff?.name.toLowerCase().includes(staffFilter.trim().toLowerCase()) ?? false
        })
      : allShifts
  const weekDays = getWeekDays(from)

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: isAdmin ? 'Rota' : 'My shifts', to: ROUTES.ROTA },
    ])
    return () => setItems([])
  }, [setItems, isAdmin])

  useEffect(() => {
    setAutoFillResult(null)
    setUnassignCount(null)
  }, [weekStart])

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.setItem(STORAGE_KEYS.ROTA_WEEK_START, weekStart)
  }, [weekStart])

  useEffect(() => {
    if (typeof sessionStorage === 'undefined' || !isAdmin) return
    sessionStorage.setItem(STORAGE_KEYS.ROTA_STAFF_FILTER, staffFilter)
  }, [isAdmin, staffFilter])

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.setItem(STORAGE_KEYS.ROTA_HIGHLIGHT_TODAY, String(highlightToday))
  }, [highlightToday])

  const unassignedThisWeek = allShifts.filter((s) => !s.staffId).length

  const approvedAbsences = store.absences.filter((a) => a.status === ABSENCE_STATUS.APPROVED)
  const activeStaff = store.getStaffList()
  const isOnLeave = (staffId: string, date: string) =>
    approvedAbsences.some((a) => a.staffId === staffId && a.startDate <= date && a.endDate >= date)
  const isTrainingValidForDate = (staff: { trainingExpiryDate?: string | null }, date: string) => {
    const exp = staff.trainingExpiryDate
    if (!exp) return true
    return date <= exp
  }
  const staffOnLeaveThisWeek = approvedAbsences.filter((a) =>
    weekDays.some((d) => a.startDate <= d && a.endDate >= d)
  )
  const excludedTraining = activeStaff.filter((s) => !isTrainingValidForDate(s, from))
  const eligibleStaff = activeStaff.filter(
    (s) =>
      isTrainingValidForDate(s, from) &&
      !weekDays.some((d) => isOnLeave(s.id, d))
  )

  const shiftsByDate = weekDays.reduce((acc, day) => {
    acc[day] = shifts.filter((s) => s.date === day)
    return acc
  }, {} as Record<string, typeof shifts>)

  const todayISO = new Date().toISOString().slice(0, 10)

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className="page-title">{isAdmin ? 'Rota' : 'My shifts'}</h1>
        {isAdmin && (
          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              onClick={() => {
                const n = store.unassignShiftsInRange(from, to)
                setUnassignCount(n)
                setAutoFillResult(null)
              }}
            >
              Unassign this week
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const result = store.autoFillRota(from, to)
                setAutoFillResult(result)
                setUnassignCount(null)
              }}
            >
              Auto-Fill
            </Button>
            <Link to={ROUTES_ROTA.NEW}>
              <Button variant="primary">Add shift</Button>
            </Link>
          </div>
        )}
      </div>
      {isAdmin && (
        <div className={styles.staffFilterWrap}>
          <Input
            type="search"
            label="Filter by carer"
            placeholder="Search by name..."
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className={styles.staffFilterInput}
            aria-label="Filter rota by carer name"
          />
          {staffFilter.trim() && (
            <>
              <span className={styles.filterHint}>
                Showing shifts for carers matching &quot;{staffFilter.trim()}&quot; and unassigned shifts
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStaffFilter('')}
                type="button"
              >
                Clear filter
              </Button>
            </>
          )}
        </div>
      )}
      {isAdmin && (
        <p className={styles.intro}>
          {unassignedThisWeek > 0
            ? `${unassignedThisWeek} shift(s) need assignment. Use Auto-Fill or pick staff per shift.`
            : 'All shifts assigned. Add shifts or change assignments below.'}
        </p>
      )}
      {!isAdmin && (
        <p className={styles.intro}>Your shifts for this week.</p>
      )}

      {isAdmin && (unassignCount !== null && unassignCount > 0) && (
        <div className={styles.resultBanner} role="status">
          <span className={styles.resultText}>
            {unassignCount} shift(s) unassigned. Click <strong>Auto-Fill</strong> to assign.
          </span>
        </div>
      )}
      {isAdmin && autoFillResult && (autoFillResult.assigned > 0 || autoFillResult.skipped > 0) && (
        <div
          className={`${styles.resultBanner} ${autoFillResult.skipped > 0 ? styles.resultBannerWarning : styles.resultBannerSuccess}`}
          role="status"
        >
          <span className={styles.resultText}>
            {autoFillResult.assigned > 0 && `Assigned ${autoFillResult.assigned} shift(s).`}
            {autoFillResult.skipped > 0 && ` ${autoFillResult.skipped} skipped (no eligible staff or overlap).`}
          </span>
        </div>
      )}

      {isAdmin && (
        <div className={styles.eligibilityStrip}>
          <span className={styles.eligibilityTitle}>Who Auto-Fill can assign</span>
          <div className={styles.eligibilityBadges}>
            <span className={styles.eligibilityBadgeSuccess}>
              {eligibleStaff.length} eligible
            </span>
            {staffOnLeaveThisWeek.length > 0 && (
              <span className={styles.eligibilityBadgeLeave}>
                {staffOnLeaveThisWeek.length} on leave
              </span>
            )}
            {excludedTraining.length > 0 && (
              <span className={styles.eligibilityBadgeTraining}>
                {excludedTraining.length} training expired
              </span>
            )}
          </div>
          <details className={styles.eligibilityDetails}>
            <summary>See names</summary>
            <div className={styles.eligibilityGrid}>
              <div>
                <span className={styles.eligibilityLabel}>Eligible</span>
                <ul className={styles.eligibilityList}>
                  {eligibleStaff.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                  {eligibleStaff.length === 0 && <li className="text-muted">None</li>}
                </ul>
              </div>
              <div>
                <span className={styles.eligibilityLabel}>On leave this week</span>
                <ul className={styles.eligibilityList}>
                  {staffOnLeaveThisWeek.map((a) => {
                    const s = store.getStaff(a.staffId)
                    return (
                      <li key={a.id}>
                        {s?.name} ({a.startDate} – {a.endDate})
                      </li>
                    )
                  })}
                  {staffOnLeaveThisWeek.length === 0 && <li className="text-muted">None</li>}
                </ul>
              </div>
              <div>
                <span className={styles.eligibilityLabel}>Training expired</span>
                <ul className={styles.eligibilityList}>
                  {excludedTraining.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                  {excludedTraining.length === 0 && <li className="text-muted">None</li>}
                </ul>
              </div>
            </div>
          </details>
        </div>
      )}

      <div className={styles.weekNav}>
        <Button variant="ghost" size="sm" onClick={() => setWeekStart(addWeek(from, -1))}>
          ← Previous
        </Button>
        <span className={styles.weekLabel}>{formatWeekLabel(from)}</span>
        <Button variant="ghost" size="sm" onClick={() => setWeekStart(addWeek(from, 1))}>
          Next →
        </Button>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekStart(getWeekRange(new Date()).from)}
            type="button"
          >
            Today
          </Button>
        )}
      </div>
      {shifts.length > 0 && weekDays.includes(todayISO) && (
        <p className={styles.todayColumnHint} role="status">
          {highlightToday ? (
            <>
              Today&apos;s column is highlighted.{' '}
              <button
                type="button"
                className={styles.todayColumnToggle}
                onClick={() => setHighlightToday(false)}
                aria-pressed="true"
              >
                Hide highlight
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.todayColumnToggle}
                onClick={() => setHighlightToday(true)}
                aria-pressed="false"
              >
                Highlight today&apos;s column
              </button>
            </>
          )}
        </p>
      )}
      {shifts.length > 0 && (
        <p className={styles.swipeHint} aria-hidden>
          Swipe left or right for other days
        </p>
      )}

      {shifts.length === 0 ? (
        <Card className={styles.emptyCard}>
          {isAdmin && staffFilter.trim() && allShifts.length > 0 ? (
            <>
              <p className="text-muted">
                No carers match &quot;{staffFilter.trim()}&quot;. Clear the filter to see all shifts.
              </p>
              <Button
                variant="secondary"
                className={styles.emptyButton}
                onClick={() => setStaffFilter('')}
                type="button"
              >
                Clear filter
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </Card>
      ) : (
        <div className={styles.weekGrid}>
          {weekDays.map((day) => (
            <div
              key={day}
              className={`${styles.dayColumn} ${day === todayISO && highlightToday ? styles.dayColumnToday : ''}`}
              aria-current={day === todayISO && highlightToday ? 'date' : undefined}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayHeaderTitle}>{formatDayShort(day)}</span>
                {day === todayISO && highlightToday && (
                  <span className={styles.todayLabel} aria-hidden="false">
                    Today
                  </span>
                )}
              </div>
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
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [assignSearch, setAssignSearch] = useState('')
  const buttonRef = useRef<HTMLDivElement>(null)
  const approvedAbsences = store.getAbsences({ status: ABSENCE_STATUS.APPROVED })
  const isOnLeave = (staffId: string, date: string) =>
    approvedAbsences.some(
      (a) => a.staffId === staffId && a.startDate <= date && a.endDate >= date
    )
  const staffList = store
    .getStaffList()
    .filter((s) => !isOnLeave(s.id, shift.date))
  const filteredStaff =
    assignSearch.trim() === ''
      ? staffList
      : staffList.filter((s) =>
          s.name.toLowerCase().includes(assignSearch.trim().toLowerCase())
        )
  const showSearch = staffList.length > 5

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 4, left: rect.left })
      setAssignSearch('')
    }
    setOpen((o) => !o)
  }

  return (
    <div className={styles.dropdownWrap} ref={buttonRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        type="button"
        aria-label={shift.staffId ? 'Change assignment' : 'Assign staff'}
        title={shift.staffId ? 'Change' : 'Assign'}
      >
        <IconUserPlus style={{ width: 18, height: 18 }} />
      </Button>
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className={styles.dropdownBackdrop}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              className={styles.dropdown}
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                marginTop: 0,
              }}
              role="listbox"
              aria-label="Assign staff"
            >
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
              {showSearch && (
                <div className={styles.dropdownSearch} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="search"
                    placeholder="Search staff..."
                    value={assignSearch}
                    onChange={(e) => setAssignSearch(e.target.value)}
                    className={styles.dropdownSearchInput}
                    autoFocus
                    aria-label="Filter staff by name"
                  />
                </div>
              )}
              {filteredStaff.map((s) => (
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
              {showSearch && filteredStaff.length === 0 && (
                <div className={styles.dropdownEmpty}>No staff match</div>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  )
}

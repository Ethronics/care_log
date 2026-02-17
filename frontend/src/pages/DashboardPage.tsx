import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../components/ui'
import { useBreadcrumbs } from '../contexts/BreadcrumbContext'
import { useDemoStore } from '../store/demoStoreContext'
import { getUser } from '../utils/auth'
import {
  ROUTES,
  ROUTES_ROTA,
  ROUTES_SERVICE_USERS,
  ROUTES_ABSENCES,
  ROLES,
} from '../utils/constants'
import styles from './DashboardPage.module.css'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'pm' : 'am'
  const h12 = hour % 12 || 12
  return `${h12}:${m}${ampm}`
}

function formatDateShort(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function DashboardPage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const isAdmin = user?.role === ROLES.ADMIN
  const currentStaffId = store.getStaffList().find((s) => s.email === user?.email)?.id ?? null
  const importInputRef = useRef<HTMLInputElement>(null)

  const today = todayISO()
  const todayEnd = today
  const nextWeekEnd = addDays(today, 7)

  const todayShifts = store.getShifts({ from: today, to: todayEnd })
  const unassignedToday = todayShifts.filter((s) => !s.staffId)
  const pendingLeave = store.getPendingAbsences()
  const recentLogs = store.getCareLogs({ limit: 5 })

  const myTodayShifts = currentStaffId
    ? store.getShifts({ from: today, to: todayEnd, staffId: currentStaffId })
    : []
  const myUpcomingShifts = currentStaffId
    ? store.getShifts({ from: today, to: nextWeekEnd, staffId: currentStaffId })
    : []

  useEffect(() => {
    setItems([{ label: 'Home', to: ROUTES.HOME }, { label: 'Dashboard' }])
    return () => setItems([])
  }, [setItems])

  if (isAdmin) {
    return (
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
          Overview and quick actions.
        </p>

        <div className={styles.quickActions}>
          <Link to={ROUTES_ROTA.NEW}>
            <Button variant="primary" size="sm">Add shift</Button>
          </Link>
          <Link to={ROUTES.ROTA}>
            <Button variant="secondary" size="sm">View rota</Button>
          </Link>
          <Link to={ROUTES_ABSENCES.LIST}>
            <Button variant="secondary" size="sm">Leave requests</Button>
          </Link>
          <Link to={ROUTES_SERVICE_USERS.LIST}>
            <Button variant="secondary" size="sm">Service users</Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={() => store.exportDataAsJson()}>
            Export data (JSON)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => importInputRef.current?.click()}
          >
            Import data (JSON)
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            className={styles.fileInput}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                store.importDataFromJson(file)
                e.target.value = ''
              }
            }}
          />
        </div>

        <div className="dashboard-grid">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s shifts</CardTitle>
              <Badge variant="info">{todayShifts.length}</Badge>
            </CardHeader>
            <CardContent>
              {todayShifts.length === 0 ? (
                <p className="text-muted text-sm">No shifts today.</p>
              ) : (
                <ul className={styles.miniList}>
                  {todayShifts.slice(0, 5).map((s) => {
                    const su = store.getServiceUser(s.serviceUserId)
                    const staff = s.staffId ? store.getStaff(s.staffId) : null
                    return (
                      <li key={s.id}>
                        <span className={styles.time}>{formatTime(s.startTime)}–{formatTime(s.endTime)}</span>
                        <span className={styles.name}>{su?.name}</span>
                        {staff ? (
                          <Badge variant="default" className={styles.badge}>{staff.name}</Badge>
                        ) : (
                          <Badge variant="warning" className={styles.badge}>Unassigned</Badge>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
              <Link to={ROUTES.ROTA} className={styles.cardLink}>View rota →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unassigned shifts</CardTitle>
              <Badge variant={unassignedToday.length > 0 ? 'warning' : 'success'}>
                {unassignedToday.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">
                {unassignedToday.length === 0
                  ? 'All today\'s shifts are covered.'
                  : `${unassignedToday.length} shift(s) need assignment.`}
              </p>
              <Link to={ROUTES.ROTA} className={styles.cardLink}>Assign on rota →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending leave</CardTitle>
              <Badge variant={pendingLeave.length > 0 ? 'warning' : 'default'}>
                {pendingLeave.length}
              </Badge>
            </CardHeader>
            <CardContent>
              {pendingLeave.length === 0 ? (
                <p className="text-muted text-sm">No pending requests.</p>
              ) : (
                <ul className={styles.miniList}>
                  {pendingLeave.slice(0, 3).map((a) => {
                    const staff = store.getStaff(a.staffId)
                    return (
                      <li key={a.id}>
                        <span className={styles.name}>{staff?.name}</span>
                        <span className={styles.meta}>{a.startDate} – {a.endDate}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
              <Link to={ROUTES_ABSENCES.LIST} className={styles.cardLink}>Review leave →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent care logs</CardTitle>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <p className="text-muted text-sm">No care logs yet.</p>
              ) : (
                <ul className={styles.miniList}>
                  {recentLogs.map((log) => {
                    const su = store.getServiceUser(log.serviceUserId)
                    const author = store.getStaff(log.authorId)
                    return (
                      <li key={log.id}>
                        <span className={styles.name}>{su?.name}</span>
                        <span className={styles.meta}>{author?.name} · {log.type}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
              <Link to={ROUTES.CARE_LOGS} className={styles.cardLink}>View all →</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">My dashboard</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Your shifts and quick actions.
      </p>

      <div className={styles.quickActions}>
        <Link to={ROUTES_ROTA.MY_SHIFTS}>
          <Button variant="primary" size="sm">My shifts</Button>
        </Link>
        <Link to={ROUTES_SERVICE_USERS.LIST}>
          <Button variant="secondary" size="sm">Service users</Button>
        </Link>
        <Link to={ROUTES.CARE_LOGS}>
          <Button variant="secondary" size="sm">Care logs</Button>
        </Link>
        <Link to={ROUTES_ABSENCES.LIST}>
          <Button variant="secondary" size="sm">Request leave</Button>
        </Link>
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s shifts</CardTitle>
            <Badge variant="info">{myTodayShifts.length}</Badge>
          </CardHeader>
          <CardContent>
            {myTodayShifts.length === 0 ? (
              <p className="text-muted text-sm">No shifts scheduled for you today.</p>
            ) : (
              <ul className={styles.miniList}>
                {myTodayShifts.map((s) => {
                  const su = store.getServiceUser(s.serviceUserId)
                  return (
                    <li key={s.id}>
                      <span className={styles.time}>{formatTime(s.startTime)}–{formatTime(s.endTime)}</span>
                      <span className={styles.name}>{su?.name}</span>
                    </li>
                  )
                })}
              </ul>
            )}
            <Link to={ROUTES_ROTA.MY_SHIFTS} className={styles.cardLink}>My shifts →</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming (7 days)</CardTitle>
            <Badge variant="default">{myUpcomingShifts.length}</Badge>
          </CardHeader>
          <CardContent>
            {myUpcomingShifts.length === 0 ? (
              <p className="text-muted text-sm">No upcoming shifts.</p>
            ) : (
              <ul className={styles.miniList}>
                {myUpcomingShifts.slice(0, 5).map((s) => {
                  const su = store.getServiceUser(s.serviceUserId)
                  return (
                    <li key={s.id}>
                      <span className={styles.date}>{formatDateShort(s.date)}</span>
                      <span className={styles.time}>{formatTime(s.startTime)}</span>
                      <span className={styles.name}>{su?.name}</span>
                    </li>
                  )
                })}
              </ul>
            )}
            <Link to={ROUTES_ROTA.MY_SHIFTS} className={styles.cardLink}>My shifts →</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={styles.quickLinks}>
              <li><Link to={ROUTES_SERVICE_USERS.LIST}>Service users</Link></li>
              <li><Link to={ROUTES.CARE_LOGS}>Care logs</Link></li>
              <li><Link to={ROUTES_ABSENCES.LIST}>Request leave</Link></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

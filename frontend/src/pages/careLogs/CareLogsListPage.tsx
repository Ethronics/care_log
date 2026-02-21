import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_SERVICE_USERS, ROUTES_CARE_LOGS } from '../../utils/constants'
import { Card, Badge, Button, SearchableSelect } from '../../components/ui'
import { TYPE_LABELS } from './CareLogForm'
import type { CareLogType } from '../../types/careLog'
import styles from './CareLogsListPage.module.css'

const TYPE_VARIANT: Record<CareLogType, 'info' | 'success' | 'warning' | 'default'> = {
  food: 'success',
  medication: 'info',
  mood: 'warning',
  general: 'default',
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function CareLogsListPage() {
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const [serviceUserFilter, setServiceUserFilter] = useState<string>('')

  const serviceUsers = store.getServiceUserList()
  const logs = store.getCareLogs(
    serviceUserFilter
      ? { serviceUserId: serviceUserFilter, limit: 100 }
      : { limit: 50 }
  )

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Care logs', to: ROUTES.CARE_LOGS },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <div className="container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className="page-title">Care logs</h1>
          <p className="body-text text-muted" style={{ marginBottom: 0 }}>
            Carers record visits and observations here. Open a service user to take a log.
          </p>
        </div>
        <Link to={ROUTES_SERVICE_USERS.LIST}>
          <Button variant="primary" size="sm">Take a log</Button>
        </Link>
      </div>

      <div className={styles.filter}>
        <SearchableSelect
          label="Filter by service user"
          options={serviceUsers.map((u) => ({ id: u.id, label: u.name }))}
          value={serviceUserFilter}
          onChange={setServiceUserFilter}
          allowEmpty
          emptyLabel="All"
          placeholder="Search service users…"
          aria-label="Filter care logs by service user"
          listMaxHeight={320}
        />
      </div>

      {logs.length === 0 ? (
        <Card className={styles.emptyCard}>
          <p className="text-muted">
            {serviceUserFilter
              ? 'No care logs for this service user.'
              : 'No care logs yet. Use “Take a log” to open a service user and record a care log.'}
          </p>
          {!serviceUserFilter && (
            <Link to={ROUTES_SERVICE_USERS.LIST} className={styles.link}>
              Choose a service user to take a log
            </Link>
          )}
        </Card>
      ) : (
        <ul className={styles.list}>
          {logs.map((log) => {
            const serviceUser = store.getServiceUser(log.serviceUserId)
            const author = store.getStaff(log.authorId)
            return (
              <li key={log.id} className={styles.entry}>
                <Card padding="sm" className={styles.card}>
                  <div className={styles.entryHeader}>
                    <Badge variant={TYPE_VARIANT[log.type]}>
                      {TYPE_LABELS[log.type]}
                    </Badge>
                    <span className={styles.meta}>
                      {author?.name ?? 'Unknown'} · {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  <Link
                    to={ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId)}
                    className={styles.serviceUserLink}
                  >
                    {serviceUser?.name ?? 'Unknown'}
                  </Link>
                  <p className={styles.content}>{log.content}</p>
                  <Link to={ROUTES_CARE_LOGS.EDIT(log.id)} className={styles.editLink}>
                    Edit
                  </Link>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

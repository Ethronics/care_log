import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES_CARE_LOGS, ROLES } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui'
import { CareLogForm, TYPE_LABELS } from './CareLogForm'
import type { CareLogFormValues } from './CareLogForm'
import type { CareLog } from '../../types/careLog'
import styles from './CareTimeline.module.css'

const TYPE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

interface CareTimelineProps {
  serviceUserId: string
  serviceUserName: string
}

export function CareTimeline({ serviceUserId, serviceUserName }: CareTimelineProps) {
  const store = useDemoStore()
  const user = getUser()
  const currentStaffId = store.getStaffList().find((s) => s.email === user?.email)?.id ?? null
  const logs = store.getCareLogsByServiceUser(serviceUserId)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (values: CareLogFormValues) => {
    if (!currentStaffId) return
    setIsSubmitting(true)
    store.addCareLog({
      serviceUserId,
      authorId: currentStaffId,
      type: values.type,
      content: values.content.trim(),
    })
    setIsSubmitting(false)
    setShowForm(false)
  }

  return (
    <Card className={styles.timelineCard}>
      <CardHeader>
        <CardTitle>Care timeline</CardTitle>
        {currentStaffId && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? 'Cancel' : 'Add log'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showForm && currentStaffId && (
          <div className={styles.formWrap}>
            <CareLogForm
              onSubmit={handleSubmit}
              submitLabel="Add log"
              isSubmitting={isSubmitting}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
        {logs.length === 0 && !showForm ? (
          <p className="text-muted text-sm">No care logs yet. Add a log to record visits and observations.</p>
        ) : (
          <ul className={styles.timeline}>
            {logs.map((log) => (
              <CareLogEntry key={log.id} log={log} store={store} currentStaffId={currentStaffId} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function CareLogEntry({
  log,
  store,
  currentStaffId,
}: {
  log: CareLog
  store: ReturnType<typeof useDemoStore>
  currentStaffId: string | null
}) {
  const author = store.getStaff(log.authorId)
  const user = getUser()
  const isAdmin = user?.role === ROLES.ADMIN
  const canEdit = isAdmin || currentStaffId === log.authorId

  return (
    <li className={styles.entry}>
      <div className={styles.entryHeader}>
        <Badge variant={TYPE_VARIANT[log.type] ?? 'default'}>
          {TYPE_LABELS[log.type]}
        </Badge>
        <span className={styles.entryMeta}>
          {author?.name ?? 'Unknown'} · {formatDateTime(log.createdAt)}
        </span>
      </div>
      <p className={styles.entryContent}>{log.content}</p>
      {canEdit && (
        <div className={styles.entryActions}>
          <Link to={ROUTES_CARE_LOGS.EDIT(log.id)} className={styles.link}>
            Edit
          </Link>
        </div>
      )}
    </li>
  )
}

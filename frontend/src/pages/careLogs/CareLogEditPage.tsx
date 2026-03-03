import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES, ROUTES_SERVICE_USERS, ROLES } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent, Button, ConfirmDialog } from '../../components/ui'
import { CareLogForm, careLogToFormValues, type CareLogFormValues } from './CareLogForm'
import styles from './CareLogEditPage.module.css'

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours for non-admin authors

function isWithinEditWindow(createdAt: string, isAdmin: boolean): boolean {
  if (isAdmin) return true
  return Date.now() - new Date(createdAt).getTime() <= EDIT_WINDOW_MS
}

export function CareLogEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const log = id ? store.getCareLog(id) : undefined
  const serviceUser = log ? store.getServiceUser(log.serviceUserId) : undefined
  const currentStaffId = store.getStaffList().find((s) => s.email === user?.email)?.id ?? null
  const isAdmin = user?.role === ROLES.ADMIN
  const isAuthor = log && currentStaffId === log.authorId
  const withinTimeWindow = log && isWithinEditWindow(log.createdAt, isAdmin)
  const canEdit = log && (isAdmin || isAuthor) && withinTimeWindow
  const isAuthorOutsideWindow = log && isAuthor && !withinTimeWindow

  useEffect(() => {
    if (log && serviceUser) {
      setItems([
        { label: 'Home', to: ROUTES.HOME },
        { label: 'Care logs', to: ROUTES.CARE_LOGS },
        { label: serviceUser.name, to: ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId) },
        { label: 'Edit log' },
      ])
    }
    return () => setItems([])
  }, [log, serviceUser, setItems])

  useEffect(() => {
    if (id && !log) {
      navigate(ROUTES.CARE_LOGS, { replace: true })
      return
    }
    if (log && !canEdit && !isAuthorOutsideWindow) {
      navigate(ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId), { replace: true })
    }
  }, [id, log, canEdit, isAuthorOutsideWindow, navigate])

  const handleSubmit = (values: CareLogFormValues) => {
    if (!id) return
    setIsSubmitting(true)
    const update: { type: CareLogFormValues['type']; content: string; rawContent?: string } = {
      type: values.type,
      content: values.content.trim(),
    }
    if (values.rawContent !== undefined) update.rawContent = values.rawContent
    store.updateCareLog(id, update)
    setIsSubmitting(false)
    navigate(ROUTES_SERVICE_USERS.DETAIL(log!.serviceUserId))
  }

  const handleDelete = () => {
    if (!id || !log) return
    store.deleteCareLog(id)
    setShowDeleteConfirm(false)
    navigate(ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId))
  }

  if (!log || !serviceUser) return null

  if (!canEdit && !isAuthorOutsideWindow) return null

  if (isAuthorOutsideWindow) {
    return (
      <div className="container">
        <Link
          to={ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId)}
          className="text-sm text-muted"
          style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
        >
          ← Back to {serviceUser.name}
        </Link>
        <h1 className="page-title">Edit care log</h1>
        <p className="body-text text-muted" style={{ marginBottom: 'var(--space-4)' }}>
          You can only edit your own care logs within 24 hours of creation. This log is older. Contact a manager if a change is required.
        </p>
        <Link to={ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId)}>
          <Button variant="secondary">Back to {serviceUser.name}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <Link
        to={ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId)}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to {serviceUser.name}
      </Link>
      <h1 className="page-title">Edit care log</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Update this log entry for {serviceUser.name}.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Log entry</CardTitle>
        </CardHeader>
        <CardContent>
          {log.rawContent?.trim() && (
            <details className={styles.rawDetails}>
              <summary>View raw transcript</summary>
              <pre className={styles.rawBlock}>{log.rawContent}</pre>
            </details>
          )}
          <CareLogForm
            initialValues={careLogToFormValues(log)}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
            showVoiceAndSummarize={true}
          />
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete log
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete care log"
        message="This log entry will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

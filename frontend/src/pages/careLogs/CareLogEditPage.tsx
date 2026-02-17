import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser } from '../../utils/auth'
import { ROUTES, ROUTES_CARE_LOGS, ROUTES_SERVICE_USERS, ROLES } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent, Button, ConfirmDialog } from '../../components/ui'
import { CareLogForm, careLogToFormValues, type CareLogFormValues } from './CareLogForm'

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
  const canEdit = log && (isAdmin || currentStaffId === log.authorId)

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
    if (log && !canEdit) {
      navigate(ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId), { replace: true })
    }
  }, [id, log, canEdit, navigate])

  const handleSubmit = (values: CareLogFormValues) => {
    if (!id) return
    setIsSubmitting(true)
    store.updateCareLog(id, { type: values.type, content: values.content.trim() })
    setIsSubmitting(false)
    navigate(ROUTES_SERVICE_USERS.DETAIL(log!.serviceUserId))
  }

  const handleDelete = () => {
    if (!id || !log) return
    store.deleteCareLog(id)
    setShowDeleteConfirm(false)
    navigate(ROUTES_SERVICE_USERS.DETAIL(log.serviceUserId))
  }

  if (!log || !serviceUser || !canEdit) return null

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
          <CareLogForm
            initialValues={careLogToFormValues(log)}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
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

import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_ROTA } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent, Button, ConfirmDialog } from '../../components/ui'
import { ShiftForm, shiftToFormValues, type ShiftFormValues } from './ShiftForm'

export function ShiftEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const shift = id ? store.getShift(id) : undefined
  const serviceUserOptions = store.getServiceUserList().map((u) => ({ id: u.id, name: u.name }))
  const staffOptions = store.getStaffList().map((s) => ({ id: s.id, name: s.name }))

  useEffect(() => {
    if (shift) {
      const su = store.getServiceUser(shift.serviceUserId)
      setItems([
        { label: 'Home', to: ROUTES.HOME },
        { label: 'Rota', to: ROUTES.ROTA },
        { label: su?.name ?? 'Shift' },
      ])
    }
    return () => setItems([])
  }, [shift, store, setItems])

  useEffect(() => {
    if (id && !shift) {
      navigate(ROUTES.ROTA, { replace: true })
    }
  }, [id, shift, navigate])

  const handleSubmit = (values: ShiftFormValues) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      store.updateShift(id, {
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        serviceUserId: values.serviceUserId,
        staffId: values.staffId || null,
        notes: values.notes.trim(),
      })
      navigate(ROUTES.ROTA)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (!id) return
    store.deleteShift(id)
    setShowDeleteConfirm(false)
    navigate(ROUTES.ROTA)
  }

  if (!shift) return null

  return (
    <div className="container">
      <Link
        to={ROUTES.ROTA}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to rota
      </Link>
      <h1 className="page-title">Edit shift</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        {shift.date} · {shift.startTime} – {shift.endTime}
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Shift details</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftForm
            initialValues={shiftToFormValues(shift)}
            serviceUserOptions={serviceUserOptions}
            staffOptions={staffOptions}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
          />
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete shift
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete shift"
        message="This shift will be removed from the rota. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

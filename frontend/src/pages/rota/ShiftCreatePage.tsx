import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { ShiftForm, type ShiftFormValues } from './ShiftForm'

export function ShiftCreatePage() {
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const serviceUserOptions = store.getServiceUserList().map((u) => ({ id: u.id, name: u.name }))
  const staffOptions = store.getStaffList().map((s) => ({ id: s.id, name: s.name }))

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Rota', to: ROUTES.ROTA },
      { label: 'Add shift' },
    ])
    return () => setItems([])
  }, [setItems])

  const defaultDate = new Date().toISOString().slice(0, 10)

  const handleSubmit = (values: ShiftFormValues) => {
    setIsSubmitting(true)
    try {
      store.addShift({
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

  return (
    <div className="container">
      <Link
        to={ROUTES.ROTA}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to rota
      </Link>
      <h1 className="page-title">Add shift</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Create a new shift and optionally assign a staff member.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Shift details</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftForm
            initialValues={{
              date: defaultDate,
              startTime: '09:00',
              endTime: '17:00',
              serviceUserId: '',
              staffId: '',
              notes: '',
            }}
            serviceUserOptions={serviceUserOptions}
            staffOptions={staffOptions}
            onSubmit={handleSubmit}
            submitLabel="Add shift"
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

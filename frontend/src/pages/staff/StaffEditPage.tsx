import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_STAFF } from '../../utils/constants'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { StaffForm, staffToFormValues, type StaffFormValues } from './StaffForm'

export function StaffEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const { getStaff, updateStaff } = useDemoStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const staff = id ? getStaff(id) : undefined

  useEffect(() => {
    if (staff) {
      setItems([
        { label: 'Home', to: ROUTES.HOME },
        { label: 'Staff', to: ROUTES.STAFF },
        { label: staff.name },
      ])
    }
    return () => setItems([])
  }, [staff, setItems])

  useEffect(() => {
    if (id && !staff) {
      navigate(ROUTES_STAFF.LIST, { replace: true })
    }
  }, [id, staff, navigate])

  const handleSubmit = (values: StaffFormValues) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      updateStaff(id, {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        role: values.role,
        staffLevel: values.staffLevel || undefined,
        trainingExpiryDate: values.trainingExpiryDate.trim() || undefined,
        contractedHoursPerWeek: values.contractedHoursPerWeek.trim()
          ? Number(values.contractedHoursPerWeek)
          : undefined,
        dbsCheckExpiry: values.dbsCheckExpiry.trim() || undefined,
        safeguardingCompletedDate: values.safeguardingCompletedDate.trim() || undefined,
      })
      navigate(ROUTES_STAFF.LIST)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!staff) return null

  return (
    <div className="container">
      <Link to={ROUTES.STAFF} className="text-sm text-muted" style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}>
        ← Back to staff
      </Link>
      <h1 className="page-title">Edit staff</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Update {staff.name}&apos;s profile.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffForm
            initialValues={staffToFormValues(staff)}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

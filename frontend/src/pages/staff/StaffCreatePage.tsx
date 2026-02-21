import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_STAFF } from '../../utils/constants'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { StaffForm, type StaffFormValues } from './StaffForm'

export function StaffCreatePage() {
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const { addStaff } = useDemoStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Staff', to: ROUTES.STAFF },
      { label: 'Add staff' },
    ])
    return () => setItems([])
  }, [setItems])

  const handleSubmit = (values: StaffFormValues) => {
    setIsSubmitting(true)
    try {
      const staff =       addStaff({
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
      navigate(ROUTES_STAFF.EDIT(staff.id))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <Link to={ROUTES.STAFF} className="text-sm text-muted" style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}>
        ← Back to staff
      </Link>
      <h1 className="page-title">Add staff</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Create a new team member profile.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffForm
            onSubmit={handleSubmit}
            submitLabel="Add staff"
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

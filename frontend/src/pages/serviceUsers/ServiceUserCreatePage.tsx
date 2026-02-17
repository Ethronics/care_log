import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_SERVICE_USERS } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { ServiceUserForm, type ServiceUserFormValues } from './ServiceUserForm'

export function ServiceUserCreatePage() {
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const { addServiceUser } = useDemoStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Service users', to: ROUTES.SERVICE_USERS },
      { label: 'Add service user' },
    ])
    return () => setItems([])
  }, [setItems])

  const handleSubmit = (values: ServiceUserFormValues) => {
    setIsSubmitting(true)
    try {
      const user = addServiceUser({
        name: values.name.trim(),
        dateOfBirth: values.dateOfBirth,
        medicalInfo: values.medicalInfo.trim(),
        emergencyContacts: values.emergencyContacts,
        preferences: values.preferences.trim(),
      })
      navigate(ROUTES_SERVICE_USERS.DETAIL(user.id))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <Link
        to={ROUTES_SERVICE_USERS.LIST}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to service users
      </Link>
      <h1 className="page-title">Add service user</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Create a profile for someone receiving care.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceUserForm
            onSubmit={handleSubmit}
            submitLabel="Add service user"
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

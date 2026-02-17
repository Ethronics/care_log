import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { ROUTES, ROUTES_SERVICE_USERS } from '../../utils/constants'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { ServiceUserForm, serviceUserToFormValues, type ServiceUserFormValues } from './ServiceUserForm'

export function ServiceUserEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const { getServiceUser, updateServiceUser } = useDemoStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const user = id ? getServiceUser(id) : undefined

  useEffect(() => {
    if (user) {
      setItems([
        { label: 'Home', to: ROUTES.HOME },
        { label: 'Service users', to: ROUTES.SERVICE_USERS },
        { label: user.name, to: ROUTES_SERVICE_USERS.DETAIL(user.id) },
        { label: 'Edit' },
      ])
    }
    return () => setItems([])
  }, [user, setItems])

  useEffect(() => {
    if (id && !user) {
      navigate(ROUTES_SERVICE_USERS.LIST, { replace: true })
    }
  }, [id, user, navigate])

  const handleSubmit = (values: ServiceUserFormValues) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      updateServiceUser(id, {
        name: values.name.trim(),
        dateOfBirth: values.dateOfBirth,
        medicalInfo: values.medicalInfo.trim(),
        emergencyContacts: values.emergencyContacts,
        preferences: values.preferences.trim(),
      })
      navigate(ROUTES_SERVICE_USERS.DETAIL(id))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="container">
      <Link
        to={ROUTES_SERVICE_USERS.DETAIL(id!)}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to {user.name}
      </Link>
      <h1 className="page-title">Edit service user</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        Update {user.name}&apos;s profile.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceUserForm
            initialValues={serviceUserToFormValues(user)}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

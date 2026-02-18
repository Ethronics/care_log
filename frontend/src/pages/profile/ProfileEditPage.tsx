import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert } from '../../components/ui'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { useDemoStore } from '../../store/demoStoreContext'
import { getUser, setUser } from '../../utils/auth'
import { ROUTES, ROUTES_PROFILE } from '../../utils/constants'
import styles from './ProfilePage.module.css'

export function ProfileEditPage() {
  const navigate = useNavigate()
  const { setItems } = useBreadcrumbs()
  const store = useDemoStore()
  const user = getUser()
  const staff = user?.email
    ? store.getStaffList({ includeInactive: true }).find((s) => s.email === user.email)
    : null

  const [name, setName] = useState(staff?.name ?? user?.name ?? '')
  const [phone, setPhone] = useState(staff?.phone ?? '')
  const [displayName, setDisplayName] = useState(user?.name ?? '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (staff) {
      setName(staff.name)
      setPhone(staff.phone)
    }
    setDisplayName(user?.name ?? '')
  }, [staff, user])

  useEffect(() => {
    setItems([
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Profile', to: ROUTES_PROFILE.VIEW },
      { label: 'Edit' },
    ])
    return () => setItems([])
  }, [setItems])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (staff) {
      const trimmedName = name.trim()
      if (!trimmedName) {
        setError('Name is required.')
        return
      }
      setIsSubmitting(true)
      try {
        store.updateStaff(staff.id, { name: trimmedName, phone: phone.trim() })
        setUser({ ...user!, name: trimmedName })
        navigate(ROUTES_PROFILE.VIEW)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsSubmitting(true)
      try {
        setUser({ ...user!, name: displayName.trim() || undefined })
        navigate(ROUTES_PROFILE.VIEW)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (!user) return null

  return (
    <div className="container">
      <Link
        to={ROUTES_PROFILE.VIEW}
        className="text-sm text-muted"
        style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}
      >
        ← Back to profile
      </Link>
      <h1 className="page-title">Edit profile</h1>
      <p className="body-text text-muted" style={{ marginBottom: 'var(--space-6)' }}>
        {staff
          ? 'Update your name and phone. Email and role are managed by an admin.'
          : 'Set a display name for this account.'}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>{staff ? 'Your details' : 'Display name'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <Alert variant="error" className={styles.alert}>
                {error}
              </Alert>
            )}
            {staff ? (
              <>
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  autoComplete="name"
                />
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900000"
                  type="tel"
                  autoComplete="tel"
                />
                <p className="text-sm text-muted">
                  Email and role cannot be changed here. Ask an admin to update them in Staff.
                </p>
              </>
            ) : (
              <Input
                label="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How you want to be shown"
                hint="Optional. Stored only on this device."
              />
            )}
            <div className={styles.actions}>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </Button>
              <Link to={ROUTES_PROFILE.VIEW}>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

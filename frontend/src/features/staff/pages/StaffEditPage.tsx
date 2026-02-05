import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Alert } from '../../../components/ui'
import { StaffForm } from '../components'
import { useStaff } from '../hooks'
import { ROUTES } from '../../../utils/constants'
import { useAuth } from '../../../contexts'

const StaffEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { staff, loading, error } = useStaff(id || null)

  const canEdit = user?.role === 'manager'

  const handleSuccess = () => {
    navigate(`${ROUTES.STAFF}/${id}`)
  }

  const handleCancel = () => {
    navigate(`${ROUTES.STAFF}/${id}`)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
        <div className="loading"></div>
        <p>Loading staff member...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Alert variant="error">{error}</Alert>
        <Button onClick={() => navigate(ROUTES.STAFF)} style={{ marginTop: 'var(--spacing-4)' }}>
          Back to Staff List
        </Button>
      </div>
    )
  }

  if (!staff) {
    return (
      <div>
        <Alert variant="error">Staff member not found</Alert>
        <Button onClick={() => navigate(ROUTES.STAFF)} style={{ marginTop: 'var(--spacing-4)' }}>
          Back to Staff List
        </Button>
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div>
        <Alert variant="error">You don't have permission to edit staff members</Alert>
        <Button onClick={() => navigate(ROUTES.STAFF)} style={{ marginTop: 'var(--spacing-4)' }}>
          Back to Staff List
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--spacing-6)' }}>Edit Staff Member</h1>
      <StaffForm staff={staff} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}

export default StaffEditPage

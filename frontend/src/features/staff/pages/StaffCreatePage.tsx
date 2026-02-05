import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StaffForm } from '../components'
import { ROUTES } from '../../../utils/constants'

const StaffCreatePage: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate(ROUTES.STAFF)
  }

  const handleCancel = () => {
    navigate(ROUTES.STAFF)
  }

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--spacing-6)' }}>Create Staff Member</h1>
      <StaffForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}

export default StaffCreatePage

import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui'
import { StaffList } from '../components'
import { ROUTES } from '../../../utils/constants'
import { useAuth } from '../../../contexts'

const StaffListPage: React.FC = () => {
  const { user } = useAuth()
  const canCreate = user?.role === 'manager'

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        <h1>Staff Management</h1>
        {canCreate && (
          <Link to={`${ROUTES.STAFF}/new`}>
            <Button variant="primary">Add Staff Member</Button>
          </Link>
        )}
      </div>
      <StaffList />
    </div>
  )
}

export default StaffListPage

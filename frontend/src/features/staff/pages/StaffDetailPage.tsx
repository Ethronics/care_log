import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, Button, Badge, Alert } from '../../../components/ui'
import { useStaff } from '../hooks'
import { staffService } from '../services'
import { ROUTES } from '../../../utils/constants'
import { useAuth } from '../../../contexts'
import './StaffDetailPage.css'

const StaffDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { staff, loading, error, refetch } = useStaff(id || null)
  const [deleting, setDeleting] = useState(false)

  const canEdit = user?.role === 'manager'
  const canDelete = user?.role === 'manager'

  const handleDelete = async () => {
    if (!staff || !window.confirm(`Are you sure you want to deactivate ${staff.name}?`)) {
      return
    }

    setDeleting(true)
    try {
      await staffService.deleteStaff(staff.id)
      navigate(ROUTES.STAFF)
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate staff member')
    } finally {
      setDeleting(false)
    }
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

  const roleLabels: Record<string, string> = {
    manager: 'Manager',
    senior_carer: 'Senior Carer',
    carer: 'Carer',
  }

  const roleColors: Record<string, 'primary' | 'secondary' | 'success' | 'info'> = {
    manager: 'primary',
    senior_carer: 'secondary',
    carer: 'info',
  }

  return (
    <div className="staff-detail">
      <div className="staff-detail-header">
        <Link to={ROUTES.STAFF}>
          <Button variant="ghost" size="sm">← Back to Staff List</Button>
        </Link>
        {canEdit && (
          <Link to={`${ROUTES.STAFF}/${staff.id}/edit`}>
            <Button variant="primary">Edit Staff</Button>
          </Link>
        )}
      </div>

      <Card className="staff-detail-card">
        <div className="staff-detail-content">
          {staff.photo ? (
            <img src={staff.photo} alt={staff.name} className="staff-detail-photo" />
          ) : (
            <div className="staff-detail-avatar">
              {staff.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="staff-detail-info">
            <div className="staff-detail-name-row">
              <h1>{staff.name}</h1>
              <div className="staff-detail-badges">
                <Badge variant={roleColors[staff.role] || 'primary'}>
                  {roleLabels[staff.role] || staff.role}
                </Badge>
                {staff.isActive ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="error">Inactive</Badge>
                )}
              </div>
            </div>

            <div className="staff-detail-details">
              <div className="staff-detail-field">
                <label>Email</label>
                <p>{staff.email}</p>
              </div>

              {staff.phone && (
                <div className="staff-detail-field">
                  <label>Phone</label>
                  <p>{staff.phone}</p>
                </div>
              )}

              <div className="staff-detail-field">
                <label>Role</label>
                <p>{roleLabels[staff.role] || staff.role}</p>
              </div>

              <div className="staff-detail-field">
                <label>Status</label>
                <p>{staff.isActive ? 'Active' : 'Inactive'}</p>
              </div>

              <div className="staff-detail-field">
                <label>Created</label>
                <p>{new Date(staff.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="staff-detail-field">
                <label>Last Updated</label>
                <p>{new Date(staff.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {canDelete && (
        <Card className="staff-detail-actions">
          <h3>Danger Zone</h3>
          <p>Deactivating a staff member will prevent them from accessing the system.</p>
          <Button
            variant="error"
            onClick={handleDelete}
            disabled={deleting || !staff.isActive}
          >
            {deleting ? 'Deactivating...' : 'Deactivate Staff Member'}
          </Button>
        </Card>
      )}
    </div>
  )
}

export default StaffDetailPage

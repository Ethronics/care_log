import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge } from '../../../components/ui'
import { Staff } from '../types'
import { ROUTES } from '../../../utils/constants'
import './StaffCard.css'

interface StaffCardProps {
  staff: Staff
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff }) => {
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
    <Link to={`${ROUTES.STAFF}/${staff.id}`} className="staff-card-link">
      <Card interactive className="staff-card">
        <div className="staff-card-content">
          {staff.photo ? (
            <img src={staff.photo} alt={staff.name} className="staff-card-photo" />
          ) : (
            <div className="staff-card-avatar">
              {staff.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="staff-card-info">
            <h3 className="staff-card-name">{staff.name}</h3>
            <p className="staff-card-email">{staff.email}</p>
            {staff.phone && <p className="staff-card-phone">{staff.phone}</p>}
            <div className="staff-card-badges">
              <Badge variant={roleColors[staff.role] || 'primary'}>
                {roleLabels[staff.role] || staff.role}
              </Badge>
              {!staff.isActive && (
                <Badge variant="error">Inactive</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

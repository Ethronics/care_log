import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Alert } from '../../../components/ui'
import { Staff, CreateStaffInput, UpdateStaffInput, StaffRole } from '../types'
import { staffService } from '../services'
import './StaffForm.css'

interface StaffFormProps {
  staff?: Staff | null
  onSuccess: () => void
  onCancel?: () => void
}

export const StaffForm: React.FC<StaffFormProps> = ({ staff, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'carer' as StaffRole,
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone || '',
        role: staff.role,
        password: '',
      })
    }
  }, [staff])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (staff) {
        // Update existing staff
        const updateData: UpdateStaffInput = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          role: formData.role,
        }
        await staffService.updateStaff(staff.id, updateData)
      } else {
        // Create new staff
        if (!formData.password) {
          setError('Password is required for new staff members')
          setLoading(false)
          return
        }
        const createData: CreateStaffInput = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          role: formData.role,
          password: formData.password,
        }
        await staffService.createStaff(createData)
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to save staff member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="staff-form">
        <h2>{staff ? 'Edit Staff Member' : 'Create Staff Member'}</h2>

        {error && (
          <Alert variant="error" style={{ marginBottom: 'var(--spacing-4)' }}>
            {error}
          </Alert>
        )}

        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter full name"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter email address"
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <div className="staff-form-field">
          <label className="input-label">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input select"
            required
          >
            <option value="carer">Carer</option>
            <option value="senior_carer">Senior Carer</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {!staff && (
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            help="Minimum 8 characters"
          />
        )}

        <div className="staff-form-actions">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={loading} fullWidth={!onCancel}>
            {loading ? 'Saving...' : staff ? 'Update Staff' : 'Create Staff'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

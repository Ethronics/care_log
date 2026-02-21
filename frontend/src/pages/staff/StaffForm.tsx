import { useState } from 'react'
import { ROLES, STAFF_LEVELS, type Role, type StaffLevel } from '../../utils/constants'
import { Button, Input, Alert } from '../../components/ui'
import type { Staff } from '../../types/staff'
import styles from './StaffForm.module.css'

export interface StaffFormValues {
  name: string
  email: string
  phone: string
  role: Role
  staffLevel: StaffLevel | ''
  trainingExpiryDate: string
  contractedHoursPerWeek: string
  dbsCheckExpiry: string
  safeguardingCompletedDate: string
}

const emptyValues: StaffFormValues = {
  name: '',
  email: '',
  phone: '',
  role: ROLES.STAFF,
  staffLevel: STAFF_LEVELS.CARER,
  trainingExpiryDate: '',
  contractedHoursPerWeek: '',
  dbsCheckExpiry: '',
  safeguardingCompletedDate: '',
}

interface StaffFormProps {
  initialValues?: StaffFormValues | null
  onSubmit: (values: StaffFormValues) => void
  submitLabel?: string
  isSubmitting?: boolean
}

export function StaffForm({
  initialValues = null,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting = false,
}: StaffFormProps) {
  const [values, setValues] = useState<StaffFormValues>(
    initialValues ?? emptyValues
  )
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const name = values.name.trim()
    const email = values.email.trim()
    if (!name) {
      setError('Name is required.')
      return
    }
    if (!email) {
      setError('Email is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (values.role === ROLES.STAFF && !values.staffLevel) {
      setError('Please select staff type: Carer or Senior carer.')
      return
    }
    const contracted = values.contractedHoursPerWeek.trim()
    if (contracted && (Number.isNaN(Number(contracted)) || Number(contracted) < 0)) {
      setError('Contracted hours must be a non-negative number.')
      return
    }
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <Alert variant="error" className={styles.alert}>
          {error}
        </Alert>
      )}
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        placeholder="Full name"
        autoComplete="name"
        required
      />
      <Input
        type="email"
        label="Email"
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        placeholder="email@example.com"
        autoComplete="email"
        required
      />
      <Input
        label="Phone"
        value={values.phone}
        onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
        placeholder="+44 7700 900000"
        autoComplete="tel"
      />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="staff-role">
          Role
        </label>
        <select
          id="staff-role"
          value={values.role}
          onChange={(e) => {
            const newRole = e.target.value as Role
            setValues((v) => ({
              ...v,
              role: newRole,
              staffLevel: newRole === ROLES.STAFF ? (v.staffLevel || STAFF_LEVELS.CARER) : '',
            }))
          }}
          className={styles.select}
          aria-label="Role"
        >
          <option value={ROLES.ADMIN}>Admin</option>
          <option value={ROLES.STAFF}>Staff (carer or senior carer)</option>
        </select>
      </div>
      {values.role === ROLES.STAFF && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="staff-level">
            Type
          </label>
          <select
            id="staff-level"
            value={values.staffLevel}
            onChange={(e) =>
              setValues((v) => ({ ...v, staffLevel: e.target.value as StaffLevel | '' }))
            }
            className={styles.select}
            aria-label="Staff type"
          >
            <option value={STAFF_LEVELS.CARER}>Carer</option>
            <option value={STAFF_LEVELS.SENIOR_CARER}>Senior carer</option>
          </select>
          <span className={styles.hint}>Care staff are either Carer or Senior carer.</span>
        </div>
      )}
      <Input
        type="date"
        label="Training valid until (optional)"
        value={values.trainingExpiryDate}
        onChange={(e) => setValues((v) => ({ ...v, trainingExpiryDate: e.target.value }))}
        hint="Auto-Fill excludes staff when shift date is after this."
      />
      <Input
        type="number"
        label="Contracted hours per week (optional)"
        value={values.contractedHoursPerWeek}
        onChange={(e) => setValues((v) => ({ ...v, contractedHoursPerWeek: e.target.value }))}
        placeholder="e.g. 40"
        min={0}
        step={1}
        hint="Used by Auto-Fill for fairness and overtime avoidance."
      />
      <Input
        type="date"
        label="DBS check valid until (optional)"
        value={values.dbsCheckExpiry}
        onChange={(e) => setValues((v) => ({ ...v, dbsCheckExpiry: e.target.value }))}
        hint="DBS certificate expiry date."
      />
      <Input
        type="date"
        label="Safeguarding training completed (optional)"
        value={values.safeguardingCompletedDate}
        onChange={(e) => setValues((v) => ({ ...v, safeguardingCompletedDate: e.target.value }))}
        hint="Date safeguarding training was completed."
      />
      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function staffToFormValues(s: Staff): StaffFormValues {
  return {
    name: s.name,
    email: s.email,
    phone: s.phone,
    role: s.role,
    staffLevel: s.role === ROLES.STAFF ? (s.staffLevel ?? STAFF_LEVELS.CARER) : '',
    trainingExpiryDate: s.trainingExpiryDate ?? '',
    contractedHoursPerWeek: s.contractedHoursPerWeek != null ? String(s.contractedHoursPerWeek) : '',
    dbsCheckExpiry: s.dbsCheckExpiry ?? '',
    safeguardingCompletedDate: s.safeguardingCompletedDate ?? '',
  }
}

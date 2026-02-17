import { useState } from 'react'
import { Button, Input, Alert } from '../../components/ui'
import type { Shift } from '../../types/shift'
import styles from './ShiftForm.module.css'

export interface ShiftFormValues {
  date: string
  startTime: string
  endTime: string
  serviceUserId: string
  staffId: string
  notes: string
}

const emptyValues: ShiftFormValues = {
  date: '',
  startTime: '09:00',
  endTime: '17:00',
  serviceUserId: '',
  staffId: '',
  notes: '',
}

interface ShiftFormProps {
  initialValues?: ShiftFormValues | null
  serviceUserOptions: { id: string; name: string }[]
  staffOptions: { id: string; name: string }[]
  onSubmit: (values: ShiftFormValues) => void
  submitLabel?: string
  isSubmitting?: boolean
}

export function ShiftForm({
  initialValues = null,
  serviceUserOptions,
  staffOptions,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting = false,
}: ShiftFormProps) {
  const [values, setValues] = useState<ShiftFormValues>(
    initialValues ?? emptyValues
  )
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!values.date) {
      setError('Date is required.')
      return
    }
    if (!values.serviceUserId) {
      setError('Service user is required.')
      return
    }
    if (!values.startTime || !values.endTime) {
      setError('Start and end time are required.')
      return
    }
    if (values.startTime >= values.endTime) {
      setError('End time must be after start time.')
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
        type="date"
        label="Date"
        value={values.date}
        onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
        required
      />
      <div className={styles.row}>
        <Input
          type="time"
          label="Start time"
          value={values.startTime}
          onChange={(e) => setValues((v) => ({ ...v, startTime: e.target.value }))}
          required
        />
        <Input
          type="time"
          label="End time"
          value={values.endTime}
          onChange={(e) => setValues((v) => ({ ...v, endTime: e.target.value }))}
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="shift-service-user">
          Service user
        </label>
        <select
          id="shift-service-user"
          value={values.serviceUserId}
          onChange={(e) => setValues((v) => ({ ...v, serviceUserId: e.target.value }))}
          className={styles.select}
          required
        >
          <option value="">Select…</option>
          {serviceUserOptions.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="shift-staff">
          Assign staff (optional)
        </label>
        <select
          id="shift-staff"
          value={values.staffId}
          onChange={(e) => setValues((v) => ({ ...v, staffId: e.target.value }))}
          className={styles.select}
        >
          <option value="">Unassigned</option>
          {staffOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Notes</label>
        <textarea
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          className={styles.textarea}
          placeholder="Optional notes"
          rows={2}
        />
      </div>
      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function shiftToFormValues(s: Shift): ShiftFormValues {
  return {
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    serviceUserId: s.serviceUserId,
    staffId: s.staffId ?? '',
    notes: s.notes,
  }
}

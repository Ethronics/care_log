import { useState } from 'react'
import { Button, Input, Alert } from '../../components/ui'
import { ABSENCE_TYPES, type AbsenceType } from '../../types/absence'
import styles from './LeaveRequestForm.module.css'

const TYPE_LABELS: Record<AbsenceType, string> = {
  [ABSENCE_TYPES.SICK]: 'Sick leave',
  [ABSENCE_TYPES.ANNUAL]: 'Annual leave',
  [ABSENCE_TYPES.OTHER]: 'Other',
}

export interface LeaveRequestFormValues {
  startDate: string
  endDate: string
  type: AbsenceType
  notes: string
}

interface LeaveRequestFormProps {
  onSubmit: (values: LeaveRequestFormValues) => void
  isSubmitting?: boolean
  onCancel?: () => void
}

export function LeaveRequestForm({
  onSubmit,
  isSubmitting = false,
  onCancel,
}: LeaveRequestFormProps) {
  const [values, setValues] = useState<LeaveRequestFormValues>({
    startDate: '',
    endDate: '',
    type: ABSENCE_TYPES.ANNUAL,
    notes: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!values.startDate || !values.endDate) {
      setError('Start and end date are required.')
      return
    }
    if (values.endDate < values.startDate) {
      setError('End date must be on or after start date.')
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
      <div className={styles.row}>
        <Input
          type="date"
          label="Start date"
          value={values.startDate}
          onChange={(e) => setValues((v) => ({ ...v, startDate: e.target.value }))}
          required
        />
        <Input
          type="date"
          label="End date"
          value={values.endDate}
          onChange={(e) => setValues((v) => ({ ...v, endDate: e.target.value }))}
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="leave-type">
          Type
        </label>
        <select
          id="leave-type"
          value={values.type}
          onChange={(e) => setValues((v) => ({ ...v, type: e.target.value as AbsenceType }))}
          className={styles.select}
        >
          {(Object.keys(TYPE_LABELS) as AbsenceType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Notes (optional)</label>
        <textarea
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          className={styles.textarea}
          placeholder="e.g. Family holiday"
          rows={2}
        />
      </div>
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit request'}
        </Button>
      </div>
    </form>
  )
}

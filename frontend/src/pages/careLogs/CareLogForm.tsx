import { useState } from 'react'
import { Button, Alert } from '../../components/ui'
import { CARE_LOG_TYPES, type CareLogType } from '../../types/careLog'
import type { CareLog } from '../../types/careLog'
import styles from './CareLogForm.module.css'

const TYPE_LABELS: Record<CareLogType, string> = {
  [CARE_LOG_TYPES.FOOD]: 'Food & fluids',
  [CARE_LOG_TYPES.MEDICATION]: 'Medication',
  [CARE_LOG_TYPES.MOOD]: 'Mood & observations',
  [CARE_LOG_TYPES.GENERAL]: 'General notes',
}

export interface CareLogFormValues {
  type: CareLogType
  content: string
}

const emptyValues: CareLogFormValues = {
  type: CARE_LOG_TYPES.GENERAL,
  content: '',
}

interface CareLogFormProps {
  initialValues?: CareLogFormValues | null
  onSubmit: (values: CareLogFormValues) => void
  submitLabel?: string
  isSubmitting?: boolean
  onCancel?: () => void
}

export function CareLogForm({
  initialValues = null,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting = false,
  onCancel,
}: CareLogFormProps) {
  const [values, setValues] = useState<CareLogFormValues>(
    initialValues ?? emptyValues
  )
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const content = values.content.trim()
    if (!content) {
      setError('Content is required.')
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
      <div className={styles.field}>
        <label className={styles.label} htmlFor="care-log-type">
          Type
        </label>
        <select
          id="care-log-type"
          value={values.type}
          onChange={(e) => setValues((v) => ({ ...v, type: e.target.value as CareLogType }))}
          className={styles.select}
        >
          {(Object.keys(TYPE_LABELS) as CareLogType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="care-log-content">
          Notes
        </label>
        <textarea
          id="care-log-content"
          value={values.content}
          onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
          className={styles.textarea}
          placeholder="Enter care notes…"
          rows={4}
          required
        />
      </div>
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function careLogToFormValues(log: CareLog): CareLogFormValues {
  return { type: log.type, content: log.content }
}

export { TYPE_LABELS }

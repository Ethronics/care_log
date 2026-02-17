import { useState } from 'react'
import { Button, Input, Alert } from '../../components/ui'
import type { ServiceUser } from '../../types/serviceUser'
import type { EmergencyContact } from '../../types/serviceUser'
import styles from './ServiceUserForm.module.css'

export interface ServiceUserFormValues {
  name: string
  dateOfBirth: string
  medicalInfo: string
  emergencyContacts: EmergencyContact[]
  preferences: string
}

const emptyContact: EmergencyContact = { name: '', relationship: '', phone: '' }

const emptyValues: ServiceUserFormValues = {
  name: '',
  dateOfBirth: '',
  medicalInfo: '',
  emergencyContacts: [{ ...emptyContact }],
  preferences: '',
}

interface ServiceUserFormProps {
  initialValues?: ServiceUserFormValues | null
  onSubmit: (values: ServiceUserFormValues) => void
  submitLabel?: string
  isSubmitting?: boolean
}

export function ServiceUserForm({
  initialValues = null,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting = false,
}: ServiceUserFormProps) {
  const [values, setValues] = useState<ServiceUserFormValues>(
    initialValues ?? emptyValues
  )
  const [error, setError] = useState('')

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    setValues((v) => {
      const next = [...v.emergencyContacts]
      next[index] = { ...next[index], [field]: value }
      return { ...v, emergencyContacts: next }
    })
  }

  const addContact = () => {
    setValues((v) => ({ ...v, emergencyContacts: [...v.emergencyContacts, { ...emptyContact }] }))
  }

  const removeContact = (index: number) => {
    setValues((v) => ({
      ...v,
      emergencyContacts: v.emergencyContacts.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const name = values.name.trim()
    if (!name) {
      setError('Name is required.')
      return
    }
    if (!values.dateOfBirth) {
      setError('Date of birth is required.')
      return
    }
    const contacts = values.emergencyContacts.filter(
      (c) => c.name.trim() || c.phone.trim() || c.relationship.trim()
    )
    onSubmit({ ...values, emergencyContacts: contacts.length ? contacts : [] })
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
        type="date"
        label="Date of birth"
        value={values.dateOfBirth}
        onChange={(e) => setValues((v) => ({ ...v, dateOfBirth: e.target.value }))}
        required
      />
      <div className={styles.field}>
        <label className={styles.label}>Medical information</label>
        <textarea
          value={values.medicalInfo}
          onChange={(e) => setValues((v) => ({ ...v, medicalInfo: e.target.value }))}
          className={styles.textarea}
          placeholder="Conditions, allergies, medications…"
          rows={3}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Preferences & notes</label>
        <textarea
          value={values.preferences}
          onChange={(e) => setValues((v) => ({ ...v, preferences: e.target.value }))}
          className={styles.textarea}
          placeholder="Routine preferences, likes, etc."
          rows={2}
        />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.label}>Emergency contacts</span>
          <Button type="button" variant="ghost" size="sm" onClick={addContact}>
            Add contact
          </Button>
        </div>
        {values.emergencyContacts.map((contact, index) => (
          <div key={index} className={styles.contactRow}>
            <Input
              label="Name"
              value={contact.name}
              onChange={(e) => updateContact(index, 'name', e.target.value)}
              placeholder="Contact name"
            />
            <Input
              label="Relationship"
              value={contact.relationship}
              onChange={(e) => updateContact(index, 'relationship', e.target.value)}
              placeholder="e.g. Son, Daughter"
            />
            <Input
              label="Phone"
              value={contact.phone}
              onChange={(e) => updateContact(index, 'phone', e.target.value)}
              placeholder="+44 7700 900000"
            />
            <div className={styles.contactRemove}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeContact(index)}
                disabled={values.emergencyContacts.length <= 1}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function serviceUserToFormValues(u: ServiceUser): ServiceUserFormValues {
  return {
    name: u.name,
    dateOfBirth: u.dateOfBirth,
    medicalInfo: u.medicalInfo,
    emergencyContacts:
      u.emergencyContacts.length > 0 ? u.emergencyContacts : [{ ...emptyContact }],
    preferences: u.preferences,
  }
}

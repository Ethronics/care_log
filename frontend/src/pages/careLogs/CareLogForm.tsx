import { useState, useRef, useEffect } from 'react'
import { Button, Alert } from '../../components/ui'
import { CARE_LOG_TYPES, type CareLogType } from '../../types/careLog'
import type { CareLog } from '../../types/careLog'
import {
  getSpeechRecognition,
  isSpeechRecognitionSupported,
  type SpeechRecognitionEvent,
} from '../../utils/speech'
import { summarizeCareLogText } from '../../utils/summarize'
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
  /** Set when "Summarize on save" was used; parent should store as rawContent */
  rawContent?: string
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
  /** Show voice input and summarize options (e.g. hide on edit) */
  showVoiceAndSummarize?: boolean
}

export function CareLogForm({
  initialValues = null,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting = false,
  onCancel,
  showVoiceAndSummarize = true,
}: CareLogFormProps) {
  const [values, setValues] = useState<CareLogFormValues>(
    initialValues ?? emptyValues
  )
  const [error, setError] = useState('')
  const [summarizeOnSave, setSummarizeOnSave] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<InstanceType<NonNullable<ReturnType<typeof getSpeechRecognition>>> | null>(null)

  const voiceSupported = isSpeechRecognitionSupported()

  useEffect(() => {
    if (!voiceSupported) return
    const Ctor = getSpeechRecognition()
    if (!Ctor) return
    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-GB'
    rec.onresult = (event: SpeechRecognitionEvent) => {
      // Only append final results; interim results cause repeated/cumulative text
      let toAppend = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const alt = result[0]
        if (alt?.transcript && result.isFinal) {
          toAppend += (toAppend ? ' ' : '') + alt.transcript.trim()
        }
      }
      if (toAppend) {
        setValues((v) => ({ ...v, content: v.content ? `${v.content} ${toAppend}` : toAppend }))
      }
    }
    rec.onend = () => setIsListening(false)
    rec.onerror = () => setIsListening(false)
    recognitionRef.current = rec
    return () => {
      try { rec.abort() } catch { /* ignore */ }
      recognitionRef.current = null
    }
  }, [voiceSupported])

  const toggleVoice = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const content = values.content.trim()
    if (!content) {
      setError('Content is required.')
      return
    }
    if (summarizeOnSave) {
      setIsSummarizing(true)
      try {
        const summary = await summarizeCareLogText(content)
        onSubmit({ type: values.type, content: summary, rawContent: content })
      } catch {
        setError('Summarization failed. Try again or save without summarizing.')
      } finally {
        setIsSummarizing(false)
      }
    } else {
      onSubmit({ type: values.type, content })
    }
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
        {showVoiceAndSummarize && voiceSupported && (
          <div className={styles.voiceRow}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={toggleVoice}
              disabled={isSubmitting}
              aria-pressed={isListening}
            >
              {isListening ? 'Stop voice' : 'Voice input'}
            </Button>
          </div>
        )}
        <textarea
          id="care-log-content"
          value={values.content}
          onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
          className={styles.textarea}
          placeholder="Enter care notes or use voice input…"
          rows={4}
          required
        />
        {showVoiceAndSummarize && !initialValues && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={summarizeOnSave}
              onChange={(e) => setSummarizeOnSave(e.target.checked)}
              className={styles.checkbox}
            />
            <span className="text-sm text-muted">Summarize on save (keeps full text as raw)</span>
          </label>
        )}
      </div>
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting || isSummarizing}>
          {isSummarizing ? 'Summarizing…' : isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function careLogToFormValues(log: CareLog): CareLogFormValues {
  return { type: log.type, content: log.content }
}

export { TYPE_LABELS }

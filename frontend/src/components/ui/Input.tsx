import { type InputHTMLAttributes, useId } from 'react'
import styles from './Input.module.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Input({
  label,
  error,
  hint,
  size = 'md',
  id: idProp,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${styles.input} ${styles[size]} ${error ? styles.hasError : ''}`}
        aria-invalid={!!error}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  )
}

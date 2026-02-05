import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  help?: string
  success?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  help,
  success,
  className = '',
  ...props
}) => {
  const baseClasses = 'input'
  const errorClass = error ? 'input-error' : ''
  const successClass = success ? 'input-success' : ''

  const inputClasses = [baseClasses, errorClass, successClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      {label && <label className="input-label">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <div className="input-error-text">{error}</div>}
      {help && !error && <div className="input-help">{help}</div>}
    </div>
  )
}

import React from 'react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  className = ''
}) => {
  const baseClasses = 'alert'
  const variantClass = `alert-${variant}`

  const classes = [baseClasses, variantClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <div>
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{children}</div>
      </div>
    </div>
  )
}

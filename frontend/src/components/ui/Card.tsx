import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  footer?: React.ReactNode
  elevated?: boolean
  interactive?: boolean
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  elevated = false,
  interactive = false,
  className = '',
  onClick
}) => {
  const baseClasses = 'card'
  const elevatedClass = elevated ? 'card-elevated' : ''
  const interactiveClass = interactive ? 'card-interactive' : ''

  const classes = [baseClasses, elevatedClass, interactiveClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} onClick={onClick}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

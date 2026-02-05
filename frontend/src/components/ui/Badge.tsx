import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = 'badge'
  const variantClass = `badge-${variant}`

  const classes = [baseClasses, variantClass, className]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}

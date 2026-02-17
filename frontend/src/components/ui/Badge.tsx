import { type HTMLAttributes, type ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
}

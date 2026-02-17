import { type HTMLAttributes, type ReactNode } from 'react'
import styles from './Alert.module.css'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  children: ReactNode
}

export function Alert({ variant = 'info', title, children, className = '', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={`${styles.alert} ${styles[variant]} ${className}`.trim()}
      {...props}
    >
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  )
}

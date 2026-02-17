import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

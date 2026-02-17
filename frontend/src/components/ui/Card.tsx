import { type HTMLAttributes, type ReactNode } from 'react'
import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`${styles.card} ${styles[`padding-${padding}`]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.cardHeader} ${className}`.trim()}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`${styles.cardTitle} ${className}`.trim()}>{children}</h3>
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.cardContent} ${className}`.trim()}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.cardFooter} ${className}`.trim()}>{children}</div>
}

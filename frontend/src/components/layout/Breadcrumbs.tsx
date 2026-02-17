import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : item.to ? (
                <Link to={item.to} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.label}>{item.label}</span>
              )}
              {!isLast && <span className={styles.separator} aria-hidden>/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

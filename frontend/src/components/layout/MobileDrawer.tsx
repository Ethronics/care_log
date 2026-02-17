import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import styles from './MobileDrawer.module.css'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.ROTA, label: 'Rota' },
  { to: ROUTES.STAFF, label: 'Staff' },
  { to: ROUTES.SERVICE_USERS, label: 'Service users' },
  { to: ROUTES.CARE_LOGS, label: 'Care logs' },
  { to: ROUTES.ABSENCES, label: 'Leave & absence' },
]

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const location = useLocation()

  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.open : ''}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <nav className={styles.nav}>
          <ul className={styles.list}>
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`${styles.link} ${location.pathname === to ? styles.active : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getRole } from '../../utils/auth'
import { getNavItemsForRole, getProfileNavItem } from '../../utils/navConfig'
import styles from './MobileDrawer.module.css'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const location = useLocation()
  const role = getRole()
  const navItems = getNavItemsForRole(role)
  const profileItem = getProfileNavItem(role)

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
            {profileItem && (
              <li key={profileItem.to} className={styles.profileItem}>
                <Link
                  to={profileItem.to}
                  className={`${styles.link} ${location.pathname === profileItem.to ? styles.active : ''}`}
                >
                  {profileItem.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  )
}

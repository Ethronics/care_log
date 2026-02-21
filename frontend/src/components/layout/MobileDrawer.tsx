import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { getRole, getUser } from '../../utils/auth'
import { getNavItemsForRole, getProfileNavItem } from '../../utils/navConfig'
import type { NavIconName } from '../../utils/navConfig'
import {
  IconDashboard,
  IconCalendar,
  IconUsers,
  IconUserCircle,
  IconFileText,
  IconCalendarOff,
  IconX,
} from '../icons'
import { ROUTES, ROLES } from '../../utils/constants'
import styles from './MobileDrawer.module.css'

const ICON_MAP: Record<NavIconName, React.ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  rota: IconCalendar,
  staff: IconUsers,
  serviceUsers: IconUserCircle,
  careLogs: IconFileText,
  absences: IconCalendarOff,
  profile: IconUserCircle,
}

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const location = useLocation()
  const role = getRole()
  const user = getUser()
  const navItems = getNavItemsForRole(role)
  const profileItem = getProfileNavItem(role)
  const displayName = user?.name || (role === ROLES.ADMIN ? 'Admin' : 'Staff')
  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

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

  const content = (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.open : ''}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        role="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
      />
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <header className={styles.header}>
          <Link to={ROUTES.HOME} className={styles.logo} onClick={onClose}>
            carePro
          </Link>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            <IconX className={styles.closeIcon} />
          </button>
        </header>
        <div className={styles.hero}>
          <div className={styles.heroAvatar} aria-hidden>
            {initials}
          </div>
          <p className={styles.heroGreeting}>Hi, {displayName}</p>
          <p className={styles.heroRole}>
            {role === ROLES.ADMIN ? 'Administrator' : 'Care staff'}
          </p>
        </div>
        <nav className={styles.nav} aria-label="Main">
          <p className={styles.sectionLabel}>Navigate</p>
          <ul className={styles.list}>
            {navItems.map(({ to, label, icon }) => {
              const Icon = ICON_MAP[icon]
              const isActive = location.pathname === to
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`${styles.link} ${isActive ? styles.active : ''}`}
                    onClick={onClose}
                  >
                    {Icon && (
                      <span className={styles.iconWrap} aria-hidden>
                        <Icon className={styles.icon} />
                      </span>
                    )}
                    <span className={styles.label}>{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          {profileItem && (
            <>
              <p className={styles.sectionLabel}>Account</p>
              <ul className={styles.listProfile}>
                <li>
                  <Link
                    to={profileItem.to}
                    className={`${styles.link} ${styles.linkProfile} ${location.pathname === profileItem.to ? styles.active : ''}`}
                    onClick={onClose}
                  >
                    {(() => {
                      const Icon = ICON_MAP[profileItem.icon]
                      return Icon ? (
                        <span className={styles.iconWrap} aria-hidden>
                          <Icon className={styles.icon} />
                        </span>
                      ) : null
                    })()}
                    <span className={styles.label}>{profileItem.label}</span>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </nav>
      </aside>
    </>
  )

  return createPortal(content, document.body)
}

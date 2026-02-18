import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getRole } from '../../utils/auth'
import { getNavItemsForRole, getProfileNavItem } from '../../utils/navConfig'
import { STORAGE_KEYS } from '../../utils/constants'
import type { NavIconName } from '../../utils/navConfig'
import {
  IconDashboard,
  IconCalendar,
  IconUsers,
  IconUserCircle,
  IconFileText,
  IconCalendarOff,
  IconPanelLeftClose,
  IconPanelLeftOpen,
} from '../icons'
import styles from './Sidebar.module.css'

const ICON_MAP: Record<NavIconName, React.ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  rota: IconCalendar,
  staff: IconUsers,
  serviceUsers: IconUserCircle,
  careLogs: IconFileText,
  absences: IconCalendarOff,
  profile: IconUserCircle,
}

function getStoredCollapsed(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED)
    return v === '1'
  } catch {
    return false
  }
}

function NavLink({
  to,
  label,
  icon,
  isActive,
  collapsed,
}: {
  to: string
  label: string
  icon: NavIconName
  isActive: boolean
  collapsed: boolean
}) {
  const Icon = ICON_MAP[icon]
  return (
    <li>
      <Link
        to={to}
        className={`${styles.link} ${isActive ? styles.active : ''}`}
        title={collapsed ? label : undefined}
      >
        <span className={styles.iconWrap} aria-hidden>
          {Icon && <Icon className={styles.icon} />}
        </span>
        {!collapsed && <span className={styles.label}>{label}</span>}
      </Link>
    </li>
  )
}

export function Sidebar() {
  const location = useLocation()
  const role = getRole()
  const navItems = getNavItemsForRole(role)
  const profileItem = getProfileNavItem(role)
  const [collapsed, setCollapsed] = useState(getStoredCollapsed)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed ? '1' : '0')
    } catch {
      // ignore
    }
  }, [collapsed])

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      role="navigation"
      aria-label="Sidebar"
    >
      <div className={styles.collapseTop}>
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <IconPanelLeftOpen className={styles.collapseIcon} />
          ) : (
            <IconPanelLeftClose className={styles.collapseIcon} />
          )}
          {!collapsed && <span className={styles.collapseLabel}>Collapse</span>}
        </button>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              label={label}
              icon={icon}
              isActive={location.pathname === to}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </nav>
      {profileItem && (
        <nav className={styles.profileSection} aria-label="Profile">
          <ul className={styles.list}>
            <NavLink
              to={profileItem.to}
              label={profileItem.label}
              icon={profileItem.icon}
              isActive={location.pathname === profileItem.to}
              collapsed={collapsed}
            />
          </ul>
        </nav>
      )}
    </aside>
  )
}

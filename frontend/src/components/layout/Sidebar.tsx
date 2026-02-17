import { Link, useLocation } from 'react-router-dom'
import { getRole } from '../../utils/auth'
import { getNavItemsForRole } from '../../utils/navConfig'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const location = useLocation()
  const navItems = getNavItemsForRole(getRole())

  return (
    <aside className={styles.sidebar} role="navigation" aria-label="Sidebar">
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
  )
}

import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import styles from './Sidebar.module.css'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.ROTA, label: 'Rota' },
  { to: ROUTES.STAFF, label: 'Staff' },
  { to: ROUTES.SERVICE_USERS, label: 'Service users' },
  { to: ROUTES.CARE_LOGS, label: 'Care logs' },
  { to: ROUTES.ABSENCES, label: 'Leave & absence' },
]

export function Sidebar() {
  const location = useLocation()

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

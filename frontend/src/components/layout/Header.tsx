import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui'
import { ROUTES } from '../../utils/constants'
import styles from './Header.module.css'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <span className={styles.menuIcon} aria-hidden>
            ☰
          </span>
        </button>
        <Link to={ROUTES.HOME} className={styles.logo}>
          Log My Care
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
          <Link to={ROUTES.ROTA}>Rota</Link>
          <Link to={ROUTES.STAFF}>Staff</Link>
          <Link to={ROUTES.SERVICE_USERS}>Service users</Link>
        </nav>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}

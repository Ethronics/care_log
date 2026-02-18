import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { getRole, getUser } from '../../utils/auth'
import { getNavItemsForRole } from '../../utils/navConfig'
import { ROUTES, ROLES } from '../../utils/constants'
import { Badge } from '../ui'
import { IconSun, IconMoon } from '../icons'
import styles from './Header.module.css'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const role = getRole()
  const navItems = getNavItemsForRole(role)

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
          carePro
        </Link>
        <nav className={styles.nav} aria-label="Main">
          {navItems.map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          {role && (
            <>
              <Link to={ROUTES.PROFILE} className={styles.profileLink}>
                {getUser()?.name || (role === ROLES.ADMIN ? 'Admin' : 'Staff')}
              </Link>
              <span className={styles.roleBadge}>
                <Badge variant={role === ROLES.ADMIN ? 'info' : 'default'}>
                  {role === ROLES.ADMIN ? 'Admin' : 'Staff'}
                </Badge>
              </span>
            </>
          )}
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <IconSun className={styles.themeIcon} />
            ) : (
              <IconMoon className={styles.themeIcon} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

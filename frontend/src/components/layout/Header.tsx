import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts'
import { ThemeToggle } from '../ui'
import { ROUTES } from '../../utils/constants'
import './Header.css'

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to={ROUTES.HOME} className="header-logo">
          <h1>Log My Care</h1>
        </Link>

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="header-nav-link">
                Dashboard
              </Link>
              <Link to={ROUTES.CARE_LOGS} className="header-nav-link">
                Care Logs
              </Link>
              <Link to={ROUTES.ROTA} className="header-nav-link">
                Rota
              </Link>
              <Link to={ROUTES.STAFF} className="header-nav-link">
                Staff
              </Link>
              <Link to={ROUTES.SERVICE_USERS} className="header-nav-link">
                Service Users
              </Link>
              <div className="header-user-menu">
                <span className="header-user-name">{user?.name || user?.email}</span>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to={ROUTES.LOGIN} className="header-nav-link">
              Login
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

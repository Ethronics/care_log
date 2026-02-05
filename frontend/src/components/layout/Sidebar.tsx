import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts'
import { ROUTES } from '../../utils/constants'
import './Sidebar.css'

interface NavItem {
  path: string
  label: string
  icon?: string
  roles?: string[]
}

const navItems: NavItem[] = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.CARE_LOGS, label: 'Care Logs', icon: '📝' },
  { path: ROUTES.ROTA, label: 'Rota', icon: '📅' },
  { path: ROUTES.STAFF, label: 'Staff', icon: '👥', roles: ['manager', 'senior_carer'] },
  { path: ROUTES.SERVICE_USERS, label: 'Service Users', icon: '👤' },
  { path: ROUTES.ABSENCES, label: 'Absences', icon: '🏖️' },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user } = useAuth()

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role || '')
  })

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
            >
              {item.icon && <span className="sidebar-nav-icon">{item.icon}</span>}
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

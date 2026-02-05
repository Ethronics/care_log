import React, { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../contexts'
import './AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app-layout">
      <Header />
      <div className="app-layout-content">
        {isAuthenticated && <Sidebar />}
        <main className="app-layout-main">
          {children}
        </main>
      </div>
    </div>
  )
}

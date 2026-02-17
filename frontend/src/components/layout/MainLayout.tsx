import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { MobileDrawer } from './MobileDrawer'
import { Breadcrumbs } from './Breadcrumbs'
import styles from './MainLayout.module.css'

export function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { items: breadcrumbs } = useBreadcrumbs()

  return (
    <div className={styles.wrapper}>
      <Header onMenuClick={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main} id="main-content">
          {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

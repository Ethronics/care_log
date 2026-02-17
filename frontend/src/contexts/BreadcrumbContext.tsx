import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { BreadcrumbItem } from '../components/layout'

interface BreadcrumbContextValue {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null)

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  const setItemsStable = useCallback((next: BreadcrumbItem[]) => {
    setItems(next)
  }, [])
  return (
    <BreadcrumbContext.Provider value={{ items, setItems: setItemsStable }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbContext)
  if (!ctx) throw new Error('useBreadcrumbs must be used within BreadcrumbProvider')
  return ctx
}

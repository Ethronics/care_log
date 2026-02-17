import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import { DEFAULT_DEMO_STORE, type DemoStore } from '../types/demoStore'
import type { Staff, StaffCreateInput } from '../types/staff'
import { getSeedStore } from '../data/seed'

function loadStore(): DemoStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEMO_DATA)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoStore
      if (Array.isArray(parsed.staff)) return parsed
    }
  } catch {
    // ignore
  }
  return getSeedStore()
}

function saveStore(store: DemoStore): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DEMO_DATA, JSON.stringify(store))
  } catch {
    // ignore
  }
}

function generateId(): string {
  return `staff-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface DemoStoreContextValue extends DemoStore {
  // Staff
  getStaff: (id: string) => Staff | undefined
  getStaffList: (options?: { includeInactive?: boolean }) => Staff[]
  addStaff: (input: StaffCreateInput) => Staff
  updateStaff: (id: string, input: Partial<Staff>) => Staff | undefined
  deactivateStaff: (id: string) => Staff | undefined
  reactivateStaff: (id: string) => Staff | undefined
}

const DemoStoreContext = createContext<DemoStoreContextValue | null>(null)

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DemoStore>(() => loadStore())

  useEffect(() => {
    saveStore(store)
  }, [store])

  const getStaff = useCallback(
    (id: string) => store.staff.find((s) => s.id === id),
    [store.staff]
  )

  const getStaffList = useCallback(
    (options?: { includeInactive?: boolean }) => {
      let list = [...store.staff]
      if (options?.includeInactive !== true) {
        list = list.filter((s) => s.isActive)
      }
      return list.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    },
    [store.staff]
  )

  const addStaff = useCallback((input: StaffCreateInput): Staff => {
    const now = new Date().toISOString()
    const staff: Staff = {
      id: generateId(),
      name: input.name,
      email: input.email,
      phone: input.phone ?? '',
      role: input.role,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }
    setStore((prev) => ({ ...prev, staff: [...prev.staff, staff] }))
    return staff
  }, [])

  const updateStaff = useCallback((id: string, input: Partial<Staff>): Staff | undefined => {
    const existing = store.staff.find((s) => s.id === id)
    if (!existing) return undefined
    const now = new Date().toISOString()
    const updated: Staff = {
      ...existing,
      ...input,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: now,
    }
    setStore((prev) => {
      const index = prev.staff.findIndex((s) => s.id === id)
      if (index === -1) return prev
      const next = [...prev.staff]
      next[index] = updated
      return { ...prev, staff: next }
    })
    return updated
  }, [store.staff])

  const deactivateStaff = useCallback((id: string): Staff | undefined => {
    return updateStaff(id, { isActive: false })
  }, [updateStaff])

  const reactivateStaff = useCallback((id: string): Staff | undefined => {
    return updateStaff(id, { isActive: true })
  }, [updateStaff])

  const value = useMemo<DemoStoreContextValue>(
    () => ({
      ...store,
      getStaff,
      getStaffList,
      addStaff,
      updateStaff,
      deactivateStaff,
      reactivateStaff,
    }),
    [
      store,
      getStaff,
      getStaffList,
      addStaff,
      updateStaff,
      deactivateStaff,
      reactivateStaff,
    ]
  )

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  )
}

export function useDemoStore(): DemoStoreContextValue {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error('useDemoStore must be used within DemoStoreProvider')
  return ctx
}

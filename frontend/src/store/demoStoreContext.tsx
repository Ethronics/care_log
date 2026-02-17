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
import type { ServiceUser, ServiceUserCreateInput } from '../types/serviceUser'
import { getSeedStore } from '../data/seed'

function loadStore(): DemoStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEMO_DATA)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoStore>
      if (Array.isArray(parsed.staff)) {
        return {
          staff: parsed.staff,
          serviceUsers: Array.isArray(parsed.serviceUsers) ? parsed.serviceUsers : [],
        }
      }
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

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface DemoStoreContextValue extends DemoStore {
  // Staff
  getStaff: (id: string) => Staff | undefined
  getStaffList: (options?: { includeInactive?: boolean }) => Staff[]
  addStaff: (input: StaffCreateInput) => Staff
  updateStaff: (id: string, input: Partial<Staff>) => Staff | undefined
  deactivateStaff: (id: string) => Staff | undefined
  reactivateStaff: (id: string) => Staff | undefined
  // Service users
  getServiceUser: (id: string) => ServiceUser | undefined
  getServiceUserList: (options?: { includeInactive?: boolean }) => ServiceUser[]
  searchServiceUsers: (query: string) => ServiceUser[]
  addServiceUser: (input: ServiceUserCreateInput) => ServiceUser
  updateServiceUser: (id: string, input: Partial<ServiceUser>) => ServiceUser | undefined
  deactivateServiceUser: (id: string) => ServiceUser | undefined
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
      id: generateId('staff'),
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

  const getServiceUser = useCallback(
    (id: string) => store.serviceUsers.find((u) => u.id === id),
    [store.serviceUsers]
  )

  const getServiceUserList = useCallback(
    (options?: { includeInactive?: boolean }) => {
      let list = [...store.serviceUsers]
      if (options?.includeInactive !== true) {
        list = list.filter((u) => u.isActive)
      }
      return list.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    },
    [store.serviceUsers]
  )

  const searchServiceUsers = useCallback(
    (query: string): ServiceUser[] => {
      const q = query.trim().toLowerCase()
      if (!q) return getServiceUserList()
      return getServiceUserList().filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.medicalInfo.toLowerCase().includes(q) ||
          u.preferences.toLowerCase().includes(q)
      )
    },
    [getServiceUserList]
  )

  const addServiceUser = useCallback((input: ServiceUserCreateInput): ServiceUser => {
    const now = new Date().toISOString()
    const serviceUser: ServiceUser = {
      id: generateId('su'),
      name: input.name,
      dateOfBirth: input.dateOfBirth,
      medicalInfo: input.medicalInfo ?? '',
      emergencyContacts: input.emergencyContacts ?? [],
      preferences: input.preferences ?? '',
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }
    setStore((prev) => ({ ...prev, serviceUsers: [...prev.serviceUsers, serviceUser] }))
    return serviceUser
  }, [])

  const updateServiceUser = useCallback(
    (id: string, input: Partial<ServiceUser>): ServiceUser | undefined => {
      const existing = store.serviceUsers.find((u) => u.id === id)
      if (!existing) return undefined
      const now = new Date().toISOString()
      const updated: ServiceUser = {
        ...existing,
        ...input,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: now,
      }
      setStore((prev) => {
        const index = prev.serviceUsers.findIndex((u) => u.id === id)
        if (index === -1) return prev
        const next = [...prev.serviceUsers]
        next[index] = updated
        return { ...prev, serviceUsers: next }
      })
      return updated
    },
    [store.serviceUsers]
  )

  const deactivateServiceUser = useCallback(
    (id: string): ServiceUser | undefined => updateServiceUser(id, { isActive: false }),
    [updateServiceUser]
  )

  const value = useMemo<DemoStoreContextValue>(
    () => ({
      ...store,
      getStaff,
      getStaffList,
      addStaff,
      updateStaff,
      deactivateStaff,
      reactivateStaff,
      getServiceUser,
      getServiceUserList,
      searchServiceUsers,
      addServiceUser,
      updateServiceUser,
      deactivateServiceUser,
    }),
    [
      store,
      getStaff,
      getStaffList,
      addStaff,
      updateStaff,
      deactivateStaff,
      reactivateStaff,
      getServiceUser,
      getServiceUserList,
      searchServiceUsers,
      addServiceUser,
      updateServiceUser,
      deactivateServiceUser,
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

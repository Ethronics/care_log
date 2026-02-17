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
import type { Shift, ShiftCreateInput } from '../types/shift'
import type { CareLog, CareLogCreateInput } from '../types/careLog'
import type { Absence, AbsenceCreateInput } from '../types/absence'
import { ABSENCE_STATUS } from '../types/absence'
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
          shifts: Array.isArray(parsed.shifts) ? parsed.shifts : [],
          careLogs: Array.isArray(parsed.careLogs) ? parsed.careLogs : [],
          absences: Array.isArray(parsed.absences) ? parsed.absences : [],
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

function parseStoreFromJson(raw: unknown): DemoStore | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  return {
    staff: Array.isArray(o.staff) ? o.staff as Staff[] : [],
    serviceUsers: Array.isArray(o.serviceUsers) ? o.serviceUsers as ServiceUser[] : [],
    shifts: Array.isArray(o.shifts) ? o.shifts as Shift[] : [],
    careLogs: Array.isArray(o.careLogs) ? o.careLogs as CareLog[] : [],
    absences: Array.isArray(o.absences) ? o.absences as Absence[] : [],
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
  // Shifts
  getShift: (id: string) => Shift | undefined
  getShifts: (options?: { from?: string; to?: string; staffId?: string }) => Shift[]
  addShift: (input: ShiftCreateInput) => Shift
  updateShift: (id: string, input: Partial<Shift>) => Shift | undefined
  deleteShift: (id: string) => boolean
  assignShift: (shiftId: string, staffId: string) => Shift | undefined
  unassignShift: (shiftId: string) => Shift | undefined
  /** Unassign all shifts in date range (for demo). Returns count unassigned. */
  unassignShiftsInRange: (from: string, to: string) => number
  // Care logs
  getCareLog: (id: string) => CareLog | undefined
  getCareLogsByServiceUser: (serviceUserId: string) => CareLog[]
  getCareLogs: (options?: { serviceUserId?: string; limit?: number }) => CareLog[]
  addCareLog: (input: CareLogCreateInput) => CareLog
  updateCareLog: (id: string, input: Partial<CareLog>) => CareLog | undefined
  deleteCareLog: (id: string) => boolean
  // Absences
  getAbsence: (id: string) => Absence | undefined
  getAbsences: (options?: { staffId?: string; status?: Absence['status'] }) => Absence[]
  getPendingAbsences: () => Absence[]
  addAbsence: (input: AbsenceCreateInput) => Absence
  updateAbsence: (id: string, input: Partial<Absence>) => Absence | undefined
  approveAbsence: (id: string, decidedBy: string) => Absence | undefined
  rejectAbsence: (id: string, decidedBy: string) => Absence | undefined
  // JSON file persistence
  exportDataAsJson: () => void
  importDataFromJson: (file: File) => Promise<void>
  /** Replace all data with the showcase seed (for demo/reset). */
  resetToDemoData: () => void
  // Automated rota builder (auto-fill)
  autoFillRota: (from: string, to: string) => { assigned: number; skipped: number }
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

  const getShift = useCallback(
    (id: string) => store.shifts.find((s) => s.id === id),
    [store.shifts]
  )

  const getShifts = useCallback(
    (options?: { from?: string; to?: string; staffId?: string }): Shift[] => {
      let list = [...store.shifts]
      if (options?.from) {
        list = list.filter((s) => s.date >= options.from!)
      }
      if (options?.to) {
        list = list.filter((s) => s.date <= options.to!)
      }
      if (options?.staffId !== undefined) {
        list = list.filter((s) => s.staffId === options.staffId)
      }
      return list.sort((a, b) => {
        const d = a.date.localeCompare(b.date)
        if (d !== 0) return d
        return a.startTime.localeCompare(b.startTime)
      })
    },
    [store.shifts]
  )

  const addShift = useCallback((input: ShiftCreateInput): Shift => {
    const now = new Date().toISOString()
    const shift: Shift = {
      id: generateId('shift'),
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      serviceUserId: input.serviceUserId,
      staffId: input.staffId ?? null,
      notes: input.notes ?? '',
      createdAt: now,
      updatedAt: now,
    }
    setStore((prev) => ({ ...prev, shifts: [...prev.shifts, shift] }))
    return shift
  }, [])

  const updateShift = useCallback(
    (id: string, input: Partial<Shift>): Shift | undefined => {
      const existing = store.shifts.find((s) => s.id === id)
      if (!existing) return undefined
      const now = new Date().toISOString()
      const updated: Shift = {
        ...existing,
        ...input,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: now,
      }
      setStore((prev) => {
        const index = prev.shifts.findIndex((s) => s.id === id)
        if (index === -1) return prev
        const next = [...prev.shifts]
        next[index] = updated
        return { ...prev, shifts: next }
      })
      return updated
    },
    [store.shifts]
  )

  const deleteShift = useCallback(
    (id: string): boolean => {
      const index = store.shifts.findIndex((s) => s.id === id)
      if (index === -1) return false
      setStore((prev) => ({ ...prev, shifts: prev.shifts.filter((s) => s.id !== id) }))
      return true
    },
    [store.shifts]
  )

  const assignShift = useCallback(
    (shiftId: string, staffId: string): Shift | undefined => updateShift(shiftId, { staffId }),
    [updateShift]
  )

  const unassignShift = useCallback(
    (shiftId: string): Shift | undefined => updateShift(shiftId, { staffId: null }),
    [updateShift]
  )

  const unassignShiftsInRange = useCallback(
    (from: string, to: string): number => {
      const toUnassign = store.shifts.filter(
        (s) => s.date >= from && s.date <= to && s.staffId != null
      )
      if (toUnassign.length === 0) return 0
      const ids = new Set(toUnassign.map((s) => s.id))
      const now = new Date().toISOString()
      setStore((prev) => ({
        ...prev,
        shifts: prev.shifts.map((s) =>
          ids.has(s.id) ? { ...s, staffId: null, updatedAt: now } : s
        ),
      }))
      return toUnassign.length
    },
    [store.shifts]
  )

  const getCareLog = useCallback(
    (id: string) => store.careLogs.find((l) => l.id === id),
    [store.careLogs]
  )

  const getCareLogsByServiceUser = useCallback(
    (serviceUserId: string): CareLog[] =>
      [...store.careLogs]
        .filter((l) => l.serviceUserId === serviceUserId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [store.careLogs]
  )

  const getCareLogs = useCallback(
    (options?: { serviceUserId?: string; limit?: number }): CareLog[] => {
      let list = [...store.careLogs]
      if (options?.serviceUserId) {
        list = list.filter((l) => l.serviceUserId === options.serviceUserId)
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      if (options?.limit) {
        list = list.slice(0, options.limit)
      }
      return list
    },
    [store.careLogs]
  )

  const addCareLog = useCallback((input: CareLogCreateInput): CareLog => {
    const now = new Date().toISOString()
    const log: CareLog = {
      id: generateId('log'),
      serviceUserId: input.serviceUserId,
      authorId: input.authorId,
      type: input.type,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    }
    setStore((prev) => ({ ...prev, careLogs: [...prev.careLogs, log] }))
    return log
  }, [])

  const updateCareLog = useCallback(
    (id: string, input: Partial<CareLog>): CareLog | undefined => {
      const existing = store.careLogs.find((l) => l.id === id)
      if (!existing) return undefined
      const now = new Date().toISOString()
      const updated: CareLog = {
        ...existing,
        ...input,
        id: existing.id,
        serviceUserId: existing.serviceUserId,
        authorId: existing.authorId,
        createdAt: existing.createdAt,
        updatedAt: now,
      }
      setStore((prev) => {
        const index = prev.careLogs.findIndex((l) => l.id === id)
        if (index === -1) return prev
        const next = [...prev.careLogs]
        next[index] = updated
        return { ...prev, careLogs: next }
      })
      return updated
    },
    [store.careLogs]
  )

  const deleteCareLog = useCallback(
    (id: string): boolean => {
      const index = store.careLogs.findIndex((l) => l.id === id)
      if (index === -1) return false
      setStore((prev) => ({ ...prev, careLogs: prev.careLogs.filter((l) => l.id !== id) }))
      return true
    },
    [store.careLogs]
  )

  const getAbsence = useCallback(
    (id: string) => store.absences.find((a) => a.id === id),
    [store.absences]
  )

  const getAbsences = useCallback(
    (options?: { staffId?: string; status?: Absence['status'] }): Absence[] => {
      let list = [...store.absences]
      if (options?.staffId) list = list.filter((a) => a.staffId === options.staffId)
      if (options?.status) list = list.filter((a) => a.status === options.status)
      return list.sort(
        (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      )
    },
    [store.absences]
  )

  const getPendingAbsences = useCallback(
    (): Absence[] => getAbsences({ status: ABSENCE_STATUS.PENDING }),
    [getAbsences]
  )

  const addAbsence = useCallback((input: AbsenceCreateInput): Absence => {
    const now = new Date().toISOString()
    const absence: Absence = {
      id: generateId('abs'),
      staffId: input.staffId,
      startDate: input.startDate,
      endDate: input.endDate,
      type: input.type,
      status: ABSENCE_STATUS.PENDING,
      notes: input.notes ?? '',
      requestedAt: now,
      decidedAt: null,
      decidedBy: null,
    }
    setStore((prev) => ({ ...prev, absences: [...prev.absences, absence] }))
    return absence
  }, [])

  const updateAbsence = useCallback(
    (id: string, input: Partial<Absence>): Absence | undefined => {
      const existing = store.absences.find((a) => a.id === id)
      if (!existing) return undefined
      const updated: Absence = { ...existing, ...input }
      setStore((prev) => {
        const index = prev.absences.findIndex((a) => a.id === id)
        if (index === -1) return prev
        const next = [...prev.absences]
        next[index] = updated
        return { ...prev, absences: next }
      })
      return updated
    },
    [store.absences]
  )

  const approveAbsence = useCallback(
    (id: string, decidedBy: string): Absence | undefined => {
      const now = new Date().toISOString()
      return updateAbsence(id, { status: ABSENCE_STATUS.APPROVED, decidedAt: now, decidedBy })
    },
    [updateAbsence]
  )

  const rejectAbsence = useCallback(
    (id: string, decidedBy: string): Absence | undefined => {
      const now = new Date().toISOString()
      return updateAbsence(id, { status: ABSENCE_STATUS.REJECTED, decidedAt: now, decidedBy })
    },
    [updateAbsence]
  )

  const exportDataAsJson = useCallback(() => {
    const json = JSON.stringify(store, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `care_log_data_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [store])

  const importDataFromJson = useCallback(
    async (file: File): Promise<void> => {
      const text = await file.text()
      const parsed = JSON.parse(text) as unknown
      const next = parseStoreFromJson(parsed)
      if (next) {
        setStore(next)
      }
    },
    []
  )

  const resetToDemoData = useCallback(() => {
    setStore(getSeedStore())
  }, [])

  const autoFillRota = useCallback(
    (from: string, to: string): { assigned: number; skipped: number } => {
      const shifts = store.shifts.filter(
        (s) => s.date >= from && s.date <= to && !s.staffId
      )
      if (shifts.length === 0) {
        return { assigned: 0, skipped: 0 }
      }
      const approvedAbsences = store.absences.filter((a) => a.status === ABSENCE_STATUS.APPROVED)
      const staffList = store.staff.filter((s) => s.isActive).sort((a, b) => a.id.localeCompare(b.id))
      const isOnLeave = (staffId: string, date: string): boolean =>
        approvedAbsences.some(
          (a) => a.staffId === staffId && a.startDate <= date && a.endDate >= date
        )
      const sortedShifts = [...shifts].sort(
        (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
      )
      let rotationIndex = 0
      const assignments: { shiftId: string; staffId: string }[] = []
      for (const shift of sortedShifts) {
        const available = staffList.filter((s) => !isOnLeave(s.id, shift.date)).map((s) => s.id)
        if (available.length === 0) continue
        const staffId = available[rotationIndex % available.length]
        assignments.push({ shiftId: shift.id, staffId })
        rotationIndex++
      }
      if (assignments.length === 0) {
        return { assigned: 0, skipped: sortedShifts.length }
      }
      setStore((prev) => {
        const byId = new Map(assignments.map((a) => [a.shiftId, a.staffId]))
        return {
          ...prev,
          shifts: prev.shifts.map((s) =>
            byId.has(s.id) ? { ...s, staffId: byId.get(s.id)!, updatedAt: new Date().toISOString() } : s
          ),
        }
      })
      return { assigned: assignments.length, skipped: sortedShifts.length - assignments.length }
    },
    [store.shifts, store.absences, store.staff]
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
      getShift,
      getShifts,
      addShift,
      updateShift,
      deleteShift,
      assignShift,
      unassignShift,
      unassignShiftsInRange,
      getCareLog,
      getCareLogsByServiceUser,
      getCareLogs,
      addCareLog,
      updateCareLog,
      deleteCareLog,
      getAbsence,
      getAbsences,
      getPendingAbsences,
      addAbsence,
      updateAbsence,
      approveAbsence,
      rejectAbsence,
      exportDataAsJson,
      importDataFromJson,
      resetToDemoData,
      autoFillRota,
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
      getShift,
      getShifts,
      addShift,
      updateShift,
      deleteShift,
      assignShift,
      unassignShift,
      unassignShiftsInRange,
      getCareLog,
      getCareLogsByServiceUser,
      getCareLogs,
      addCareLog,
      updateCareLog,
      deleteCareLog,
      getAbsence,
      getAbsences,
      getPendingAbsences,
      addAbsence,
      updateAbsence,
      approveAbsence,
      rejectAbsence,
      exportDataAsJson,
      importDataFromJson,
      resetToDemoData,
      autoFillRota,
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

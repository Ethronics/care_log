import type { Role } from '../utils/constants'

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  isActive: boolean
  /** Training valid until this date (YYYY-MM-DD). Staff excluded from Auto-Fill when shift date is after this. */
  trainingExpiryDate?: string | null
  /** Contracted hours per week for fairness / overtime scoring in Auto-Fill. */
  contractedHoursPerWeek?: number | null
  createdAt: string // ISO
  updatedAt: string // ISO
}

export type StaffCreateInput = Omit<Staff, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> & {
  isActive?: boolean
}

export type StaffUpdateInput = Partial<Omit<Staff, 'id' | 'createdAt'>> & { updatedAt: string }

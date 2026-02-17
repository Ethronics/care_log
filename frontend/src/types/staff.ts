import type { Role } from '../utils/constants'

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  isActive: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
}

export type StaffCreateInput = Omit<Staff, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> & {
  isActive?: boolean
}

export type StaffUpdateInput = Partial<Omit<Staff, 'id' | 'createdAt'>> & { updatedAt: string }

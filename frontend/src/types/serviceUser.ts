export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface ServiceUser {
  id: string
  name: string
  dateOfBirth: string // ISO date (YYYY-MM-DD)
  medicalInfo: string
  emergencyContacts: EmergencyContact[]
  preferences: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ServiceUserCreateInput = Omit<
  ServiceUser,
  'id' | 'createdAt' | 'updatedAt' | 'isActive'
> & { isActive?: boolean }

export type ServiceUserUpdateInput = Partial<
  Omit<ServiceUser, 'id' | 'createdAt'>
> & { updatedAt: string }

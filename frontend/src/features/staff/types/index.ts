export type StaffRole = 'manager' | 'senior_carer' | 'carer'

export interface Staff {
  id: string
  name: string
  email: string
  phone?: string
  role: StaffRole
  photo?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateStaffInput {
  name: string
  email: string
  phone?: string
  role: StaffRole
  password: string
}

export interface UpdateStaffInput {
  name?: string
  email?: string
  phone?: string
  role?: StaffRole
  isActive?: boolean
}

export interface StaffListParams {
  page?: number
  limit?: number
  search?: string
  role?: StaffRole
  isActive?: boolean
}

export interface StaffListResponse {
  items: Staff[]
  total: number
  page: number
  limit: number
  totalPages: number
}

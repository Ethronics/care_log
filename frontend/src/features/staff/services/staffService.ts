import api from '../../../services/api'
import { Staff, CreateStaffInput, UpdateStaffInput, StaffListParams, StaffListResponse } from '../types'

// Mock data for development
const MOCK_STAFF: Staff[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@carelog.com',
    phone: '+44 7700 900123',
    role: 'manager',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@carelog.com',
    phone: '+44 7700 900124',
    role: 'senior_carer',
    isActive: true,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.williams@carelog.com',
    phone: '+44 7700 900125',
    role: 'carer',
    isActive: true,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@carelog.com',
    phone: '+44 7700 900126',
    role: 'carer',
    isActive: true,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@carelog.com',
    phone: '+44 7700 900127',
    role: 'carer',
    isActive: false,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
]

let mockStaffData = [...MOCK_STAFF]
let nextId = 6

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const staffService = {
  /**
   * Get list of staff members with pagination and filters
   */
  async getStaffList(params: StaffListParams = {}): Promise<StaffListResponse> {
    await delay(500) // Simulate API call

    let filtered = [...mockStaffData]

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchLower) ||
          staff.email.toLowerCase().includes(searchLower) ||
          staff.phone?.toLowerCase().includes(searchLower)
      )
    }

    // Apply role filter
    if (params.role) {
      filtered = filtered.filter((staff) => staff.role === params.role)
    }

    // Apply active filter
    if (params.isActive !== undefined) {
      filtered = filtered.filter((staff) => staff.isActive === params.isActive)
    }

    const total = filtered.length
    const page = params.page || 1
    const limit = params.limit || 10
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit

    const items = filtered.slice(start, end)

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    }

    // Real API call (commented out for now)
    // const response = await api.get<StaffListResponse>('/staff', { params })
    // return response.data
  },

  /**
   * Get a single staff member by ID
   */
  async getStaffById(id: string): Promise<Staff> {
    await delay(300)

    const staff = mockStaffData.find((s) => s.id === id)
    if (!staff) {
      throw new Error('Staff member not found')
    }

    return staff

    // Real API call
    // const response = await api.get<Staff>(`/staff/${id}`)
    // return response.data
  },

  /**
   * Create a new staff member
   */
  async createStaff(input: CreateStaffInput): Promise<Staff> {
    await delay(500)

    const newStaff: Staff = {
      id: String(nextId++),
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockStaffData.push(newStaff)
    return newStaff

    // Real API call
    // const response = await api.post<Staff>('/staff', input)
    // return response.data
  },

  /**
   * Update a staff member
   */
  async updateStaff(id: string, input: UpdateStaffInput): Promise<Staff> {
    await delay(400)

    const index = mockStaffData.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error('Staff member not found')
    }

    const updatedStaff: Staff = {
      ...mockStaffData[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }

    mockStaffData[index] = updatedStaff
    return updatedStaff

    // Real API call
    // const response = await api.patch<Staff>(`/staff/${id}`, input)
    // return response.data
  },

  /**
   * Deactivate a staff member (soft delete)
   */
  async deleteStaff(id: string): Promise<void> {
    await delay(300)

    const index = mockStaffData.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error('Staff member not found')
    }

    mockStaffData[index] = {
      ...mockStaffData[index],
      isActive: false,
      updatedAt: new Date().toISOString(),
    }

    // Real API call
    // await api.delete(`/staff/${id}`)
  },

  /**
   * Upload profile photo
   */
  async uploadPhoto(id: string, file: File): Promise<Staff> {
    await delay(800)

    const index = mockStaffData.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error('Staff member not found')
    }

    // In real implementation, this would upload to a storage service
    // For mock, we'll just simulate a photo URL
    const photoUrl = URL.createObjectURL(file)

    const updatedStaff: Staff = {
      ...mockStaffData[index],
      photo: photoUrl,
      updatedAt: new Date().toISOString(),
    }

    mockStaffData[index] = updatedStaff
    return updatedStaff

    // Real API call
    // const formData = new FormData()
    // formData.append('photo', file)
    // const response = await api.post<Staff>(`/staff/${id}/photo`, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // })
    // return response.data
  },
}

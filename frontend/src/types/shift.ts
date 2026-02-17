export interface Shift {
  id: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  serviceUserId: string
  staffId: string | null // null = unassigned
  notes: string
  createdAt: string
  updatedAt: string
}

export type ShiftCreateInput = Omit<Shift, 'id' | 'createdAt' | 'updatedAt'> & {
  staffId?: string | null
}

export type ShiftUpdateInput = Partial<Omit<Shift, 'id' | 'createdAt'>> & { updatedAt: string }

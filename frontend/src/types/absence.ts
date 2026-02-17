export const ABSENCE_TYPES = {
  SICK: 'sick',
  ANNUAL: 'annual',
  OTHER: 'other',
} as const

export type AbsenceType = (typeof ABSENCE_TYPES)[keyof typeof ABSENCE_TYPES]

export const ABSENCE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export type AbsenceStatus = (typeof ABSENCE_STATUS)[keyof typeof ABSENCE_STATUS]

export interface Absence {
  id: string
  staffId: string
  startDate: string // YYYY-MM-DD
  endDate: string
  type: AbsenceType
  status: AbsenceStatus
  notes: string
  requestedAt: string
  decidedAt: string | null
  decidedBy: string | null // staff id of admin who decided
}

export type AbsenceCreateInput = Omit<
  Absence,
  'id' | 'status' | 'requestedAt' | 'decidedAt' | 'decidedBy'
>

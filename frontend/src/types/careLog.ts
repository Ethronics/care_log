export const CARE_LOG_TYPES = {
  FOOD: 'food',
  MEDICATION: 'medication',
  MOOD: 'mood',
  GENERAL: 'general',
} as const

export type CareLogType = (typeof CARE_LOG_TYPES)[keyof typeof CARE_LOG_TYPES]

export interface CareLog {
  id: string
  serviceUserId: string
  authorId: string // staff id
  type: CareLogType
  content: string
  /** Optional: original voice/raw transcript when content was summarized on save */
  rawContent?: string
  createdAt: string
  updatedAt: string
}

export type CareLogCreateInput = Omit<CareLog, 'id' | 'createdAt' | 'updatedAt'>

export type CareLogUpdateInput = Partial<Omit<CareLog, 'id' | 'serviceUserId' | 'authorId' | 'createdAt'>> & {
  updatedAt: string
}

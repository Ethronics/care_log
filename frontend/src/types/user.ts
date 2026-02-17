import type { Role } from '../utils/constants'

export interface User {
  email: string
  role: Role
  name?: string
}

export type { Role }

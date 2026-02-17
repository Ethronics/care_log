import type { Staff } from './staff'

export interface DemoStore {
  staff: Staff[]
  // Future: serviceUsers, shifts, careLogs, absences
}

export const DEFAULT_DEMO_STORE: DemoStore = {
  staff: [],
}

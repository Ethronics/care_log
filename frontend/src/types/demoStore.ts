import type { Staff } from './staff'
import type { ServiceUser } from './serviceUser'
import type { Shift } from './shift'
import type { CareLog } from './careLog'
import type { Absence } from './absence'

export interface DemoStore {
  staff: Staff[]
  serviceUsers: ServiceUser[]
  shifts: Shift[]
  careLogs: CareLog[]
  absences: Absence[]
}

export const DEFAULT_DEMO_STORE: DemoStore = {
  staff: [],
  serviceUsers: [],
  shifts: [],
  careLogs: [],
  absences: [],
}

import type { Staff } from './staff'
import type { ServiceUser } from './serviceUser'

export interface DemoStore {
  staff: Staff[]
  serviceUsers: ServiceUser[]
}

export const DEFAULT_DEMO_STORE: DemoStore = {
  staff: [],
  serviceUsers: [],
}

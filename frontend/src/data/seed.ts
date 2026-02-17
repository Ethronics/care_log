import { ROLES } from '../utils/constants'
import type { DemoStore } from '../types/demoStore'
import type { Staff } from '../types/staff'

function iso(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - offsetDays)
  return d.toISOString()
}

export function seedStaff(): Staff[] {
  return [
    {
      id: 'seed-1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+44 7700 900001',
      role: ROLES.ADMIN,
      isActive: true,
      createdAt: iso(30),
      updatedAt: iso(0),
    },
    {
      id: 'seed-2',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+44 7700 900002',
      role: ROLES.STAFF,
      isActive: true,
      createdAt: iso(20),
      updatedAt: iso(0),
    },
    {
      id: 'seed-3',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+44 7700 900003',
      role: ROLES.STAFF,
      isActive: true,
      createdAt: iso(10),
      updatedAt: iso(0),
    },
  ]
}

export function getSeedStore(): DemoStore {
  return {
    staff: seedStaff(),
  }
}

import { ROLES } from '../utils/constants'
import type { DemoStore } from '../types/demoStore'
import type { Staff } from '../types/staff'
import type { ServiceUser } from '../types/serviceUser'

function iso(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - offsetDays)
  return d.toISOString()
}

function isoDate(y: number, m: number, d: number): string {
  return new Date(y, m - 1, d).toISOString().slice(0, 10)
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

export function seedServiceUsers(): ServiceUser[] {
  const now = iso(0)
  return [
    {
      id: 'su-seed-1',
      name: 'Margaret Williams',
      dateOfBirth: isoDate(1935, 6, 12),
      medicalInfo: 'Hypertension, type 2 diabetes. Allergies: penicillin.',
      emergencyContacts: [
        { name: 'David Williams', relationship: 'Son', phone: '+44 7700 911001' },
      ],
      preferences: 'Prefers morning shower. Likes tea with milk.',
      isActive: true,
      createdAt: iso(60),
      updatedAt: now,
    },
    {
      id: 'su-seed-2',
      name: 'Arthur Brown',
      dateOfBirth: isoDate(1948, 11, 3),
      medicalInfo: 'Mobility support. No known allergies.',
      emergencyContacts: [
        { name: 'Susan Brown', relationship: 'Daughter', phone: '+44 7700 911002' },
      ],
      preferences: 'Enjoys radio. Prefers later breakfast.',
      isActive: true,
      createdAt: iso(45),
      updatedAt: now,
    },
  ]
}

export function getSeedStore(): DemoStore {
  return {
    staff: seedStaff(),
    serviceUsers: seedServiceUsers(),
  }
}

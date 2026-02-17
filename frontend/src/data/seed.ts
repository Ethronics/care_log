import { ROLES } from '../utils/constants'
import type { DemoStore } from '../types/demoStore'
import type { Staff } from '../types/staff'
import type { ServiceUser } from '../types/serviceUser'
import type { Shift } from '../types/shift'
import type { CareLog } from '../types/careLog'
import { CARE_LOG_TYPES } from '../types/careLog'
import type { Absence } from '../types/absence'
import { ABSENCE_TYPES, ABSENCE_STATUS } from '../types/absence'

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

function dateOffset(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export function seedShifts(): Shift[] {
  const now = iso(0)
  const today = dateOffset(0)
  const tomorrow = dateOffset(1)
  return [
    {
      id: 'shift-seed-1',
      date: today,
      startTime: '09:00',
      endTime: '12:00',
      serviceUserId: 'su-seed-1',
      staffId: 'seed-2',
      notes: 'Morning visit',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'shift-seed-2',
      date: today,
      startTime: '14:00',
      endTime: '17:00',
      serviceUserId: 'su-seed-2',
      staffId: null,
      notes: 'Afternoon visit',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'shift-seed-3',
      date: tomorrow,
      startTime: '10:00',
      endTime: '13:00',
      serviceUserId: 'su-seed-1',
      staffId: 'seed-3',
      notes: '',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

export function seedCareLogs(): CareLog[] {
  const now = iso(0)
  const earlier = iso(1)
  return [
    {
      id: 'log-seed-1',
      serviceUserId: 'su-seed-1',
      authorId: 'seed-2',
      type: CARE_LOG_TYPES.MEDICATION,
      content: 'Morning medications given as prescribed. No issues.',
      createdAt: earlier,
      updatedAt: earlier,
    },
    {
      id: 'log-seed-2',
      serviceUserId: 'su-seed-1',
      authorId: 'seed-2',
      type: CARE_LOG_TYPES.FOOD,
      content: 'Breakfast: porridge, toast, tea. Ate well. Mood good.',
      createdAt: earlier,
      updatedAt: earlier,
    },
    {
      id: 'log-seed-3',
      serviceUserId: 'su-seed-2',
      authorId: 'seed-3',
      type: CARE_LOG_TYPES.MOOD,
      content: 'Calm and engaged. Enjoyed listening to the radio.',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

export function seedAbsences(): Absence[] {
  const now = iso(0)
  const nextWeek = dateOffset(7)
  const nextWeekEnd = dateOffset(9)
  return [
    {
      id: 'abs-seed-1',
      staffId: 'seed-2',
      startDate: nextWeek,
      endDate: nextWeekEnd,
      type: ABSENCE_TYPES.ANNUAL,
      status: ABSENCE_STATUS.PENDING,
      notes: 'Family holiday',
      requestedAt: now,
      decidedAt: null,
      decidedBy: null,
    },
  ]
}

export function getSeedStore(): DemoStore {
  return {
    staff: seedStaff(),
    serviceUsers: seedServiceUsers(),
    shifts: seedShifts(),
    careLogs: seedCareLogs(),
    absences: seedAbsences(),
  }
}

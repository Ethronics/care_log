import { ROLES, STAFF_LEVELS } from '../utils/constants'
import type { DemoStore } from '../types/demoStore'
import type { Staff } from '../types/staff'
import type { ServiceUser } from '../types/serviceUser'
import type { Shift } from '../types/shift'
import type { CareLog } from '../types/careLog'
import { CARE_LOG_TYPES } from '../types/careLog'
import type { Absence } from '../types/absence'
import { ABSENCE_TYPES, ABSENCE_STATUS } from '../types/absence'
import { getWeekRange, getWeekDays } from '../pages/rota/weekUtils'

function iso(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - offsetDays)
  return d.toISOString()
}

function isoDate(y: number, m: number, d: number): string {
  return new Date(y, m - 1, d).toISOString().slice(0, 10)
}

/** YYYY-MM-DD for a date + N days (local calendar) */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const now = iso(0)
const today = new Date().toISOString().slice(0, 10)
const trainingExpired = addDays(today, -30)
const trainingValid = addDays(today, 90)

// --- Staff: 1 admin + 4 staff (one inactive). Training & contract for Auto-Fill. ---
export function seedStaff(): Staff[] {
  return [
    {
      id: 'seed-1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+44 7700 900001',
      role: ROLES.ADMIN,
      staffLevel: STAFF_LEVELS.SENIOR_CARER,
      isActive: true,
      trainingExpiryDate: trainingValid,
      contractedHoursPerWeek: 40,
      dbsCheckExpiry: addDays(today, 180),
      safeguardingCompletedDate: addDays(today, -60),
      createdAt: iso(30),
      updatedAt: now,
    },
    {
      id: 'seed-2',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+44 7700 900002',
      role: ROLES.STAFF,
      staffLevel: STAFF_LEVELS.SENIOR_CARER,
      isActive: true,
      trainingExpiryDate: trainingValid,
      contractedHoursPerWeek: 40,
      dbsCheckExpiry: addDays(today, 365),
      safeguardingCompletedDate: addDays(today, -120),
      createdAt: iso(20),
      updatedAt: now,
    },
    {
      id: 'seed-3',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+44 7700 900003',
      role: ROLES.STAFF,
      staffLevel: STAFF_LEVELS.SENIOR_CARER,
      isActive: true,
      trainingExpiryDate: trainingValid,
      contractedHoursPerWeek: 35,
      dbsCheckExpiry: addDays(today, 90),
      safeguardingCompletedDate: addDays(today, -30),
      createdAt: iso(10),
      updatedAt: now,
    },
    {
      id: 'seed-4',
      name: 'Tom Wilson',
      email: 'tom.wilson@example.com',
      phone: '+44 7700 900004',
      role: ROLES.STAFF,
      staffLevel: STAFF_LEVELS.CARER,
      isActive: true,
      trainingExpiryDate: trainingExpired,
      contractedHoursPerWeek: 40,
      dbsCheckExpiry: addDays(today, 200),
      safeguardingCompletedDate: addDays(today, -400),
      createdAt: iso(10),
      updatedAt: now,
    },
    {
      id: 'seed-5',
      name: 'Sarah Lee',
      email: 'sarah.lee@example.com',
      phone: '+44 7700 900005',
      role: ROLES.STAFF,
      staffLevel: STAFF_LEVELS.CARER,
      isActive: false,
      trainingExpiryDate: trainingValid,
      contractedHoursPerWeek: 40,
      dbsCheckExpiry: addDays(today, 365),
      safeguardingCompletedDate: addDays(today, -90),
      createdAt: iso(60),
      updatedAt: iso(5),
    },
  ]
}

// --- Service users: 4 with full details for list, detail, timeline ---
export function seedServiceUsers(): ServiceUser[] {
  return [
    {
      id: 'su-seed-1',
      name: 'Margaret Williams',
      dateOfBirth: isoDate(1935, 6, 12),
      medicalInfo: 'Hypertension, type 2 diabetes. Allergies: penicillin. Blood pressure monitored daily.',
      emergencyContacts: [
        { name: 'David Williams', relationship: 'Son', phone: '+44 7700 911001' },
        { name: 'Helen Williams', relationship: 'Daughter', phone: '+44 7700 911011' },
      ],
      preferences: 'Prefers morning shower. Likes tea with milk. Enjoys gardening programmes.',
      isActive: true,
      createdAt: iso(60),
      updatedAt: now,
    },
    {
      id: 'su-seed-2',
      name: 'Arthur Brown',
      dateOfBirth: isoDate(1948, 11, 3),
      medicalInfo: 'Mobility support, uses frame. No known allergies. Physio twice weekly.',
      emergencyContacts: [
        { name: 'Susan Brown', relationship: 'Daughter', phone: '+44 7700 911002' },
      ],
      preferences: 'Enjoys radio. Prefers later breakfast. Likes short walks when weather permits.',
      isActive: true,
      createdAt: iso(45),
      updatedAt: now,
    },
    {
      id: 'su-seed-3',
      name: 'Edith Clarke',
      dateOfBirth: isoDate(1940, 3, 22),
      medicalInfo: 'COPD, inhalers as prescribed. Diet: low sodium. Vision support.',
      emergencyContacts: [
        { name: 'James Clarke', relationship: 'Son', phone: '+44 7700 911003' },
        { name: 'Mary Clarke', relationship: 'Daughter', phone: '+44 7700 911033' },
      ],
      preferences: 'Likes classical music. Prefers small portions, frequent snacks.',
      isActive: true,
      createdAt: iso(30),
      updatedAt: now,
    },
    {
      id: 'su-seed-4',
      name: 'George Taylor',
      dateOfBirth: isoDate(1952, 8, 15),
      medicalInfo: 'Recovering from hip replacement. No allergies. Pain relief as needed.',
      emergencyContacts: [
        { name: 'Linda Taylor', relationship: 'Wife', phone: '+44 7700 911004' },
      ],
      preferences: 'Enjoys newspapers. Wants to be up by 8am. Prefers fish on Fridays.',
      isActive: true,
      createdAt: iso(20),
      updatedAt: now,
    },
  ]
}

// --- Shifts: 3 weeks (prev, current, next) so Rota always has data regardless of which week is shown ---
export function seedShifts(): Shift[] {
  const { from: weekMon } = getWeekRange(new Date())
  const shifts: Shift[] = []
  const serviceUserIds = ['su-seed-1', 'su-seed-2', 'su-seed-3', 'su-seed-4']
  const staffIds = ['seed-2', 'seed-3', 'seed-4']

  const slots: { start: string; end: string; suIndex: number; assign: number | null }[] = [
    { start: '08:00', end: '11:00', suIndex: 0, assign: 0 },
    { start: '09:00', end: '12:00', suIndex: 1, assign: 1 },
    { start: '10:00', end: '13:00', suIndex: 2, assign: null },
    { start: '14:00', end: '17:00', suIndex: 0, assign: 2 },
    { start: '15:00', end: '18:00', suIndex: 3, assign: null },
  ]

  const weekStarts = [addDays(weekMon, -7), weekMon, addDays(weekMon, 7)]
  let id = 1
  for (const start of weekStarts) {
    const days = getWeekDays(start)
    for (const date of days) {
      slots.forEach((slot) => {
        shifts.push({
          id: `shift-seed-${id}`,
          date,
          startTime: slot.start,
          endTime: slot.end,
          serviceUserId: serviceUserIds[slot.suIndex],
          staffId: slot.assign !== null ? staffIds[slot.assign] : null,
          notes: '',
          createdAt: now,
          updatedAt: now,
        })
        id++
      })
    }
  }

  return shifts
}

// --- Care logs: all 4 types, multiple per service user, different authors ---
export function seedCareLogs(): CareLog[] {
  const authors = ['seed-2', 'seed-3', 'seed-4']
  return [
    { id: 'log-seed-1', serviceUserId: 'su-seed-1', authorId: authors[0], type: CARE_LOG_TYPES.MEDICATION, content: 'Morning medications given as prescribed. BP 132/82. No issues.', createdAt: iso(0), updatedAt: iso(0) },
    { id: 'log-seed-2', serviceUserId: 'su-seed-1', authorId: authors[0], type: CARE_LOG_TYPES.FOOD, content: 'Breakfast: porridge, toast, tea. Ate well. Fluid intake good.', createdAt: iso(0), updatedAt: iso(0) },
    { id: 'log-seed-3', serviceUserId: 'su-seed-1', authorId: authors[1], type: CARE_LOG_TYPES.MOOD, content: 'Calm and chatty. Recalled family visit at weekend.', createdAt: iso(1), updatedAt: iso(1) },
    { id: 'log-seed-4', serviceUserId: 'su-seed-1', authorId: authors[1], type: CARE_LOG_TYPES.GENERAL, content: 'Assisted with shower. Dressed and ready for lunch. No concerns.', createdAt: iso(1), updatedAt: iso(1) },
    { id: 'log-seed-5', serviceUserId: 'su-seed-2', authorId: authors[1], type: CARE_LOG_TYPES.FOOD, content: 'Lunch: soup, sandwich, custard. Drank two cups of tea.', createdAt: iso(0), updatedAt: iso(0) },
    { id: 'log-seed-6', serviceUserId: 'su-seed-2', authorId: authors[2], type: CARE_LOG_TYPES.MOOD, content: 'Calm and engaged. Enjoyed listening to the radio.', createdAt: iso(0), updatedAt: iso(0) },
    { id: 'log-seed-7', serviceUserId: 'su-seed-2', authorId: authors[2], type: CARE_LOG_TYPES.MEDICATION, content: 'Lunchtime tablets taken. No side effects reported.', createdAt: iso(1), updatedAt: iso(1) },
    { id: 'log-seed-8', serviceUserId: 'su-seed-2', authorId: authors[0], type: CARE_LOG_TYPES.GENERAL, content: 'Short walk in garden with frame. Tired but happy.', createdAt: iso(2), updatedAt: iso(2) },
    { id: 'log-seed-9', serviceUserId: 'su-seed-3', authorId: authors[2], type: CARE_LOG_TYPES.MEDICATION, content: 'Inhalers used as prescribed. Breathing comfortable.', createdAt: iso(0), updatedAt: iso(0) },
    { id: 'log-seed-10', serviceUserId: 'su-seed-3', authorId: authors[0], type: CARE_LOG_TYPES.FOOD, content: 'Small breakfast. Snack at 11am. Fluids encouraged.', createdAt: iso(1), updatedAt: iso(1) },
    { id: 'log-seed-11', serviceUserId: 'su-seed-3', authorId: authors[1], type: CARE_LOG_TYPES.MOOD, content: 'Quiet but content. Listened to music this afternoon.', createdAt: iso(1), updatedAt: iso(1) },
    { id: 'log-seed-12', serviceUserId: 'su-seed-4', authorId: authors[0], type: CARE_LOG_TYPES.GENERAL, content: 'Mobilising with frame. Hip comfortable. No pain reported.', createdAt: iso(0), updatedAt: iso(0) },
    { id: 'log-seed-13', serviceUserId: 'su-seed-4', authorId: authors[2], type: CARE_LOG_TYPES.FOOD, content: 'Lunch: fish, vegetables, pudding. Good appetite.', createdAt: iso(0), updatedAt: iso(0) },
  ]
}

// --- Absences: pending (approve/reject), approved (excluded from Auto-Fill), rejected ---
export function seedAbsences(): Absence[] {
  const { from: weekMon } = getWeekRange(new Date())
  const wed = addDays(weekMon, 2)
  const thu = addDays(weekMon, 3)
  const nextWeek = addDays(weekMon, 7)
  const nextWeekEnd = addDays(weekMon, 9)
  const lastWeek = addDays(weekMon, -7)
  const lastWeekEnd = addDays(weekMon, -5)

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
    {
      id: 'abs-seed-2',
      staffId: 'seed-4',
      startDate: nextWeek,
      endDate: addDays(nextWeek, 1),
      type: ABSENCE_TYPES.SICK,
      status: ABSENCE_STATUS.PENDING,
      notes: 'Dental appointment',
      requestedAt: now,
      decidedAt: null,
      decidedBy: null,
    },
    {
      id: 'abs-seed-3',
      staffId: 'seed-3',
      startDate: wed,
      endDate: thu,
      type: ABSENCE_TYPES.ANNUAL,
      status: ABSENCE_STATUS.APPROVED,
      notes: 'Short break',
      requestedAt: iso(5),
      decidedAt: iso(2),
      decidedBy: 'seed-1',
    },
    {
      id: 'abs-seed-4',
      staffId: 'seed-4',
      startDate: lastWeek,
      endDate: lastWeekEnd,
      type: ABSENCE_TYPES.OTHER,
      status: ABSENCE_STATUS.REJECTED,
      notes: 'Personal day – cover shortage',
      requestedAt: iso(10),
      decidedAt: iso(9),
      decidedBy: 'seed-1',
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

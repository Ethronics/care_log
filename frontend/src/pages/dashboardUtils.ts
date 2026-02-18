import { getWeekRange } from './rota/weekUtils'

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function getThisWeekRange(): { from: string; to: string } {
  return getWeekRange(new Date())
}

/** Last 7 days including today: [today-6, ..., today] */
export function getLast7Days(): string[] {
  const today = todayISO()
  const out: string[] = []
  for (let i = 6; i >= 0; i--) {
    out.push(addDays(today, -i))
  }
  return out
}

/** Get week days (Mon–Sun) for the current week */
export function getThisWeekDays(): string[] {
  const { from } = getThisWeekRange()
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    days.push(addDays(from, i))
  }
  return days
}

export function formatDayLabel(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' })
}

export function formatDayShort(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/** Care log createdAt is ISO string; return YYYY-MM-DD */
export function careLogDate(createdAt: string): string {
  return createdAt.slice(0, 10)
}

/**
 * Week boundaries (Monday–Sunday) for a given date
 */
export function getWeekRange(date: Date): { from: string; to: string } {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d)
  monday.setDate(diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    from: monday.toISOString().slice(0, 10),
    to: sunday.toISOString().slice(0, 10),
  }
}

export function formatWeekLabel(from: string): string {
  const m = new Date(from + 'T12:00:00')
  const sun = new Date(m)
  sun.setDate(m.getDate() + 6)
  return `${m.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${sun.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export function addWeek(from: string, delta: number): string {
  const d = new Date(from + 'T12:00:00')
  d.setDate(d.getDate() + 7 * delta)
  return getWeekRange(d).from
}

export function getWeekDays(from: string): string[] {
  const days: string[] = []
  const d = new Date(from + 'T12:00:00')
  for (let i = 0; i < 7; i++) {
    const x = new Date(d)
    x.setDate(d.getDate() + i)
    days.push(x.toISOString().slice(0, 10))
  }
  return days
}

export function formatDayShort(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** Professional outline icons, 24×24, stroke 2, currentColor */

import type { CSSProperties } from 'react'

const iconClass = 'icon'

export function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="12" rx="1" />
    </svg>
  )
}

export function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

export function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function IconUserCircle({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  )
}

export function IconFileText({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

export function IconCalendarOff({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-1.2-1.8" />
      <path d="M21 15V6a2 2 0 0 0-2-2H9" />
      <path d="M3 10h18M16 2v4M8 2v4" />
      <path d="m2 2 20 20" />
    </svg>
  )
}

export function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

export function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export function IconPanelLeftClose({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18M15 15l3 3 3-3" />
    </svg>
  )
}

export function IconPanelLeftOpen({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18M15 9l3-3 3 3" />
    </svg>
  )
}

export function IconX({ className }: { className?: string }) {
  return (
    <svg className={className || iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

/** User with plus – assign or change staff */
export function IconUserPlus({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className || iconClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  )
}

# Frontend Execution Plan

This document defines the **frontend implementation plan** for Log My Care v1.0.
It is designed for **fast delivery**, **parallel backend development**, and
**healthcare-grade security expectations**, while intentionally avoiding
over-engineering.

---

## Objectives

- Deliver a **functional, production-ready frontend** for care management
- Integrate **directly with backend APIs** (no mock layer)
- Support **role-based authentication & authorization** (Manager, Carer, Senior Carer)
- Keep total frontend effort within **realistic timeframes** per feature
- **Mobile-first** design optimized for carers on-the-go

---

## Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | **React 19** | Industry-standard for enterprise web apps; component model fits reusable UI (cards, forms, lists). |
| Language | **TypeScript** | Strong typing reduces integration errors with parallel backend development and improves long-term maintainability. |
| Styling | **Vanilla CSS (CSS variables)** | Fastest implementation path; enables consistent theming and dark mode without framework overhead. |
| Routing | **React Router v7** | Clean routing for navigation and route-level access control. |
| State Management | **React Context + Hooks** | Sufficient for session and shared UI state without introducing heavy dependencies. |
| API Communication | **Axios (centralized wrapper)** | Established library with interceptors for auth tokens and error handling. |
| Authentication | **JWT tokens (localStorage)** | Stateless authentication suitable for mobile apps; refresh token mechanism. |
| Build Tooling | **Vite** | Fast development and build times; simple setup for React + TypeScript. |
| PWA | **Service Worker (basic)** | App-like experience for mobile users; offline detection. |

---

## Operating Assumptions

- Backend APIs and contracts are available early and mostly stable
- Backend enforces all authentication and authorization rules
- Frontend focuses on presentation, state handling, and UX
- No mock or dummy API layer
- No automated tests included in v1.0
- Visual polish is healthcare-appropriate but intentionally minimal
- Mobile devices are primary use case for carers

---

## Frontend Scope & Effort

### Task Breakdown

| # | Area | Task | ETA (hrs) | Dependencies |
|---|------|------|-----------|--------------|
| 1 | Foundation | Project setup, global styles, base structure | 1 | None |
| 2 | Theme System | CSS variables, light/dark theme, theme toggle | 3 | 1 |
| 3 | UI Components | Core UI components (Button, Card, Input, Badge, Alert) | 4 | 2 |
| 4 | Routing & Layout | Routing, app shell, navigation, protected routes | 3 | 1, 3 |
| 5 | API Client | Secure API client (axios, interceptors, error handling) | 2 | 1 |
| 6 | Auth | Auth flow (login, register, token management, route guards) | 4 | 4, 5 |
| 7 | Staff Management | Staff list page, create/edit forms, profile views | 6 | 3, 4, 5, 6 |
| 8 | Service Users | Service user list, create/edit forms, profile views | 6 | 3, 4, 5, 6 |
| 9 | Rota/Scheduling | Calendar view, shift creation, manual assignment | 8 | 3, 4, 5, 6, 7 |
| 10 | Care Logging | Care log timeline, create log form, log types | 6 | 3, 4, 5, 6, 8 |
| 11 | Leave Management | Leave request form, approval workflow, calendar | 5 | 3, 4, 5, 6, 7 |
| 12 | Manager Dashboard | Dashboard widgets, stats, quick actions | 5 | 3, 4, 5, 6, 7-11 |
| 13 | Carer Dashboard | Personal dashboard, today's shifts, quick actions | 4 | 3, 4, 5, 6, 9, 10 |
| 14 | Error Handling | Error boundaries, loading states, empty states | 3 | All features |
| 15 | Mobile/PWA | Touch optimization, PWA manifest, service worker | 4 | All features |
| 16 | Polish | Final refinements, accessibility pass, testing | 5 | All features |

---

### Total Estimated Effort

> **68 hours**
> (~8.5 focused development days / ~1.7 weeks full-time)

---

## Deliverables

At completion, the frontend will provide:

- Secure role-based authentication and session handling
- Permission-aware navigation and routing
- Staff management (CRUD operations)
- Service user management (CRUD operations)
- Manual rota/scheduling with calendar view
- Care logging with timeline feed
- Leave request and approval workflow
- Manager dashboard with operational insights
- Carer dashboard with personal schedule
- Consistent loading, empty, and error states
- Mobile-optimized UI with PWA capabilities
- Light/dark theme support

---

## Explicitly Out of Scope (v1.0)

- Automated testing
- Advanced accessibility auditing (basic WCAG AA only)
- Visual refinement beyond healthcare-appropriate styling
- Auto-Fill scheduling algorithm (v2.0)
- Voice-to-Text transcription (v2.0)
- Training Matrix UI (v2.0)
- Medication management (eMAR) (v2.0)
- Payroll & hours tracking UI (v2.0)
- Real-time WebSocket updates (v2.0)
- Offline-first PWA sync (v2.0)
- Family Portal (Future)

---

## Security Posture (Frontend)

- JWT tokens stored in `localStorage` (refresh token mechanism)
- All API calls include `Authorization: Bearer <token>` header
- Authorization enforced by backend; frontend reflects access state only
- No rendering of untrusted HTML (React escapes by default)
- Clear handling of 401 (unauthenticated) vs 403 (unauthorized)
- Automatic token refresh on 401 responses
- Secure password input handling
- XSS protection via React's built-in escaping

---

## Mobile Optimization Requirements

- Minimum touch target size: **44x44px**
- Responsive design: mobile-first approach
- Viewport meta tag configured correctly
- Font size minimum: **16px** (prevents iOS zoom)
- PWA manifest for app-like experience
- Service worker for offline detection
- Fast page loads (< 2 seconds on 3G)

---

## Component Library

### Core Components (Already Implemented)

- **Button** - 7 variants (primary, secondary, outline, ghost, success, warning, error)
- **Card** - With header, body, footer support
- **Input** - With label, error, help text
- **Badge** - 6 variants for status indicators
- **Alert** - 4 variants for notifications
- **ThemeToggle** - Light/dark mode switcher

### Additional Components Needed

- **Modal/Dialog** - For confirmations and forms
- **Dropdown/Select** - Enhanced select component
- **Table** - For data listings
- **Pagination** - For paginated lists
- **Spinner/Loading** - Loading indicators
- **EmptyState** - Empty state messages
- **Navigation** - Mobile drawer, desktop sidebar

---

## API Integration Strategy

- **Centralized API client** (`src/services/api.ts`)
- **Request interceptors** for adding auth tokens
- **Response interceptors** for handling 401/403 errors
- **Error handling** with user-friendly messages
- **Loading states** managed at component level
- **No mock data** - direct backend integration

---

## Theme System

- **CSS Variables** for all colors, spacing, typography
- **Light theme** (default) - Healthcare professional
- **Dark theme** - Healthcare night mode
- **Automatic detection** of system preference
- **Manual toggle** with localStorage persistence
- **Smooth transitions** between themes

---

## Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement feature with components
   - Test manually on mobile devices
   - Integrate with backend API
   - Code review (if applicable)

2. **Styling Approach**
   - Use CSS variables from theme system
   - Mobile-first responsive design
   - Component-scoped styles when needed
   - Avoid inline styles (except for dynamic values)

3. **State Management**
   - Local component state for UI
   - Context for auth and global state
   - API calls in components or custom hooks
   - No Redux or complex state management

---

## Quality Standards

- **Code Quality**: TypeScript strict mode, ESLint compliance
- **Accessibility**: WCAG AA minimum (focus states, ARIA labels)
- **Performance**: Page load < 2s, smooth interactions
- **Mobile**: Tested on iOS and Android devices
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend API changes | High | Early API contract review, versioning |
| Mobile compatibility | Medium | Test on real devices early |
| Performance issues | Low | Optimize images, lazy loading |
| Scope creep | High | Strict feature boundaries, defer to v2 |

---

## Final Notes

This plan is intentionally constrained to:
- Minimize rework
- Enable parallel frontend/backend execution
- Deliver value quickly
- Maintain healthcare-grade security without unnecessary complexity
- Focus on mobile-first user experience

Any significant backend contract churn or scope expansion will impact
timeline and should be handled explicitly.

---

**Document Version:** 1.0
**Created:** 2024
**Last Updated:** 2024

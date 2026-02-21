# carePro — Remaining Scope (Mock / Frontend-Only)

**Document type:** Technical gap analysis  
**Audience:** Engineering & product; care operations / domain stakeholders  
**Scope:** Frontend MVP on mock data (localStorage); no backend or API integration.  
**References:** FEATURE_BREAKDOWN.md, software_documentation.md

---

## 1. Purpose and context

This document lists **outstanding functional and non-functional requirements** for the carePro frontend when running against the current mock data layer. It is the single source of truth for what remains to be implemented before the mock scope is complete, and for what is explicitly deferred or out of scope.

**In scope for this document:**

- Features and acceptance criteria from the project’s phased feature breakdown (F2–F5, C1–C5, D1–D2, T1–T2) that apply to the frontend.
- Gaps that can be closed without a backend (e.g. new routes, UI flows, client-side validation, PWA shell).

**Out of scope:**

- Backend implementation (F1, F3, real auth, persistence).
- Features that depend on real APIs, real-time, or server-driven notifications.
- Formal testing (T3) and deployment (T4) as separate workstreams.

**Status legend:**

| Status | Meaning |
|--------|--------|
| **Implemented** | Done in current codebase; meets stated acceptance criteria. |
| **Not implemented** | In scope for mock; not yet built. |
| **Partially implemented** | Part of the requirement exists; material gaps remain. |
| **Deferred** | Explicitly out of scope for this phase (e.g. backend, media upload). |
| **Not verified** | Implemented but not yet audited (e.g. accessibility). |

---

## 2. Phase 1 — Foundation (frontend)

Applicable items from F2 (Authentication & Authorization), F4 (Theme & UI), F5 (Routing & Layout). Backend auth (JWT, refresh, password reset) is deferred.

| Requirement | Status | Notes |
|-------------|--------|--------|
| Login (mock) | Implemented | Role-based mock login; no persistence. |
| Register (manager creates accounts) | **Not implemented** | F2. Mock: form to “create” user (e.g. add to mock store or in-memory list), then redirect to login or dashboard. No backend. |
| Password reset (forgot / reset) | **Not implemented** | F2. Mock: forgot-password and reset-password UI only (e.g. “Email sent” / “Password updated”); no email or token. |
| Theme (light/dark) | Implemented | Toggle; preference persisted (e.g. localStorage). |
| WCAG AA accessibility | **Not verified** | F4 acceptance. No formal audit or axe/lighthouse pass. |

---

## 3. Phase 2 — Core features

### 3.1 C1 — Staff (user management)

Staff CRUD, roles, training and contracted hours are in place. Gaps below.

| Requirement | Status | Notes |
|-------------|--------|--------|
| List, create, edit staff | Implemented | Roles, training expiry, contracted hours; list with training status. |
| **Staff detail view** | **Not implemented** | Read-only profile at `/staff/:id`. Required for manager drill-down and audit trail. List row should link to detail. |
| **DBS & safeguarding in staff form** | **Not implemented** | Profile page displays `dbsCheckExpiry` and `safeguardingCompletedDate`; admin create/edit form does not. Add optional fields to StaffForm and wire to store/seed so managers can set and maintain compliance data. |
| Profile photo upload | Deferred | No `photoUrl` on Staff type; requires backend/media. |

### 3.2 C2 — Service users

| Requirement | Status | Notes |
|-------------|--------|--------|
| List, create, edit, detail | Implemented | Medical info, preferences, emergency contacts. |
| Search | Implemented | By name, medical info, preferences. |
| Profile photo | Deferred | Backend/media. |

### 3.3 C3 — Rota and scheduling

Week view, shift CRUD, assign/unassign, Auto-Fill with overlap and eligibility are implemented.

| Requirement | Status | Notes |
|-------------|--------|--------|
| Week view, assign/unassign, Auto-Fill | Implemented | Overlap check; eligibility (leave, training); continuity/fairness scoring. |
| **Month view** | **Not implemented** | FEATURE_BREAKDOWN: “Calendar view (week/month)”. Only week view exists. Month improves planning and handover. |
| **Filter by staff** | **Not implemented** | “Filter by staff member”. Dropdown to show only shifts for a given staff member. |
| Location on shift | Deferred | Not on Shift type; optional for mock. |

### 3.4 C4 — Care logging

Create (inline in timeline), list with service-user filter, edit/delete with author/admin permissions are implemented.

| Requirement | Status | Notes |
|-------------|--------|--------|
| Create, list, edit, delete | Implemented | CareTimeline “Add log”; CareLogsListPage; CareLogEditPage with delete and permission check. |
| **Edit within time limit** | **Not implemented** | Requirement: “Edit own logs (within time limit)”. Currently any user with `canEdit` (admin or author) can edit regardless of age. Implement time window (e.g. 24h) for non-admin authors for audit and governance. |

### 3.5 C5 — Leave and absence

Request, list, approve/reject, and impact on Auto-Fill (approved = unavailable) are implemented.

| Requirement | Status | Notes |
|-------------|--------|--------|
| Request, list, approve/reject | Implemented | LeaveRequestForm; AbsencesPage; approval marks staff unavailable for rota. |
| **Leave calendar view** | **Not implemented** | “View leave calendar”. List only; add calendar (e.g. month grid) with leave blocks for capacity planning. |
| Leave request detail page | Optional | Dedicated `/absences/:id` for single request; currently inline in list. |
| Notifications on status change | Deferred | Backend/real-time. |

---

## 4. Phase 3 — Dashboards

### 4.1 D1 — Manager dashboard

KPIs, today’s shifts, unassigned count, recent care logs, pending leave, charts, quick actions, and data export/import/reset are implemented.

| Requirement | Status | Notes |
|-------------|--------|--------|
| Widgets, KPIs, charts, quick actions | Implemented | Export/import JSON; reset to demo; loading state on import. |
| **Staff availability summary** | **Partially implemented** | Rota page has eligibility panel (leave, training). No dedicated dashboard widget for “who is available this week” or at-a-glance availability. |
| **Alert notifications** | **Not implemented** | Prominent alert (e.g. “N unassigned shifts”) to surface operational risk; currently only in widget copy. |

### 4.2 D2 — Carer dashboard

Today’s shifts, upcoming 7 days, and my care logs this week are implemented.

| Requirement | Status | Notes |
|-------------|--------|--------|
| Today’s shifts, upcoming, quick links | Implemented | |
| **Recent service users** | **Not implemented** | “Recent service users”: list of people the carer has recently logged for or is assigned to. Supports continuity and quick access. |
| **Quick log entry** | **Partially implemented** | Link to care logs; no “Add log” from dashboard with service-user selector or last-used. |
| **Shift countdown / timer** | **Not implemented** | “Next shift in Xh” or similar. Improves carer readiness. |
| Task reminders | Deferred | Backend/notifications. |

---

## 5. Phase 4 — Polish (mock-relevant)

### 5.1 T1 — Error handling and validation

| Requirement | Status | Notes |
|-------------|--------|--------|
| Error boundary, 404, empty states, loading | Implemented | ErrorBoundary; NotFoundPage; EmptyState; loading on JSON import. |
| Form validation | Partially implemented | Some forms validate; consistency and clarity of messages can be improved. |
| **Import JSON error feedback** | **Not implemented** | On invalid JSON or parse failure, show user-facing error instead of failing silently. |

### 5.2 T2 — Mobile and PWA

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Touch targets ≥44px** | **Not verified** | No systematic audit. |
| **PWA manifest** | **Not implemented** | No `manifest.json`; installability and app shell not configured. |
| **Service worker** | **Not implemented** | No offline or install behaviour. |
| **Offline detection** | **Not implemented** | Optional: show “You’re offline” when `navigator.onLine` is false. |

### 5.3 T3 / T4 — Testing, documentation, deployment

Unit/E2E testing, user guide, and deployment are outside the mock front-end scope of this document; they remain in the overall project plan.

---

## 6. Recommended implementation order

Prioritisation for closing gaps within the mock scope, balancing impact, dependency, and effort.

1. **Compliance and data integrity**
   - DBS and safeguarding fields in Staff create/edit form (aligns profile display with manager-editable data).
   - Care log edit: enforce “within time limit” for non-admin authors (e.g. 24h).

2. **Resilience and validation**
   - Import JSON: surface parse/schema errors to the user.

3. **Missing views**
   - Staff detail view (`/staff/:id`).
   - Leave calendar (month view with leave blocks).
   - Register (mock) and password reset (mock UI only).

4. **Operational visibility**
   - Manager: staff availability summary widget and/or unassigned-shifts alert banner.
   - Carer: recent service users and quick “Add log” (e.g. service-user selector from dashboard).

5. **Rota**
   - Month view (optional but aligned with spec).
   - Filter rota by staff member.

6. **Mobile and PWA**
   - Touch target audit (≥44px).
   - PWA manifest and, if desired, minimal service worker and offline messaging.

---

## 7. Document control

| Version | Date | Changes |
|---------|------|--------|
| 1.0 | — | Initial gap analysis vs. FEATURE_BREAKDOWN and codebase. |

*This document is maintained against the current codebase and FEATURE_BREAKDOWN.md. Backend and API work are out of scope.*

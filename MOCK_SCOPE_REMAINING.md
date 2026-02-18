# Remaining Functionality & Requirements (Mock Scope)

This document lists what is **not yet implemented** in the frontend while still on mock data (no backend). It is aligned with **FEATURE_BREAKDOWN.md** and **software_documentation.md**.

---

## Phase 1 – Foundation (frontend only)

| Item | Status | Notes |
|------|--------|--------|
| **Login page** | Done | Mock login only. |
| **Register page** | Not implemented | F2: “Manager creates accounts”. Mock: simple form that adds a mock user and redirects to login or dashboard. |
| **Password reset pages** | Not implemented | F2: Forgot password + Reset password. Mock: UI flow only (e.g. “Email sent” message, no real email). |
| **Theme (light/dark)** | Done | Toggle, persists. |
| **WCAG AA** | Not verified | F4 acceptance: “Accessible (WCAG AA)” – no audit done. |

---

## Phase 2 – Core features

### C1: Staff (User management)

| Item | Status | Notes |
|------|--------|--------|
| List / Create / Edit | Done | Staff list, create, edit with role, training, contracted hours. |
| **Staff detail view** | Not implemented | Read-only profile at e.g. `/staff/:id` (no route yet). List row could link to detail. |
| Photo upload | Not in scope | No `photoUrl` on Staff type; doc mentions “Upload profile photos” – defer to backend. |
| **DBS & Safeguarding in Staff form** | Not implemented | Profile page shows them; admin create/edit form does not. Add optional fields to StaffForm (and seed/update) so managers can set DBS expiry and safeguarding date. |

### C2: Service users

| Item | Status | Notes |
|------|--------|--------|
| List / Create / Edit / Detail | Done | Search implemented. Emergency contacts, medical info, preferences in forms. |
| Profile photo | Not in scope | Defer to backend. |

### C3: Rota / scheduling

| Item | Status | Notes |
|------|--------|--------|
| Week view, create/edit shift, assign/unassign, Auto-Fill | Done | Overlap check, eligibility panel. |
| **Month view** | Not implemented | Doc: “Calendar view (week/month)”. Only week exists. |
| **Filter by staff on rota** | Not implemented | Doc: “Filter by staff member”. Optional dropdown to show only shifts for one staff. |
| Location on shift | Not in scope | Shift type has no `location`; doc mentions it – optional for mock. |

### C4: Care logging

| Item | Status | Notes |
|------|--------|--------|
| Create log (inline in timeline) | Done | CareTimeline “Add log” + CareLogForm. |
| List with filter by service user | Done | CareLogsListPage. |
| Edit / Delete (with permissions) | Done | CareLogEditPage: admin or author can edit; delete with confirm. |
| **Edit “within time limit”** | Not implemented | Doc: “Edit own logs (within time limit)”. No time window (e.g. 24h) enforced; anyone with `canEdit` can edit anytime. |

### C5: Leave & absence

| Item | Status | Notes |
|------|--------|--------|
| Request leave, list, approve/reject | Done | LeaveRequestForm, AbsencesPage, AbsenceCard. |
| **Leave calendar view** | Not implemented | Doc: “View leave calendar”. Current UI is list only; no calendar (e.g. month grid with leave blocks). |
| **Leave request detail page** | Optional | Doc: “Leave Request Detail”. Single-request view exists inline in list; dedicated `/absences/:id` possible. |
| Notifications on status change | Not in scope (mock) | Would need toast or in-app notice; typically backend-driven. |

---

## Phase 3 – Dashboards

### D1: Manager dashboard

| Item | Status | Notes |
|------|--------|--------|
| Today’s shifts, unassigned count, recent logs, pending leave, KPIs, quick actions, charts | Done | Export/Import/Reset, loading state for import. |
| **Staff availability summary** | Partially done | Rota “eligibility” panel covers leave/training; no dedicated “who’s available this week” widget on dashboard. |
| **Alert notifications** | Not implemented | E.g. “3 unassigned shifts” as prominent alert banner; currently only in widgets. |

### D2: Carer dashboard

| Item | Status | Notes |
|------|--------|--------|
| Today’s shifts, upcoming 7 days, quick links, my care logs this week | Done | |
| **Recent service users** | Not implemented | Doc: “Recent service users”. List of service users the carer has recently logged for or is assigned to. |
| **Quick log entry** | Partial | Link to Care logs; could add “Add log” that opens service-user selector or last-used. |
| **Shift countdown / timer** | Not implemented | “Next shift in 2h” or similar. |
| **Task reminders** | Not implemented | Defer to backend/notifications. |

---

## Phase 4 – Polish (mock-relevant)

### T1: Error handling & validation

| Item | Status | Notes |
|------|--------|--------|
| Error boundary, 404 page, empty states, loading (e.g. import) | Done | |
| Form validation messages | Partial | Some forms validate; not all fields have consistent “clear” messages. |
| **Import JSON error feedback** | Optional | If `importDataFromJson` fails (invalid JSON), show error message instead of silent fail. |

### T2: Mobile & PWA

| Item | Status | Notes |
|------|--------|--------|
| **Touch targets ≥44px** | Not verified | No audit. |
| **PWA manifest** | Not implemented | No `manifest.json` or similar. |
| **Service worker** | Not implemented | No offline/install. |
| **Offline detection** | Not implemented | Optional: show “You’re offline” when `navigator.onLine` is false. |

### T3 / T4: Testing, docs, deployment

| Item | Status | Notes |
|------|--------|--------|
| Unit / E2E tests | Not in scope for “mock scope” list | Documented in Phase 4 but not front-end mock features. |
| User guide / deployment | Same | N/A for this list. |

---

## Summary: suggested order (mock only)

1. **Quick wins**  
   - DBS & Safeguarding in Staff create/edit form.  
   - Import JSON: show error message on invalid file.  
   - Care log edit: optional “within time limit” (e.g. 24h) for non-admin.

2. **Missing pages / views**  
   - Staff detail view (`/staff/:id`).  
   - Leave calendar view (month grid with leave blocks).  
   - Register page (mock) and Password reset flow (mock UI only).

3. **Dashboard improvements**  
   - Manager: staff availability summary widget and/or alert banner for unassigned shifts.  
   - Carer: recent service users, quick “Add log” (e.g. service user selector).

4. **Rota**  
   - Month view (optional).  
   - Filter rota by staff member.

5. **Mobile / PWA**  
   - Touch target pass, PWA manifest, optional service worker and offline message.

---

*Last updated from codebase and FEATURE_BREAKDOWN.md – mock scope only; backend/API work is out of scope for this list.*

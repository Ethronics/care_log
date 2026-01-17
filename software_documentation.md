# Log My Care – Software Design Document (SDD)

**Product:** Log My Care – Smart Edition
**Version:** 1.0
**Status:** Draft for Approval

---

## Primary Goal

Replace paper-based care management with an intelligent, efficient, and user-friendly digital platform.

---

## 1. Introduction

### 1.1 Purpose

This document defines the **architecture**, **functional scope**, **core workflows**, **data model**, and **technical design** for the Log My Care – Smart Edition application.

### 1.2 Scope

The system digitizes care workflows for care homes and home care agencies, including:

* Staff management (profiles, roles, qualifications)
* Shift scheduling (rota) with Auto-Fill
* Care delivery logging (timeline feed) with voice-to-text
* Leave and absence management with rota impact detection
* Compliance (training matrix and expiry enforcement)
* Health monitoring (fluids, medication/eMAR, incidents)
* Payroll and hours tracking (planned vs. actual)

---

## 2. System Overview

### 2.1 User Roles

1. **System Administrator / Manager** – Full access to staff, rotas, compliance, reporting, and finance
2. **Senior Carer** – Access to care planning, medication management (eMAR), and escalations
3. **Care Assistant (Carer)** – Access to assigned visits/shifts, daily logs, and own profile/rota
4. **Observer / Family (Optional / Future)** – Read-only access to approved service-user timeline

---

### 2.2 High-Level Architecture

**Frontend**

* React SPA (PWA-ready)
* Mobile-first UI

**Backend**

* REST API (Node.js/Express or Next.js API routes)

**Database**

* PostgreSQL (relational data model for staff, shifts, service users, and logs)

**Real-Time**

* WebSockets or Server-Sent Events (SSE)
* Live updates for care logs, shift changes, and alerts

**Smart Services**

* **Auto-Fill Engine:** Heuristic constraint solver with scoring
* **Voice-to-Text:** Browser Web Speech API with optional server-side fallback

> *Reference: Architecture diagram (PDF page 3)*

---

## 3. Functional Requirements (Modules)

### 3.1 Team Management

* Create and edit staff profiles (name, role, contact, photo)
* Maintain qualifications and Training Matrix
* Leave integration:

  * Staff submit sick or annual leave
  * Manager approval workflow
  * Approved leave marks staff as **UNAVAILABLE** for rota

---

### 3.2 Rota & Scheduling (Intelligent)

* View rota by week or month
* Filter by team or individual
* Create shifts (time, role, location)

**Auto-Fill Scheduling considers:**

* Availability and leave status
* Role and skill match
* Training validity
* Contract hours and overtime preference

---

### 3.3 Care Delivery ("Care Office")

* Service user dashboard with timeline feed
* Log entries for:

  * Food and fluids
  * Medication
  * Mood and observations
  * Incidents and notes
* Voice input with real-time transcription

---

### 3.4 Compliance & Training Matrix

* Skills matrix (staff vs. qualification)
* Training expiry status:

  * **Green:** Valid
  * **Amber:** Expiring within 30 days
  * **Red:** Expired
* Enforcement: expired training blocks assignment to relevant shifts

---

### 3.5 Health Monitoring & Reporting

* Fluid and nutrition logs with daily targets
* Medication management (eMAR):

  * Scheduled rounds
  * Administration recording
  * Stock level monitoring and reorder alerts
* Incident reporting (falls, injuries, behaviour)
* Shift handover summaries ("Pass the Baton")

---

### 3.6 Payroll & Finance

* Contract rules per staff member
* Clock-in / clock-out tracking
* Planned vs. actual hour comparison
* Pay estimation:

  ```
  Pay = (ActualHours × Rate) + (OvertimeHours × 1.5 × Rate)
  ```
* Dashboard showing projected weekly spend

---

## 4. Workflows & Process Logic

### 4.1 Automated Rota Filling (Auto-Fill)

**High-Level Flow**

1. User clicks **Auto-Fill**
2. Fetch unassigned shifts
3. Loop through each shift
4. Identify available staff
5. Exclude staff on leave or with invalid training
6. Calculate suitability score
7. Assign best candidate

> *Reference: Auto-Fill flowchart (PDF page 6)*

---

### 4.1.2 Candidate Suitability Scoring (Explainable)

**Hard Constraints (must pass):**

* Availability
* Not on leave
* Required role/skill
* Training not expired

**Soft Constraints (scored):**

* Under contracted hours
* Overtime avoidance
* Continuity of care
* Fairness (distribution of unpopular shifts)

**Example Scoring Model**

```
Score = (RoleMatch × 40)
      + (TrainingValid × 30)
      + (UnderHours × 20)
      + (NoOvertime × 10)
```

Weights are configurable per organization.

---

### 4.2 Leave Request & Rota Impact

* Staff submit absence request
* System marks staff unavailable
* Checks affected shifts
* If uncovered shifts exist:

  * Manager alerted
  * Replacement suggestions generated

> *Reference: Sequence diagram (PDF page 7)*

---

## 5. Data Architecture

### 5.1 Core Entities (Draft)

Minimum entities include:

* Staff
* Service Users
* Shifts
* Absences
* Care Logs
* Medication Plans & Administrations
* Incidents
* Timesheets

### 5.2 Data Integrity Principles

* **Auditability:** Append-only logs with immutable timestamps
* **RBAC:** Access scoped by team and assignment
* **Soft Deletes:** Use `is_active` flags to preserve regulatory history

> *Reference: ER diagram (PDF page 8)*

---

## 6. API Design (Draft)

### 6.1 Authentication & Authorization

* JWT-based authentication (access + refresh) or session-based
* Role-Based Access Control (RBAC):

  * Manager/Admin: full access
  * Carer: assigned shifts and service users only

### 6.2 Example Endpoints

**Staff**

* `GET /staff`
* `POST /staff`
* `PATCH /staff/:id`

**Rota / Shifts**

* `GET /shifts?from=&to=&userId=`
* `POST /shifts`
* `POST /rota/autofill`

**Absences**

* `POST /absences`
* `PATCH /absences/:id/approve`

**Service Users & Care**

* `GET /service-users`
* `GET /service-users/:id/timeline`
* `POST /service-users/:id/logs`

**Medication (eMAR)**

* `GET /service-users/:id/med-plan`
* `POST /med-admin`

**Payroll**

* `POST /timesheets/clock-in`
* `POST /timesheets/clock-out`
* `GET /payroll/estimate?from=&to=`

---

## 7. Non-Functional Requirements

* **Security:** TLS in transit, encrypted storage, least-privilege access
* **Compliance:** Audit logs and export for inspections
* **Availability:** Offline-first support for carers
* **Performance:** Timeline feed loads under 2 seconds
* **Observability:** Metrics and structured logs for Auto-Fill performance

---

## 8. Implementation Notes

### 8.1 Real-Time Updates

Use WebSockets or SSE to push:

* New care logs
* Shift assignment changes
* Urgent alerts (e.g., missed medication)

### 8.2 Offline-First Support (Carer App)

* Cache assigned visits and service-user summaries
* Queue logs locally when offline
* Sync automatically on reconnect

### 8.3 Explainable Auto-Fill

Managers are shown *why* candidates were suggested, for example:

> "Available, role match, training valid, under contracted hours, avoids overtime."

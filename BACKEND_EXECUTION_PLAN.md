# Backend Execution Plan

This document defines the **backend implementation plan** for Log My Care v1.0.
It is designed for **fast delivery**, **parallel frontend development**, and
**healthcare-grade security expectations**, while intentionally avoiding
over-engineering.

---

## Objectives

- Deliver a **functional, production-ready REST API** for care management
- Provide **stable API contracts** for frontend integration
- Support **role-based authentication & authorization** (Manager, Carer, Senior Carer)
- Keep total backend effort within **realistic timeframes** per feature
- **Secure and compliant** with healthcare data requirements

---

## Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | **FastAPI** | Modern Python framework with automatic API docs, fast performance, and async support. |
| Language | **Python 3.12+** | Strong typing with type hints, excellent library ecosystem, healthcare industry standard. |
| ORM | **SQLAlchemy 2.0** | Mature ORM with excellent PostgreSQL support, migrations, and relationship management. |
| Database | **PostgreSQL 14+** | Relational database ideal for care management data with ACID compliance and audit trails. |
| Migrations | **Alembic** | Database migration tool integrated with SQLAlchemy for schema versioning. |
| Validation | **Pydantic 2.0** | Data validation and serialization with automatic API documentation. |
| Authentication | **python-jose** | JWT token generation and validation for stateless authentication. |
| Password Hashing | **passlib[bcrypt]** | Secure password hashing suitable for healthcare applications. |
| API Documentation | **FastAPI Auto-docs** | Swagger UI and ReDoc automatically generated from code. |
| Development Server | **Uvicorn** | ASGI server with hot-reload for development. |

---

## Operating Assumptions

- Frontend will consume REST APIs directly (no GraphQL)
- Database schema is designed for v1.0 requirements (extensible for v2.0)
- All business logic resides in backend (frontend is presentation layer)
- Authentication is JWT-based (stateless, suitable for mobile)
- No real-time features in v1.0 (polling or basic SSE acceptable)
- No automated tests included in v1.0 (manual testing)
- API contracts are stable early in development
- PostgreSQL is available for development and production

---

## Backend Scope & Effort

### Task Breakdown

| # | Area | Task | ETA (hrs) | Dependencies |
|---|------|------|-----------|--------------|
| 1 | Foundation | Project setup, config, database connection | 1 | None |
| 2 | Database Schema | SQLAlchemy models, relationships, migrations | 8 | 1 |
| 3 | API Infrastructure | FastAPI structure, error handling, middleware | 3 | 1 |
| 4 | Authentication | JWT auth, password hashing, RBAC middleware | 6 | 2, 3 |
| 5 | Staff API | CRUD endpoints, validation, authorization | 5 | 2, 3, 4 |
| 6 | Service Users API | CRUD endpoints, validation, authorization | 5 | 2, 3, 4 |
| 7 | Rota/Shifts API | CRUD endpoints, assignment logic, filtering | 7 | 2, 3, 4, 5 |
| 8 | Care Logs API | CRUD endpoints, timeline query, validation | 6 | 2, 3, 4, 6 |
| 9 | Leave/Absence API | CRUD endpoints, approval workflow, calendar | 5 | 2, 3, 4, 5 |
| 10 | Dashboard API | Stats endpoints, aggregation queries | 4 | 2, 3, 4, 5-9 |
| 11 | File Upload | Profile photo upload, storage handling | 3 | 3, 4 |
| 12 | Error Handling | Comprehensive error responses, logging | 2 | All features |
| 13 | API Documentation | Swagger docs, endpoint descriptions | 2 | All features |
| 14 | Security Audit | Security review, input validation, SQL injection prevention | 3 | All features |
| 15 | Performance | Query optimization, indexing, caching strategy | 4 | All features |
| 16 | Testing & Polish | Manual testing, bug fixes, refinements | 5 | All features |

---

### Total Estimated Effort

> **73 hours**
> (~9 focused development days / ~1.8 weeks full-time)

---

## Deliverables

At completion, the backend will provide:

- Secure JWT-based authentication with role-based access control
- RESTful API endpoints for all v1.0 features
- PostgreSQL database with proper schema and relationships
- Database migrations for schema versioning
- Comprehensive API documentation (Swagger/ReDoc)
- Input validation and error handling
- Staff management endpoints (CRUD)
- Service user management endpoints (CRUD)
- Rota/scheduling endpoints with assignment logic
- Care logging endpoints with timeline queries
- Leave management endpoints with approval workflow
- Dashboard endpoints with aggregated statistics
- File upload support for profile photos
- Secure password handling and token management

---

## Explicitly Out of Scope (v1.0)

- Automated unit/integration tests
- Real-time WebSocket/SSE implementation
- Auto-Fill scheduling algorithm (v2.0)
- Voice-to-Text server-side processing (v2.0)
- Training Matrix endpoints (v2.0)
- Medication management (eMAR) endpoints (v2.0)
- Payroll & hours tracking endpoints (v2.0)
- Advanced search/filtering (basic only)
- Email notifications
- Push notifications
- File storage beyond profile photos
- Audit logging (basic timestamps only)
- Data export functionality
- Advanced reporting/analytics

---

## Security Posture (Backend)

- **Password Security**: Bcrypt hashing with appropriate cost factor
- **JWT Tokens**: Secure token generation with expiration and refresh mechanism
- **Input Validation**: Pydantic schemas validate all inputs
- **SQL Injection Prevention**: SQLAlchemy ORM prevents SQL injection
- **XSS Prevention**: No HTML rendering, JSON responses only
- **CORS Configuration**: Restricted to frontend origins
- **Rate Limiting**: Basic rate limiting on auth endpoints (future enhancement)
- **HTTPS Only**: All production traffic over TLS
- **Role-Based Access**: RBAC enforced at endpoint level
- **Data Encryption**: Sensitive data encrypted at rest (database level)
- **Audit Trail**: Timestamps on all records for compliance

---

## API Design Strategy

### RESTful Principles

- **Resource-based URLs**: `/staff`, `/service-users`, `/shifts`
- **HTTP Methods**: GET (read), POST (create), PATCH (update), DELETE (remove)
- **Status Codes**: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- **JSON Responses**: Consistent JSON structure
- **Error Format**: Standardized error response format

### API Versioning

- **Current**: `/api/v1/` prefix (prepared for future versions)
- **Future**: `/api/v2/` for breaking changes

### Response Format

```json
{
  "data": { ... },
  "message": "Success",
  "status": "success"
}
```

### Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  },
  "status": "error"
}
```

---

## Database Strategy

### Schema Design Principles

- **Normalization**: Proper 3NF normalization to reduce redundancy
- **Relationships**: Foreign keys with proper constraints
- **Indexing**: Indexes on frequently queried columns
- **Soft Deletes**: `is_active` flags for audit compliance
- **Timestamps**: `created_at`, `updated_at` on all tables
- **Audit Fields**: Track who created/updated records

### Core Entities

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| **users** | Staff/User accounts | id, email, password_hash, role, is_active |
| **service_users** | People receiving care | id, name, dob, medical_history, emergency_contacts |
| **shifts** | Scheduled shifts | id, date, start_time, end_time, role, location, assigned_to |
| **care_logs** | Care activity records | id, service_user_id, carer_id, log_type, content, timestamp |
| **absences** | Leave requests | id, user_id, start_date, end_date, type, status, approved_by |

### Migration Strategy

- **Alembic migrations** for all schema changes
- **Version control** for migration files
- **Rollback support** for failed migrations
- **Seed data** scripts for development

---

## Service Layer Architecture

### Pattern: Service Layer

- **Routes**: Handle HTTP requests/responses only
- **Services**: Contain business logic
- **Models**: Database models (SQLAlchemy)
- **Schemas**: Data validation (Pydantic)

### Example Structure

```
app/api/v1/staff/routes.py      # HTTP endpoints
app/services/staff/staff_service.py  # Business logic
app/models/user.py              # Database model
app/schemas/staff/request.py    # Request validation
app/schemas/staff/response.py   # Response serialization
```

---

## Authentication & Authorization

### JWT Token Flow

1. User logs in with email/password
2. Backend validates credentials
3. Backend generates access token (short-lived) + refresh token (long-lived)
4. Frontend stores tokens
5. Frontend includes access token in API requests
6. Backend validates token on each request
7. On token expiry, frontend uses refresh token to get new access token

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Manager** | Full access to all endpoints |
| **Senior Carer** | Care planning, medication management, escalations |
| **Carer** | Own shifts, assigned service users, own care logs |

### Authorization Checks

- **Endpoint-level**: Decorator/middleware checks role
- **Resource-level**: Verify user owns resource or has permission
- **Field-level**: Sensitive fields filtered based on role

---

## Error Handling Strategy

### Error Types

- **Validation Errors** (400): Invalid input data
- **Authentication Errors** (401): Missing/invalid token
- **Authorization Errors** (403): Insufficient permissions
- **Not Found Errors** (404): Resource doesn't exist
- **Server Errors** (500): Unexpected server errors

### Error Response Format

```python
{
    "error": {
        "code": "ERROR_CODE",
        "message": "Human-readable message",
        "details": {}  # Optional additional details
    }
}
```

### Logging

- **Structured logging** for all errors
- **Log levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Sensitive data**: Never log passwords or tokens
- **Audit trail**: Log all authentication attempts

---

## Performance Considerations

### Database Optimization

- **Indexes**: On foreign keys, frequently queried columns
- **Query Optimization**: Use SQLAlchemy eager loading where needed
- **Pagination**: All list endpoints support pagination
- **Filtering**: Efficient WHERE clauses

### Caching Strategy (Future)

- **Redis** for session storage (v2.0)
- **Query result caching** for frequently accessed data (v2.0)

### Response Times

- **Target**: < 200ms for simple queries
- **Acceptable**: < 500ms for complex queries
- **Maximum**: < 1s for aggregation queries

---

## Development Workflow

1. **Feature Development**
   - Create feature branch
   - Design database schema (if new entities)
   - Create Alembic migration
   - Implement model, schema, service, routes
   - Test manually with Swagger UI
   - Update API documentation
   - Code review (if applicable)

2. **Database Changes**
   - Create Alembic migration
   - Test migration up and down
   - Update seed data if needed
   - Document schema changes

3. **API Development**
   - Define Pydantic schemas first (contract)
   - Implement service layer (business logic)
   - Implement routes (HTTP layer)
   - Test with Swagger UI
   - Document endpoints

---

## Quality Standards

- **Code Quality**: Type hints, PEP 8 compliance, Black formatting
- **Security**: Input validation, SQL injection prevention, secure password handling
- **Performance**: Query optimization, proper indexing
- **Documentation**: Swagger docs, code comments for complex logic
- **Error Handling**: Comprehensive error responses
- **Logging**: Structured logging for debugging and monitoring

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database schema changes | High | Thorough planning, use migrations, test rollbacks |
| API contract changes | High | Version APIs, document changes, communicate early |
| Performance issues | Medium | Index optimization, query analysis, pagination |
| Security vulnerabilities | High | Security audit, input validation, dependency updates |
| Data loss | Critical | Database backups, migration rollback capability |

---

## API Endpoints Summary

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/v1/auth/register` | Register new user (Manager only) | Manager |
| POST | `/api/v1/auth/login` | Login and get tokens | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| POST | `/api/v1/auth/logout` | Logout (invalidate token) | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password with token | No |

### Staff Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/v1/staff` | List all staff (paginated) | Manager |
| POST | `/api/v1/staff` | Create staff member | Manager |
| GET | `/api/v1/staff/:id` | Get staff details | Manager |
| PATCH | `/api/v1/staff/:id` | Update staff member | Manager |
| DELETE | `/api/v1/staff/:id` | Deactivate staff (soft delete) | Manager |
| POST | `/api/v1/staff/:id/photo` | Upload profile photo | Manager |

### Service Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/v1/service-users` | List service users | Manager, Senior Carer |
| POST | `/api/v1/service-users` | Create service user | Manager |
| GET | `/api/v1/service-users/:id` | Get service user details | Manager, Senior Carer, Carer (if assigned) |
| PATCH | `/api/v1/service-users/:id` | Update service user | Manager |
| DELETE | `/api/v1/service-users/:id` | Deactivate service user | Manager |
| GET | `/api/v1/service-users/search` | Search service users | Manager, Senior Carer |

### Rota/Shifts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/v1/shifts` | List shifts (with filters) | Manager, Senior Carer |
| POST | `/api/v1/shifts` | Create shift | Manager |
| GET | `/api/v1/shifts/:id` | Get shift details | Manager, Senior Carer, Carer (if assigned) |
| PATCH | `/api/v1/shifts/:id` | Update shift | Manager |
| DELETE | `/api/v1/shifts/:id` | Delete shift | Manager |
| PATCH | `/api/v1/shifts/:id/assign` | Assign staff to shift | Manager |
| PATCH | `/api/v1/shifts/:id/unassign` | Unassign staff from shift | Manager |
| GET | `/api/v1/shifts/my-shifts` | Get current user's shifts | Carer |

### Care Logs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/v1/care-logs` | List care logs (with filters) | Manager, Senior Carer |
| POST | `/api/v1/care-logs` | Create care log | Carer, Senior Carer |
| GET | `/api/v1/care-logs/:id` | Get care log details | Manager, Senior Carer, Carer (own logs) |
| PATCH | `/api/v1/care-logs/:id` | Update care log (time limit) | Carer (own logs), Manager |
| DELETE | `/api/v1/care-logs/:id` | Delete care log | Manager |
| GET | `/api/v1/service-users/:id/timeline` | Get service user timeline | Manager, Senior Carer, Carer (if assigned) |

### Leave/Absence

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/v1/absences` | List absences | Manager, Carer (own) |
| POST | `/api/v1/absences` | Submit leave request | Carer |
| GET | `/api/v1/absences/:id` | Get absence details | Manager, Carer (own) |
| PATCH | `/api/v1/absences/:id/approve` | Approve leave request | Manager |
| PATCH | `/api/v1/absences/:id/reject` | Reject leave request | Manager |
| GET | `/api/v1/absences/calendar` | Get leave calendar | Manager |

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/v1/dashboard/manager` | Manager dashboard data | Manager |
| GET | `/api/v1/dashboard/carer` | Carer dashboard data | Carer |
| GET | `/api/v1/dashboard/stats` | Dashboard statistics | Manager |

---

## Database Models Overview

### User Model

```python
- id: UUID (Primary Key)
- email: String (Unique, Indexed)
- password_hash: String
- full_name: String
- role: Enum (Manager, Senior Carer, Carer)
- phone: String (Optional)
- photo_url: String (Optional)
- is_active: Boolean
- created_at: DateTime
- updated_at: DateTime
```

### Service User Model

```python
- id: UUID (Primary Key)
- name: String
- date_of_birth: Date
- medical_history: Text (Optional)
- preferences: JSON (Optional)
- emergency_contacts: JSON
- photo_url: String (Optional)
- is_active: Boolean
- created_at: DateTime
- updated_at: DateTime
```

### Shift Model

```python
- id: UUID (Primary Key)
- date: Date (Indexed)
- start_time: Time
- end_time: Time
- role: String
- location: String
- service_user_id: UUID (Foreign Key, Optional)
- assigned_to_id: UUID (Foreign Key, Optional)
- created_by_id: UUID (Foreign Key)
- created_at: DateTime
- updated_at: DateTime
```

### Care Log Model

```python
- id: UUID (Primary Key)
- service_user_id: UUID (Foreign Key, Indexed)
- carer_id: UUID (Foreign Key, Indexed)
- log_type: Enum (Food, Medication, Mood, General)
- content: Text
- timestamp: DateTime (Indexed)
- created_at: DateTime
- updated_at: DateTime
```

### Absence Model

```python
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key, Indexed)
- start_date: Date (Indexed)
- end_date: Date (Indexed)
- type: Enum (Sick, Annual, Other)
- reason: Text (Optional)
- status: Enum (Pending, Approved, Rejected)
- approved_by_id: UUID (Foreign Key, Optional)
- approved_at: DateTime (Optional)
- created_at: DateTime
- updated_at: DateTime
```

---

## Final Notes

This plan is intentionally constrained to:
- Minimize rework
- Enable parallel frontend/backend execution
- Deliver value quickly
- Maintain healthcare-grade security without unnecessary complexity
- Focus on RESTful API design with clear contracts

Any significant frontend contract changes or scope expansion will impact
timeline and should be handled explicitly.

---

**Document Version:** 1.0
**Created:** 2024
**Last Updated:** 2024

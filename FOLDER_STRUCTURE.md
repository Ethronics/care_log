# Scalable Folder Structure

This document defines the **recommended folder structure** for Log My Care that scales from MVP to enterprise.

---

## Current Structure Issues

### Problems:
- ❌ All components in flat `components/` folder (will get messy with 50+ components)
- ❌ No feature-based organization
- ❌ Services not organized by domain
- ❌ Backend routes not organized by feature
- ❌ No hooks directory for reusable logic
- ❌ No types directory for TypeScript interfaces

---

## Recommended Scalable Structure

### Frontend Structure

```
frontend/src/
├── components/              # Shared/Reusable UI Components
│   ├── ui/                  # Base UI components (Button, Card, Input, etc.)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── index.ts
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── MobileDrawer.tsx
│   │   └── index.ts
│   └── common/              # Common shared components
│       ├── Loading.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       └── index.ts
│
├── features/                # Feature-based modules (SCALABLE)
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   └── index.ts
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       └── index.ts
│   │
│   ├── staff/
│   │   ├── components/
│   │   │   ├── StaffList.tsx
│   │   │   ├── StaffForm.tsx
│   │   │   ├── StaffCard.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useStaff.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── staffService.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── staff.types.ts
│   │   │   └── index.ts
│   │   └── pages/
│   │       ├── StaffListPage.tsx
│   │       ├── StaffCreatePage.tsx
│   │       ├── StaffEditPage.tsx
│   │       └── index.ts
│   │
│   ├── service-users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── rota/
│   │   ├── components/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── ShiftCard.tsx
│   │   │   ├── ShiftForm.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useRota.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── rotaService.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── rota.types.ts
│   │   │   └── index.ts
│   │   └── pages/
│   │       ├── RotaCalendarPage.tsx
│   │       └── index.ts
│   │
│   ├── care-logs/
│   │   ├── components/
│   │   │   ├── CareLogTimeline.tsx
│   │   │   ├── CareLogForm.tsx
│   │   │   ├── CareLogCard.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useCareLogs.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── careLogService.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── careLog.types.ts
│   │   │   └── index.ts
│   │   └── pages/
│   │       ├── CareLogTimelinePage.tsx
│   │       ├── CareLogCreatePage.tsx
│   │       └── index.ts
│   │
│   ├── leave/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   └── dashboard/
│       ├── components/
│       │   ├── ManagerDashboard.tsx
│       │   ├── CarerDashboard.tsx
│       │   ├── StatsWidget.tsx
│       │   └── index.ts
│       ├── hooks/
│       │   ├── useDashboard.ts
│       │   └── index.ts
│       ├── services/
│       │   ├── dashboardService.ts
│       │   └── index.ts
│       ├── types/
│       │   ├── dashboard.types.ts
│       │   └── index.ts
│       └── pages/
│           ├── ManagerDashboardPage.tsx
│           ├── CarerDashboardPage.tsx
│           └── index.ts
│
├── hooks/                   # Shared/Global hooks
│   ├── useTheme.ts
│   ├── useApi.ts
│   ├── useDebounce.ts
│   └── index.ts
│
├── services/                # Shared services
│   ├── api.ts               # Axios instance & interceptors
│   ├── apiClient.ts         # API client wrapper
│   └── index.ts
│
├── types/                   # Global TypeScript types
│   ├── api.types.ts
│   ├── common.types.ts
│   ├── user.types.ts
│   └── index.ts
│
├── utils/                   # Utility functions
│   ├── auth.ts
│   ├── constants.ts
│   ├── theme.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── index.ts
│
├── styles/                  # Global styles
│   ├── theme.css
│   ├── components.css
│   ├── utilities.css
│   └── index.css
│
├── contexts/                # React contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── index.tsx
│
├── routes/                  # Route configuration
│   ├── index.tsx
│   ├── ProtectedRoute.tsx
│   └── routes.config.ts
│
├── App.tsx
└── main.tsx
```

---

### Backend Structure

```
backend/app/
├── api/                     # API routes (organized by feature)
│   ├── v1/                  # API versioning
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── staff/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── service-users/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── rota/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── care-logs/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── leave/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── dependencies.py
│   │   │
│   │   └── dashboard/
│   │       ├── __init__.py
│   │       ├── routes.py
│   │       └── dependencies.py
│   │
│   └── __init__.py
│
├── models/                  # SQLAlchemy models (organized by domain)
│   ├── __init__.py
│   ├── user.py              # User/Staff model
│   ├── service_user.py
│   ├── shift.py
│   ├── care_log.py
│   ├── absence.py
│   └── base.py              # Base model class
│
├── schemas/                 # Pydantic schemas (organized by domain)
│   ├── __init__.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── request.py
│   │   └── response.py
│   ├── staff/
│   │   ├── __init__.py
│   │   ├── request.py
│   │   └── response.py
│   ├── service_users/
│   │   ├── __init__.py
│   │   ├── request.py
│   │   └── response.py
│   ├── rota/
│   │   ├── __init__.py
│   │   ├── request.py
│   │   └── response.py
│   ├── care_logs/
│   │   ├── __init__.py
│   │   ├── request.py
│   │   └── response.py
│   └── common/              # Shared schemas
│       ├── __init__.py
│       └── pagination.py
│
├── services/                # Business logic (organized by domain)
│   ├── __init__.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   └── jwt_service.py
│   ├── staff/
│   │   ├── __init__.py
│   │   └── staff_service.py
│   ├── service_users/
│   │   ├── __init__.py
│   │   └── service_user_service.py
│   ├── rota/
│   │   ├── __init__.py
│   │   └── rota_service.py
│   ├── care_logs/
│   │   ├── __init__.py
│   │   └── care_log_service.py
│   └── leave/
│       ├── __init__.py
│       └── leave_service.py
│
├── core/                    # Core functionality
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── security.py          # Password hashing, JWT
│   └── dependencies.py     # FastAPI dependencies
│
├── utils/                   # Utility functions
│   ├── __init__.py
│   ├── exceptions.py
│   ├── validators.py
│   └── helpers.py
│
├── middleware/              # Custom middleware
│   ├── __init__.py
│   ├── auth.py
│   └── error_handler.py
│
└── main.py                 # FastAPI app entry point
```

---

## Benefits of This Structure

### Scalability
- ✅ **Feature-based organization** - Easy to find and modify feature code
- ✅ **Clear separation of concerns** - Components, hooks, services, types per feature
- ✅ **No flat file structure** - Prevents 100+ files in one folder
- ✅ **Domain-driven** - Matches business logic organization

### Maintainability
- ✅ **Self-contained features** - Each feature has everything it needs
- ✅ **Easy to navigate** - Developers know where to find code
- ✅ **Reduced coupling** - Features are independent
- ✅ **Clear dependencies** - Import paths show relationships

### Team Collaboration
- ✅ **Parallel development** - Teams can work on different features
- ✅ **Clear ownership** - Each feature is a clear module
- ✅ **Reduced merge conflicts** - Features are isolated
- ✅ **Easy code review** - Review by feature

### Testing
- ✅ **Feature-level testing** - Test each feature independently
- ✅ **Mock boundaries** - Clear boundaries for mocking
- ✅ **Test organization** - Tests mirror feature structure

---

## Migration Strategy

### Phase 1: Reorganize Existing Code (1-2 hours)

1. **Frontend:**
   ```bash
   # Move components to ui/
   mkdir -p src/components/ui
   mv src/components/Button.tsx src/components/ui/
   mv src/components/Card.tsx src/components/ui/
   # ... etc

   # Create features structure
   mkdir -p src/features/auth/{components,hooks,services,types,pages}
   ```

2. **Backend:**
   ```bash
   # Organize by feature
   mkdir -p app/api/v1/{auth,staff,service-users,rota,care-logs,leave}
   mkdir -p app/services/{auth,staff,service-users,rota,care-logs,leave}
   ```

### Phase 2: Update Imports (Gradual)

- Update imports as you work on features
- Use IDE refactoring tools
- No need to do all at once

### Phase 3: New Features Use New Structure

- All new features follow the new structure
- Old code migrates gradually

---

## Comparison: Current vs. Recommended

| Aspect | Current Structure | Recommended Structure |
|--------|------------------|----------------------|
| **Components** | Flat `components/` folder | `components/ui/` + feature-based |
| **Pages** | Flat `pages/` folder | Feature-based `features/*/pages/` |
| **Services** | Single `api.ts` | Feature-based services |
| **Types** | Mixed in utils | Dedicated `types/` folder |
| **Hooks** | None | `hooks/` + feature hooks |
| **Backend Routes** | Flat `routes/` | Feature-based `api/v1/*/` |
| **Backend Services** | None | Feature-based services |
| **Scalability** | ⚠️ Limited | ✅ Excellent |

---

## Best Practices

### Frontend
1. **Feature-first** - Organize by feature, not by file type
2. **Shared components** - Only truly shared components in `components/ui/`
3. **Feature components** - Feature-specific components in `features/*/components/`
4. **Barrel exports** - Use `index.ts` for clean imports
5. **Type safety** - Types close to where they're used

### Backend
1. **Domain-driven** - Organize by business domain
2. **Service layer** - Business logic in services, not routes
3. **API versioning** - Use `v1/` for future versions
4. **Dependencies** - Shared dependencies in `core/dependencies.py`
5. **Error handling** - Centralized in middleware

---

## Example: Adding a New Feature

### Adding "Training Matrix" Feature

**Frontend:**
```
src/features/training/
├── components/
│   ├── TrainingMatrix.tsx
│   ├── TrainingCard.tsx
│   └── index.ts
├── hooks/
│   ├── useTraining.ts
│   └── index.ts
├── services/
│   ├── trainingService.ts
│   └── index.ts
├── types/
│   ├── training.types.ts
│   └── index.ts
└── pages/
    ├── TrainingMatrixPage.tsx
    └── index.ts
```

**Backend:**
```
app/api/v1/training/
├── __init__.py
├── routes.py
└── dependencies.py

app/services/training/
├── __init__.py
└── training_service.py

app/models/training.py
app/schemas/training/
├── request.py
└── response.py
```

**Clean and organized!** ✅

---

## Conclusion

The recommended structure:
- ✅ **Scales** from MVP to enterprise
- ✅ **Maintainable** as codebase grows
- ✅ **Team-friendly** for collaboration
- ✅ **Testable** with clear boundaries
- ✅ **Industry-standard** approach

**Recommendation:** Migrate to this structure gradually as you build features. Start using it for new features immediately.

---

**Document Version:** 1.0
**Created:** 2024
**Last Updated:** 2024

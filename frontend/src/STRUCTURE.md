# Frontend Folder Structure

This document explains the scalable folder structure for the Log My Care frontend.

---

## Directory Structure

```
src/
├── components/          # Shared/Reusable UI Components
│   ├── ui/             # Base UI components (Button, Card, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, Navigation)
│   └── common/          # Common shared components (Loading, EmptyState)
│
├── features/            # Feature-based modules (SCALABLE)
│   ├── auth/           # Authentication feature
│   ├── staff/          # Staff management feature
│   ├── service-users/  # Service user management feature
│   ├── rota/           # Rota/scheduling feature
│   ├── care-logs/      # Care logging feature
│   ├── leave/          # Leave management feature
│   └── dashboard/      # Dashboard feature
│
├── hooks/              # Shared/Global hooks
├── services/           # Shared services (API client)
├── types/              # Global TypeScript types
├── utils/              # Utility functions
├── styles/             # Global styles
├── contexts/           # React contexts
├── routes/             # Route configuration
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

---

## Component Organization

### Shared Components (`components/`)

**UI Components** (`components/ui/`)
- Base components used across multiple features
- Examples: Button, Card, Input, Badge, Alert, ThemeToggle
- Import: `import { Button } from '@/components'`

**Layout Components** (`components/layout/`)
- App shell components
- Examples: Header, Sidebar, Footer, Navigation, MobileDrawer
- Import: `import { Header } from '@/components'`

**Common Components** (`components/common/`)
- Shared utility components
- Examples: Loading, EmptyState, ErrorBoundary
- Import: `import { Loading } from '@/components'`

### Feature Components (`features/*/components/`)

- Feature-specific components
- Only used within that feature
- Examples: `features/staff/components/StaffList.tsx`
- Import: `import { StaffList } from '@/features/staff'`

---

## Feature Structure

Each feature follows this structure:

```
features/[feature-name]/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific hooks
├── services/       # Feature-specific API services
├── types/          # Feature-specific TypeScript types
└── pages/          # Feature page components
```

### Example: Staff Feature

```
features/staff/
├── components/
│   ├── StaffList.tsx
│   ├── StaffForm.tsx
│   ├── StaffCard.tsx
│   └── index.ts
├── hooks/
│   ├── useStaff.ts
│   └── index.ts
├── services/
│   ├── staffService.ts
│   └── index.ts
├── types/
│   ├── staff.types.ts
│   └── index.ts
└── pages/
    ├── StaffListPage.tsx
    ├── StaffCreatePage.tsx
    └── index.ts
```

---

## Import Patterns

### Shared Components
```typescript
import { Button, Card, Input } from '@/components'
```

### Feature Components
```typescript
import { StaffList } from '@/features/staff'
```

### Services
```typescript
import api from '@/services/api'
import { staffService } from '@/features/staff/services'
```

### Types
```typescript
import { Staff } from '@/features/staff/types'
import { ApiResponse } from '@/types'
```

### Utils
```typescript
import { getToken, setToken } from '@/utils/auth'
import { ROUTES } from '@/utils/constants'
```

---

## Adding a New Feature

1. Create feature directory: `features/new-feature/`
2. Create subdirectories: `components/`, `hooks/`, `services/`, `types/`, `pages/`
3. Add `index.ts` files for clean exports
4. Implement feature following the pattern
5. Export from feature root `index.ts` if needed

---

## Benefits

- ✅ **Scalable**: Easy to add new features
- ✅ **Maintainable**: Clear organization
- ✅ **Team-friendly**: Parallel development
- ✅ **Testable**: Clear boundaries
- ✅ **Discoverable**: Easy to find code

---

**Last Updated:** 2024

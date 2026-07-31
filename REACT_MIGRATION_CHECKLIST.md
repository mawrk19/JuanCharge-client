# Migration Checklist: Vue/Quasar to React/Ant Design

## Phase 1: Project Scaffolding & Setup
- [ ] Initialize React + Vite project (`npm create vite@latest juancharge-react -- --template react`)
- [ ] Setup Tailwind CSS
- [ ] Install dependencies:
  - Base UI: `antd`, `@ant-design/icons`, `lucide-react`
  - Routing: `react-router-dom`
  - State: `redux-toolkit` or `zustand`
  - Logic/Query: `axios`, `@tanstack/react-query`
  - Auth: `jwt-decode`
  - Charts: `react-apexcharts`

## Phase 2: Core Architecture
- [ ] Services & API
  - [ ] Migrate `src/service/axios.js` to React
  - [ ] Migrate `src/service/cache.js` to React
- [ ] State Management (Global)
  - [ ] Setup store (`src/store/index.js`)
  - [ ] Migrate `src/store/auth/index.js` (Include login, logout, verification actions)
- [ ] Routing Strategy
  - [ ] Migrate `src/router/index.js`
  - [ ] Setup PrivateRoute wrapper (equivalent to `requiresAuth`)
  - [ ] Setup RoleBasedRoute wrapper (equivalent to LGU/Admin logic)
- [ ] Global Layouts
  - [ ] Create `MainLayout.jsx` (from `src/views/Main.vue` - Sidebar, Header, Notifications)
  - [ ] Create `Unauthorized.jsx` (from `src/views/Unauthorized.vue`)

## Phase 3: Modules Migration

### 1. Auth Module
- State/Router:
  - [ ] `store/index.js` / `router/index.js`
- Pages:
  - [ ] `Login.jsx` (Migrate from Login.vue)
  - [ ] `Register.jsx` (Migrate from Register.vue)
  - [ ] `ForgotPassword.jsx`
  - [ ] `ResetPassword.jsx`
  - [ ] `SetPassword.jsx` (Including recent modern glassmorphism updates)

### 2. Admin Dashboard Module
- State/Router:
  - [ ] `store/index.js` (Analytics Actions)
- Layouts/Components:
  - [ ] `DashboardCard.jsx`
  - [ ] `OperationalAlerts.jsx`
- Pages:
  - [ ] `Index.jsx` (Main metrics, activity overviews, dynamic ApexCharts)
  - [ ] `RecyclingAnalytics.jsx` (Migrating area/donut charts and recent KPI responsive fixes)

### 3. Kiosks & Locations Module
- KIOSKS (`src/application/modules/kiosks`)
  - [ ] State & routing configuration
  - [ ] `Index.jsx` (CRUD Data Table)
- MAP (`src/application/modules/map`)
  - [ ] Global `MapView.jsx` component
  - [ ] `Index.jsx` (Geo visualisations)

### 4. User Management Modules
- LGU ADMINS (`src/application/modules/lgus`)
  - [ ] `Index.jsx` (CRUD operations for LGU parent organizations)
- LGU USERS (`src/application/modules/users`)
  - [ ] `Index.jsx` (CRUD operations for individual LGU accounts)
- PATRON ADMIN VIEW (`src/application/modules/kiosks_user`)
  - [ ] `Index.jsx` (Viewing standard application patrons)

### 5. Patron (End-User) Module
*Note: This is an alternate layout space from the Admin sidebar*
- State/Router:
  - [ ] `store/index.js`
- Layouts/Components:
  - [ ] `PatronLayout.jsx`
  - [ ] `ChargingWidget.jsx`
- Pages:
  - [ ] `Index.jsx` (Patron Homepage)
  - [ ] `ChargingSession.jsx`
  - [ ] `Achievements.jsx`
  - [ ] `Map.jsx`
  - [ ] `ConvertPoints.jsx`
  - [ ] `Profile.jsx`

### 6. Settings Module
- Pages & Components:
  - [ ] `Index.jsx` (Container)
  - [ ] `ProfileTab.jsx`
  - [ ] `SecurityTab.jsx`

## Phase 4: Final QA & Cleanup
- [ ] Ensure `localStorage` logic handles roles cleanly for Sidebar rendering
- [ ] Connect Toast/Notifications across the app (`antd` message/notification system replacing Quasar's `$q.notify`)
- [ ] Verify Tailwind responsivenes matches the old CSS styling natively
- [ ] Update Build scripts and remove old Vue dependencies from the system.
# Architectural Decisions - Issue #85 Feature Completion

## Scope Decisions

### Excluded from Mobile Implementation
- **Admin CRUD features**: admin-user management, app-config-admin, role pagination
  - Rationale: No admin UI exists in mobile app, no business confirmation received
  - These are backend-only features requiring separate admin panel decision

### Included in Mobile Implementation
- Password recovery flow (forgot + reset)
- Trainer invitation by email
- Public invitation status screen
- Global auth/session error handling (401/403 → logout/block)
- Error UX enhancement (400 vs 404 distinction)
- Visibility-in-ranking contract verification

## Technical Decisions

### Error Handling Strategy
- **Global handler in axios interceptor** (custom-instance.ts)
  - 401 Unauthorized → clear token, redirect to login
  - 403 Forbidden with "blocked"/"revoked" → show modal, force logout
  - Other errors → pass through to component-level handling
- **Component-level UX enhancement** (errorHandler.ts)
  - 400 Bad Request → "Invalid input: {message}"
  - 404 Not Found → "Resource not found: {message}"
  - 403 Forbidden → "Access denied: {message}"
  - Other → Generic error message

### Routing Strategy
- New screens at root level (following Login/Register pattern)
- Routes: `/forgot-password`, `/reset-password`, `/public-invitation-status`
- Trainer invitation screens nested under profile/trainer section

### State Management
- Auth state changes (logout on 401/403) via authStore
- No new global state needed for password recovery (ephemeral flow)
- Trainer invitation list via React Query (server state)

## Verification Strategy
- **Contract verification first** (Task 1) before implementation
- **Incremental QA** after each wave
- **Final integration test** (Task 11) before verification wave
- **Playwright manual QA** (F3) as final gate

## Work Execution Strategy
- **3 waves + 1 final wave**
  - Wave 1 (Tasks 1-4): Foundation (contracts, handlers, scaffolding)
  - Wave 2 (Tasks 5-8): UI implementation (screens, flows)
  - Wave 3 (Tasks 9-11): Polish and integration
  - Final Wave (F1-F4): Verification gates
- **Parallel execution** where dependencies allow (max 4 concurrent)
- **No backend changes** - mobile-only implementation

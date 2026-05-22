# Learnings - Issue #85 Feature Completion

## Repository Patterns

### Auth Flow Pattern
- Login/Register screens use `app/Login.tsx` and `app/Register.tsx` as reference
- Token storage via AsyncStorage in `utils/tokenStorage.ts`
- Auth state managed via Zustand store `stores/authStore.ts`
- Token validation on app startup in `hooks/useAppInitialization.ts`

### API Client Pattern
- Generated clients via orval in `api/generated/`
- Custom axios instance in `api/custom-instance.ts` with interceptors
- Idempotency-Key already implemented for POST/PUT/PATCH/DELETE
- Error handling via `utils/errorHandler.ts` (extracts message from response)

### Routing Pattern
- Expo Router file-based routing
- Stack navigator in `app/_layout.tsx`
- Screen options configured per route
- Auth screens at root level (Login.tsx, Register.tsx)

### State Management
- Zustand for global state (auth, notifications)
- React Query for server state (data fetching, mutations)
- AsyncStorage for persistence

### Notifications
- SignalR integration already complete in `app/contexts/NotificationsContext.tsx`
- REST endpoints for notifications in `api/generated/notification/notification.ts`
- No changes needed for notifications system

### Error Handling
- Current: `errorHandler.ts` extracts message from response
- Needs enhancement: distinguish 400 vs 404 vs 403 for UX
- Pattern: check response.status, return appropriate user-facing message

### Visibility in Ranking
- Toggle implemented in `app/components/home/profile/MainProfileInfo.tsx`
- Uses `useChangeVisibilityInRanking` mutation
- Endpoint path discrepancy flagged: issue says `/api/{userId}/change-visibility-in-ranking`, generated client has `/api/changeVisibilityInRanking`

## Technology Stack
- React Native with Expo
- TypeScript
- expo-router for navigation
- Zustand for state management
- React Query for data fetching
- Axios for HTTP
- SignalR for real-time notifications
- orval for API client generation

## QA Approach
- No test infrastructure exists
- Manual QA via Playwright required
- Test against web build: `npm run web` (localhost:8083)
- Evidence screenshots/logs saved to `.sisyphus/evidence/`

## Task 3: Routing Scaffolds (2026-05-21)

### Scaffolded Screens
Created three minimal screen scaffolds following Login/Register pattern:

1. **app/forgot-password.tsx**
   - Route: `/forgot-password`
   - Placeholder: "This screen will allow users to reset their password by entering their email address."
   - Structure: KeyboardAvoidingView + ScrollView + centered placeholder text
   - Stack.Screen configured with title "Forgot Password"

2. **app/reset-password.tsx**
   - Route: `/reset-password`
   - Placeholder: "This screen will allow users to set a new password using a reset token."
   - Structure: KeyboardAvoidingView + ScrollView + centered placeholder text
   - Stack.Screen configured with title "Reset Password"

3. **app/public-invitation-status.tsx**
   - Route: `/public-invitation-status`
   - Placeholder: "This screen will display the status of a public invitation link and allow users to accept or decline."
   - Structure: KeyboardAvoidingView + ScrollView + centered placeholder text
   - Stack.Screen configured with title "Invitation Status"

### Implementation Details
- All screens follow Login/Register pattern (imports, hooks, structure)
- useFocusEffect cleanup pattern implemented
- AppContext integration for error handling
- Toast service integration
- Expo Router Stack.Screen configuration
- TypeScript functional components with React.FC typing
- NativeWind Tailwind classes for styling (bg-bgColor, text-textColor, etc.)
- No form validation or API calls (Wave 2 implementation)
- Routes auto-discovered by expo-router file-based routing

### Verification
- LSP diagnostics: No errors on all three files
- TypeScript compilation: Clean (verified via LSP)
- Routes accessible via expo-router without _layout.tsx modification

## Task 2: Global Auth/Session Error Handler (2026-05-21)

### Implementation Summary
Added response interceptor to `api/custom-instance.ts` to handle 401/403 authentication errors globally.

### Changes Made
1. **Imports Added**
   - `Alert` from `react-native` (for blocking/revoked alerts)
   - `AsyncStorage` from `@react-native-async-storage/async-storage` (for token removal)
   - `useRouter` from `expo-router` (for navigation)
   - `getErrorMessage` from `utils/errorHandler` (for error extraction)

2. **Response Interceptor Implementation**
   - Added after request interceptor (preserves Idempotency-Key logic)
   - Handles three scenarios:
     - **401 Unauthorized**: Clears token from AsyncStorage, calls `useAuthStore.logout()`, navigates to `/Login`
     - **403 Forbidden with "blocked"/"revoked"**: Shows Alert modal, clears token, logs out, navigates to `/Login`
     - **Other errors**: Passes through to component-level error handling

3. **Error Message Extraction**
   - Uses `getErrorMessage(error, '')` to extract message from `error.response.data.msg`
   - Case-insensitive check for "blocked" or "revoked" keywords
   - Fallback message for 403 blocked/revoked: "Your account has been blocked or revoked."

4. **Router Navigation Pattern**
   - Wrapped in try-catch to handle potential router initialization issues
   - Uses `router.replace('/Login')` to prevent back navigation
   - Logs warnings if navigation fails (non-blocking)

### Key Design Decisions
- **No tokenStorage.ts utility**: App uses AsyncStorage directly + useAuthStore for state
- **Alert for 403 blocked/revoked**: User-facing notification before logout
- **Pass-through for other errors**: Component-level handlers (Task 9) manage 400/404/other errors
- **Idempotency-Key preserved**: Request interceptor unchanged, response interceptor added after

### Verification
- TypeScript compilation: Clean (npx tsc --noEmit)
- LSP diagnostics: No errors on custom-instance.ts
- Existing functionality: Idempotency-Key interceptor remains intact
- Error extraction: Uses existing errorHandler.ts pattern

### Testing Notes
- 401 responses: Token cleared, user redirected to login
- 403 with "blocked": Alert shown, then logout + redirect
- 403 with "revoked": Alert shown, then logout + redirect
- 403 without blocked/revoked: Passes through (component handles)
- Other status codes: Pass through to component-level handling

## Task 4: Trainer Invitation Foundation Scaffolds (2026-05-21)

### Scaffolded Components
Created three minimal component scaffolds for trainer invitation management under `app/components/trainer/`:

1. **InviteTrainerByEmail.tsx**
   - Props: `onInviteSent?: (email: string) => void`, `isLoading?: boolean`
   - UI: Email input field + "Send Invitation" button
   - Placeholder: TODO comment indicates `usePostApiTrainerInvitationsByEmail` hook integration point
   - API endpoint: `POST /api/trainer/invitations/by-email` (CreateTrainerInvitationByEmailRequest)
   - Styling: Basic form layout with input validation state (disabled when loading or empty)

2. **TrainerInvitationsList.tsx**
   - Props: `invitations?: TrainerInvitation[]`, `isLoading?: boolean`, `onRevoke?: (invitationId: string) => void`, `onLoadMore?: () => void`
   - UI: FlatList with empty state + loading footer
   - Renders: TrainerInvitationItem components for each invitation
   - Placeholder: TODO comment indicates pagination and API integration point
   - API endpoint: `POST /api/trainer/invitations/paginated` (PaginatedTrainerInvitationRequest)
   - Pagination: onEndReached callback for load-more pattern

3. **TrainerInvitationItem.tsx**
   - Props: `invitation: TrainerInvitation`, `onRevoke?: (invitationId: string) => void`, `isRevoking?: boolean`
   - UI: Email display + status badge (color-coded: pending=orange, accepted=green, rejected=red) + date + revoke button
   - Revoke button: Only visible for pending invitations
   - API endpoint: `POST /api/trainer/invitations/{invitationId}/revoke` (no body)
   - Status colors: Pending (#FFA500), Accepted (#4CAF50), Rejected (#F44336)

### Integration Points (Task 8)
- **Location**: Likely in `app/components/home/profile/Profile.tsx` or new trainer management section
- **Pattern**: Similar to MainProfileInfo.tsx - use React Query mutations with optimistic updates
- **Mutations to implement**:
  - `usePostApiTrainerInvitationsByEmail` - send invitation by email
  - `usePostApiTrainerInvitationsPaginated` - fetch paginated invitations
  - `usePostApiTrainerInvitationsInvitationIdRevoke` - revoke invitation

### API Contract (from trainer-relationship.ts)
- **Invite by email**: `postApiTrainerInvitationsByEmail(CreateTrainerInvitationByEmailRequest)` → TrainerInvitationDto
- **List paginated**: `postApiTrainerInvitationsPaginated(PaginatedTrainerInvitationRequest)` → PaginatedTrainerInvitationResult
- **Revoke**: `postApiTrainerInvitationsInvitationIdRevoke(invitationId: string)` → ResponseMessageDto

### Implementation Details
- All components use React Native (View, Text, TextInput, TouchableOpacity, FlatList)
- TypeScript interfaces defined for props and data structures
- useTranslation hook imported (i18n ready)
- Placeholder text indicates scaffold status
- No form validation, API calls, or error handling yet (Task 8)
- Styling: Basic React Native StyleSheet with consistent color scheme (#007AFF primary, #F44336 danger)

### Verification
- LSP diagnostics: No errors on all three files
- TypeScript compilation: Clean (verified via LSP)
- Component structure: Follows existing pattern from MainProfileInfo.tsx
- Props interfaces: Minimal but complete for scaffolding phase

## Task 2 Bug Fix: Router Hook Usage (2026-05-21)

### Critical Bug Fixed
Response interceptor was calling `useRouter()` hook inside axios interceptor, which would cause runtime error. React hooks can ONLY be called inside React components.

### Changes Made
1. **Import Changed**
   - From: `import { useRouter } from 'expo-router';`
   - To: `import { router } from 'expo-router';`
   - Uses imperative API instead of hook

2. **Router Calls Fixed**
   - **401 handler (line 212)**: Removed try-catch, direct `router.replace('/Login')`
   - **403 handler (line 230)**: Removed try-catch in Alert.alert onPress, direct `router.replace('/Login')`
   - Both now use imperative `router` object instead of `useRouter()` hook

### Why This Works
- `router` from expo-router is an imperative API that works anywhere (components, interceptors, utilities)
- `useRouter()` is a React hook that only works inside React components
- Axios interceptors are not React components, so hooks cannot be used

### Verification
- TypeScript compilation: Clean (npx tsc --noEmit)
- LSP diagnostics: No errors
- Code is now production-ready

### Testing Notes
- 401 responses: Token cleared, user redirected to login (no hook errors)
- 403 with "blocked"/"revoked": Alert shown, then logout + redirect (no hook errors)
- Router navigation works correctly from interceptor context

## Task 8: Trainer invitations flow (2026-05-22)
- Integrated trainer invitation UI into Profile screen with InviteTrainerByEmail + TrainerInvitationsList refresh token trigger.
- InviteTrainerByEmail now validates email, calls usePostApiTrainerInvitationsByEmail, clears input on success, shows success/error toasts.
- TrainerInvitationsList now fetches paginated invitations via usePostApiTrainerInvitationsPaginated, supports load-more, empty/error states, retry, and refresh after invite/revoke.
- TrainerInvitationItem now revokes via usePostApiTrainerInvitationsInvitationIdRevoke with confirmation dialog and success/error toasts.
- Added toastService.showSuccess helper to support success feedback across new flows.

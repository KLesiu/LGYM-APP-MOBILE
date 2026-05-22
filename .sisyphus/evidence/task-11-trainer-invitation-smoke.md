# Trainer Invitation Flow - Smoke Test Evidence

**Test Date**: 2026-05-22  
**Flow**: Trainer Invitation by Email (Profile Section)  
**Implementation Files**: 
- `app/components/home/profile/Profile.tsx` (integration)
- `app/components/trainer/InviteTrainerByEmail.tsx` (invite form)
- `app/components/trainer/TrainerInvitationsList.tsx` (invitations list)
- `app/components/trainer/TrainerInvitationItem.tsx` (individual invitation)

## Flow Overview
Authenticated trainee can invite trainers by email, view pending invitations, and revoke them.

## Test Scenarios

### 1. Happy Path - Navigate to Profile and View Components

**Test Steps**:
1. Login as trainee user
2. Navigate to Home/Profile section
3. Verify trainer invitation components rendered

**Expected Behavior**:
- Profile screen loads with user info
- `InviteTrainerByEmail` component rendered
- `TrainerInvitationsList` component rendered below
- Both components styled consistently
- Components positioned in profile layout

**Implementation Details**:
- Profile.tsx renders both components at lines 87-90
- `refreshToken` state passed to trigger list refresh
- `onInviteSent` callback updates refreshToken via `setRefreshToken(Date.now())`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 2. Happy Path - Send Trainer Invitation

**Test Steps**:
1. Navigate to Profile section
2. Locate "Invite Trainer by Email" form
3. Enter valid email: `trainer@example.com`
4. Click "Send Invitation" button
5. Verify API call
6. Verify success toast
7. Verify list refreshes

**Expected Behavior**:
- Email input accepts text
- Button disabled until valid email entered
- Email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Button shows "Sending..." during API call
- API call: `POST /api/trainer/invitations/by-email` with `{ email: trimmedEmail }`
- Success toast: `t('trainer.invitationSent')`
- Email input clears after success
- `onInviteSent` callback fires → list refreshes
- New invitation appears in list below

**Implementation Details**:
- Uses `usePostApiTrainerInvitationsByEmail()` hook
- Email trimmed before validation and submission
- Validation: `isValidEmail` computed via useMemo
- Input disabled during `isPending`
- Button disabled when `isPending || !isValidEmail`
- Success: clears input, calls callback, shows toast

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 3. Error Path - Invalid Email Format

**Test Steps**:
1. Navigate to Profile/Invite form
2. Enter invalid email: `notanemail`
3. Attempt to click "Send Invitation"

**Expected Behavior**:
- Button remains disabled (email not valid)
- If somehow submitted, validation error: `t('auth.invalidEmail')`
- Toast validation error shown
- No API call made

**Implementation Details**:
- `isValidEmail` check via regex
- Button disabled when `!isValidEmail`
- Early return with toast if validation fails in `handleSubmit`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 4. Error Path - Empty Email

**Test Steps**:
1. Navigate to Profile/Invite form
2. Leave email input empty
3. Click "Send Invitation" (should be disabled)

**Expected Behavior**:
- Button disabled when email empty
- If somehow submitted, validation error: `t('auth.emailRequired')`
- Toast validation error shown
- No API call made

**Implementation Details**:
- `trimmedEmail` is empty → `isValidEmail` is false
- Button disabled
- Validation check: `!trimmedEmail`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 5. Error Path - API Send Failure

**Test Steps**:
1. Enter valid email
2. Click "Send Invitation"
3. Mock API to return error (e.g., trainer already invited, email not found)

**Expected Behavior**:
- Button shows "Sending..." during attempt
- API call fails
- Error caught in try/catch
- Error toast shown with message from `getErrorMessage()`
- Fallback title: `t('trainer.invitationFailed')`
- Email input NOT cleared
- List NOT refreshed
- User can retry

**Implementation Details**:
- Async/await pattern with try/catch
- Error handling: `getErrorMessage(error, t('trainer.invitationFailed'))`
- Toast: `toastService.showError(errorMessage, title)`
- No callback fired on error

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 6. Happy Path - View Invitations List

**Test Steps**:
1. Navigate to Profile section
2. Observe invitations list component
3. Verify initial load

**Expected Behavior**:
- Title: "Trainer Invitations"
- Description: "Manage your pending trainer invitations"
- Loading spinner shown initially
- API call: `POST /api/trainer/invitations/paginated` with `{ page: 1, pageSize: 10 }`
- Invitations displayed as list items
- If empty: "No invitations" message
- If error: Error message + Retry button

**Implementation Details**:
- Uses `usePostApiTrainerInvitationsPaginated()` mutation
- Loads on mount via `useEffect(..., [])`
- PAGE_SIZE constant: 10
- FlatList with pagination support
- Loading states: `isInitialLoading`, `isLoadingMore`
- Error state: `errorMessage` + retry button

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 7. Happy Path - Pagination (Load More)

**Test Steps**:
1. Have >10 invitations in database
2. Scroll to bottom of list
3. Observe "Load More" behavior

**Expected Behavior**:
- Initial load fetches page 1 (10 items)
- `hasNextPage` indicates more data
- "Load More" button shown at bottom
- Click "Load More" → fetches page 2
- New items appended to list
- Loading spinner shown during fetch
- Button disabled during load

**Implementation Details**:
- FlatList `onEndReached={handleLoadMore}`
- `onEndReachedThreshold={0.5}`
- `handleLoadMore` checks: not loading, has next page
- Load function: `loadInvitations(page + 1, true)` (append=true)
- Footer component shows loading spinner
- `hasNextPage` from API response
- Button text: `t('common.loading')` or `t('common.loadMore')`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 8. Happy Path - Revoke Invitation

**Test Steps**:
1. Navigate to Profile/Invitations list
2. Locate pending invitation item
3. Click "Revoke" button
4. Confirm in dialog
5. Verify API call
6. Verify success toast
7. Verify list refreshes

**Expected Behavior**:
- Only pending invitations show "Revoke" button
- Click "Revoke" → Confirmation dialog appears
- Dialog title: `t('trainer.revokeInvitationTitle')`
- Dialog message: `t('trainer.revokeInvitationMessage')`
- Confirm → Button shows "Revoking..."
- API call: `POST /api/trainer/invitations/{invitationId}/revoke`
- Success toast: `t('trainer.invitationRevoked')`
- Dialog closes
- `onRevoke` callback fires → list reloads from page 1
- Revoked invitation removed or status updated

**Implementation Details**:
- `TrainerInvitationItem` component
- Conditional render: `{status === 'pending' && <RevokeButton />}`
- Uses `usePostApiTrainerInvitationsInvitationIdRevoke()` hook
- Confirmation: `ConfirmDialog` component
- State: `isConfirmVisible` for dialog
- Success: toast + callback + close dialog
- Callback triggers list reload in parent: `loadInvitations(1, false)`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 9. Error Path - Revoke API Failure

**Test Steps**:
1. Click "Revoke" on pending invitation
2. Confirm action
3. Mock API to return error

**Expected Behavior**:
- Button shows "Revoking..." during attempt
- API call fails
- Error caught in try/catch
- Error toast shown: `getErrorMessage()` + `t('trainer.invitationRevokeFailed')`
- Dialog closes
- List NOT refreshed
- Invitation remains in pending state
- User can retry

**Implementation Details**:
- Try/catch in `handleRevoke`
- Error handling via `getErrorMessage()`
- Toast: `toastService.showError()`
- Dialog closed in finally block
- No callback on error

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 10. Error Path - Invitations List Load Failure

**Test Steps**:
1. Navigate to Profile section
2. Mock API to return error on initial load

**Expected Behavior**:
- Loading spinner shown initially
- API call fails
- Error message displayed: `t('trainer.invitationsLoadFailed')`
- "Retry" button shown
- Click Retry → attempts to reload
- Toast error shown

**Implementation Details**:
- Catch block in `loadInvitations`
- Error message: `getErrorMessage(error, t('trainer.invitationsLoadFailed'))`
- State: `setErrorMessage(message)`
- Conditional render: `{errorMessage && invitations.length === 0 && <ErrorView />}`
- Retry button calls `loadInvitations(1, false)`
- Toast shown: `toastService.showError()`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 11. Edge Case - Refresh After Send

**Test Steps**:
1. Send new invitation successfully
2. Observe list update

**Expected Behavior**:
- `onInviteSent` callback fires with email
- `refreshToken` updates to `Date.now()`
- List component detects `refreshToken` change via useEffect
- List reloads from page 1
- New invitation appears at top (or wherever API sorts it)
- `onRefreshHandled` callback fires (if provided)

**Implementation Details**:
- Profile passes: `onInviteSent={() => setRefreshToken(Date.now())}`
- List watches: `useEffect(..., [refreshToken])`
- Effect checks: `if (!refreshToken) return`
- Reloads: `loadInvitations(1, false)` (replace, not append)
- Optional callback: `onRefreshHandled?.()`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 12. UI/UX - Invitation Item Display

**Test Steps**:
1. View various invitation items in list
2. Check status badges and information

**Expected Behavior**:
- Each item shows:
  - Email address (inviteeEmail or traineeEmail)
  - Status badge (colored pill):
    - Pending: orange (#FFA500)
    - Accepted: green (#4CAF50)
    - Rejected: red (#F44336)
  - Status label: "Pending", "Accepted", "Rejected"
  - Creation date (formatted: `toLocaleDateString()`)
- Left border: blue (#007AFF)
- White background, rounded corners
- Responsive layout
- Revoke button only on pending items

**Implementation Details**:
- Item component: `TrainerInvitationItem`
- Status color function: `getStatusColor(status)`
- Status label function: `getStatusLabel(status)`
- Email fallback: `email || '-'`
- Date fallback: `createdAt ? new Date(createdAt).toLocaleDateString() : '-'`
- Conditional revoke button

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 13. UI/UX - Overall Layout

**Test Steps**:
1. Navigate to Profile
2. Verify overall layout and styling
3. Test scrolling

**Expected Behavior**:
- Profile info at top
- Invite form below profile info
- Invitations list below invite form
- Consistent spacing (gap: 12)
- Both components: gray background (#f5f5f5), rounded corners
- Form and list are full width within profile
- List scrolling disabled (parent handles scroll)
- Forms accessible, properly labeled
- Loading states clear and unambiguous

**Implementation Details**:
- Profile component renders both with `style={{ gap: 12 }}`
- InviteTrainerByEmail: Standalone form with submit button
- TrainerInvitationsList: FlatList with `scrollEnabled={false}`
- Parent ScrollView handles overall scrolling
- StyleSheet for consistent styling

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

## Integration Points

### API Endpoints
- **Send Invitation**: `usePostApiTrainerInvitationsByEmail()`
  - Request: `{ data: { email: string } }`
  - Requires authentication
- **Fetch Invitations**: `usePostApiTrainerInvitationsPaginated()`
  - Request: `{ data: { page: number, pageSize: number } }`
  - Returns: `{ items, page, hasNextPage }`
  - Requires authentication
- **Revoke Invitation**: `usePostApiTrainerInvitationsInvitationIdRevoke({ invitationId })`
  - Requires authentication

### Component Hierarchy
```
Profile.tsx
├── MainProfileInfo
├── InviteTrainerByEmail
│   └── (form with email input + submit button)
└── TrainerInvitationsList
    └── FlatList
        └── TrainerInvitationItem (multiple)
            └── ConfirmDialog (modal)
```

### State Management
- **Profile State**:
  - `refreshToken` - triggers list refresh
- **InviteTrainerByEmail State**:
  - `email` - input value
  - `isPending` - mutation loading state
- **TrainerInvitationsList State**:
  - `invitations` - list of items
  - `page` - current page number
  - `hasNextPage` - pagination flag
  - `isLoadingMore` - loading more state
  - `errorMessage` - error state
- **TrainerInvitationItem State**:
  - `isConfirmVisible` - dialog visibility
  - `isPending` - revoke mutation state

### Translation Keys
- `trainer.invitationSent`
- `trainer.invitationFailed`
- `trainer.noInvitations`
- `trainer.invitationsLoadFailed`
- `trainer.invitationRevoked`
- `trainer.invitationRevokeFailed`
- `trainer.revokeInvitationTitle`
- `trainer.revokeInvitationMessage`
- `auth.emailRequired`
- `auth.invalidEmail`
- `common.retry`
- `common.loading`
- `common.loadMore`

---

## Issues Found
None (pending manual verification)

---

## Manual Testing Required
Since no test infrastructure exists, this flow requires manual QA via Playwright:
1. Start web build: `npm run web` (localhost:8083)
2. Login as trainee user
3. Navigate to Home → Profile section
4. Locate trainer invitation components
5. Test sending invitations (valid/invalid emails)
6. Test viewing invitations list
7. Test pagination (if >10 invitations exist)
8. Test revoking pending invitations
9. Test error scenarios (mock API failures)
10. Verify refresh mechanism after sending
11. Capture screenshots/logs for evidence
12. Verify against expected behavior

---

## Test Summary
- **Total Scenarios**: 13
- **Automated**: 0
- **Manual Verification Required**: 13
- **Passed**: TBD
- **Failed**: TBD
- **Blocked**: TBD

---

## Notes
- This flow requires authenticated user (trainee role)
- Other flows (forgot-password, reset-password, public-invitation-status) are public
- Integration point: Profile section in Home view
- State synchronization between form and list via `refreshToken` prop

# Public Invitation Status Flow - Smoke Test Evidence

**Test Date**: 2026-05-22  
**Flow**: Public Invitation Status (`/public-invitation-status`)  
**Implementation File**: `app/public-invitation-status.tsx`

## Flow Overview
User views invitation status and can accept/decline trainer invitations.

## Test Scenarios

### 1. Happy Path - View Pending Invitation

**Test Steps**:
1. Navigate to `/public-invitation-status?invitationId=valid-id-123`
2. Verify invitation data loads
3. Observe pending status badge
4. Verify Accept/Decline buttons shown

**Expected Behavior**:
- Loading spinner shown initially
- API call: `GET /api/invitations/{invitationId}`
- Invitation data displayed:
  - Status badge (orange for pending)
  - Status text: "PENDING"
  - User exists indicator
- Accept button enabled (green)
- Decline button enabled (red)
- Both buttons functional, only one action at a time

**Implementation Details**:
- Uses `useGetApiInvitationsInvitationId(invitationId, code?, options)`
- Query enabled only when `!!invitationId`
- Loading state: `isLoading && !invitationData`
- Status colors: pending=#FFA500, accepted=#4CAF50, rejected/declined=#F44336, expired=#999
- Status check: `status.toLowerCase() === "pending"`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 2. Happy Path - Accept Invitation

**Test Steps**:
1. Navigate to `/public-invitation-status?invitationId=pending-invitation-id`
2. Wait for invitation to load (pending status)
3. Click "Accept" button
4. Verify API call
5. Verify success toast
6. Verify status updates

**Expected Behavior**:
- Accept button shows "Loading..." during mutation
- API call: `POST /api/trainee/invitations/{invitationId}/accept`
- Success toast: `t("invitation.acceptSuccess")` or "Invitation accepted successfully"
- Data refetched (`refetch()`)
- Status updates to "ACCEPTED"
- Accept/Decline buttons hidden (no longer pending)
- Accepted message shown: "You have accepted this invitation"

**Implementation Details**:
- Uses `usePostApiTraineeInvitationsInvitationIdAccept()`
- Mutation config: `onSuccess` → toast + refetch
- Button disabled during either mutation (`acceptMutation.isPending || rejectMutation.isPending`)
- Conditional render: `{isPending && <Buttons />}`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 3. Happy Path - Decline Invitation

**Test Steps**:
1. Navigate to `/public-invitation-status?invitationId=pending-invitation-id`
2. Wait for invitation to load (pending status)
3. Click "Decline" button
4. Verify API call
5. Verify success toast
6. Verify status updates

**Expected Behavior**:
- Decline button shows "Loading..." during mutation
- API call: `POST /api/trainee/invitations/{invitationId}/reject`
- Success toast: `t("invitation.rejectSuccess")` or "Invitation rejected"
- Data refetched
- Status updates to "REJECTED" or "DECLINED"
- Accept/Decline buttons hidden
- Rejected message shown: "You have declined this invitation"

**Implementation Details**:
- Uses `usePostApiTraineeInvitationsInvitationIdReject()`
- Similar mutation pattern to accept
- Both buttons disabled during any mutation

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 4. Error Path - Missing Invitation ID

**Test Steps**:
1. Navigate to `/public-invitation-status` (no invitationId param)
2. Observe error state

**Expected Behavior**:
- No API call made (query disabled)
- Error message displayed:
  - Title: "Missing invitation ID"
  - Description: "The invitation link is invalid"
- No loading spinner
- No Accept/Decline buttons
- User cannot proceed

**Implementation Details**:
- Token extraction: `typeof params.invitationId === "string" ? params.invitationId : ""`
- Query enabled check: `enabled: !!invitationId`
- Early return in `renderContent()`: `if (!invitationId) { return <ErrorView /> }`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 5. Error Path - Invitation Not Found

**Test Steps**:
1. Navigate to `/public-invitation-status?invitationId=non-existent-id`
2. Wait for API response
3. Observe error state

**Expected Behavior**:
- Loading spinner shown initially
- API call made but returns 404 or empty
- Error message: "Invitation not found"
- No Accept/Decline buttons
- User cannot proceed

**Implementation Details**:
- Check: `!invitationData` after loading completes
- Error state rendered
- No action buttons available

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 6. Error Path - API Fetch Failure

**Test Steps**:
1. Navigate to `/public-invitation-status?invitationId=valid-id`
2. Mock API to return network error
3. Observe error handling

**Expected Behavior**:
- Loading spinner shown initially
- API call fails
- Error message displayed:
  - Title: "Error"
  - Description: Error message from `getErrorMessage()`
- No invitation data shown
- No Accept/Decline buttons
- User can refresh to retry

**Implementation Details**:
- `error: fetchError` from query hook
- Error rendered: `if (fetchError) { return <ErrorView /> }`
- Error message via `getErrorMessage(fetchError, t("invitation.fetchError"))`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 7. Error Path - Accept/Decline API Failure

**Test Steps**:
1. Navigate to pending invitation
2. Click Accept or Decline
3. Mock API to return error
4. Observe error handling

**Expected Behavior**:
- Button shows "Loading..." during attempt
- API call fails
- Error toast shown with error message
- User remains on same screen
- Status not updated
- Can retry action

**Implementation Details**:
- `onError` callback in mutation config
- Error message via `getErrorMessage()`
- Toast: `toastService.showError(errorMsg)`
- No navigation or refetch on error

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 8. Edge Case - Already Accepted Invitation

**Test Steps**:
1. Navigate to `/public-invitation-status?invitationId=accepted-invitation`
2. Verify status display

**Expected Behavior**:
- Status badge: green, "ACCEPTED"
- Message: "You have accepted this invitation"
- No Accept/Decline buttons (only shown for pending)
- Read-only view

**Implementation Details**:
- Status check: `isAccepted = status.toLowerCase() === "accepted"`
- Conditional render: `{isAccepted && <Message />}`
- Buttons only rendered when `isPending`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 9. Edge Case - Expired Invitation

**Test Steps**:
1. Navigate to expired invitation
2. Verify status display

**Expected Behavior**:
- Status badge: gray, "EXPIRED"
- Message: "This invitation has expired"
- No Accept/Decline buttons
- Read-only view

**Implementation Details**:
- Status check: `isExpired = status.toLowerCase() === "expired"`
- Conditional render: `{isExpired && <Message />}`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 10. Optional Parameter - Code

**Test Steps**:
1. Navigate to `/public-invitation-status?invitationId=id123&code=secret456`
2. Verify code passed to API

**Expected Behavior**:
- Both invitationId and code extracted from URL params
- API call includes code parameter: `useGetApiInvitationsInvitationId(invitationId, { code })`
- Invitation loads successfully if code valid

**Implementation Details**:
- Code extraction: `typeof params.code === "string" ? params.code : undefined`
- Conditional params: `code ? { code } : undefined`
- Query hook accepts optional second parameter

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 11. UI/UX Validation

**Test Steps**:
1. Navigate to various invitation states
2. Verify layout, styling, and responsiveness
3. Test loading states

**Expected Behavior**:
- Header hidden (`headerShown: false`)
- Background: `bg-bgColor`
- Loading: ActivityIndicator with "Loading invitation..." text
- Status badge: Colored pill with uppercase text
- Card layout: White background, rounded corners
- Buttons: Full width, proper spacing
- Accept: Green/success style
- Decline: Red/cancel style
- Buttons disabled during mutations
- Keyboard avoidance works
- Focus effect clears errors

**Implementation Details**:
- `KeyboardAvoidingView` for mobile
- `ScrollView` with flex layout
- `ActivityIndicator` for loading
- Dynamic status colors via `getStatusColor()`
- `CustomButton` components with `ButtonStyle` props
- Focus effect: `setErrors([])` + `toastService.hide()`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

## Integration Points

### API Endpoints
- **Fetch**: `useGetApiInvitationsInvitationId(invitationId, { code? })`
  - Public endpoint (no auth required based on name)
  - Returns: `{ status, userExists, ... }`
- **Accept**: `usePostApiTraineeInvitationsInvitationIdAccept({ invitationId })`
  - Requires authentication
  - Success → refetch invitation
- **Decline/Reject**: `usePostApiTraineeInvitationsInvitationIdReject({ invitationId })`
  - Requires authentication
  - Success → refetch invitation

### Navigation
- **Entry**: URL params `?invitationId=...&code=...`
- **No exit navigation** - read-only view

### State Management
- **AppContext**: `setErrors([])` on focus
- **Toast Service**: `toastService.hide()` on mount/unmount
- **Query State**: 
  - `isLoading` - loading state
  - `error: fetchError` - fetch error
  - `data: invitationResponse` - invitation data
  - `refetch` - refetch function
- **Mutation State**:
  - `acceptMutation.isPending`
  - `rejectMutation.isPending`

### Translation Keys
- `invitation.missingId`
- `invitation.invalidLink`
- `invitation.loading`
- `invitation.fetchError`
- `invitation.notFound`
- `invitation.statusTitle`
- `invitation.trainerInvitation`
- `invitation.status`
- `invitation.userExists`
- `invitation.pendingMessage`
- `invitation.acceptedMessage`
- `invitation.rejectedMessage`
- `invitation.expiredMessage`
- `invitation.accept`
- `invitation.decline`
- `invitation.acceptSuccess`
- `invitation.acceptError`
- `invitation.rejectSuccess`
- `invitation.rejectError`
- `common.error`
- `common.yes`
- `common.no`
- `common.loading`

---

## Issues Found
None (pending manual verification)

---

## Manual Testing Required
Since no test infrastructure exists, this flow requires manual QA via Playwright:
1. Start web build: `npm run web` (localhost:8083)
2. Navigate to `/public-invitation-status?invitationId=test123`
3. Test with various invitation states (pending, accepted, rejected, expired)
4. Test with/without invitationId parameter
5. Test with/without code parameter
6. Test Accept/Decline actions
7. Mock API errors to test error handling
8. Capture screenshots/logs for evidence
9. Verify against expected behavior

---

## Test Summary
- **Total Scenarios**: 11
- **Automated**: 0
- **Manual Verification Required**: 11
- **Passed**: TBD
- **Failed**: TBD
- **Blocked**: TBD

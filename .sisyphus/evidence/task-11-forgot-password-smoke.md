# Forgot Password Flow - Smoke Test Evidence

**Test Date**: 2026-05-22  
**Flow**: Forgot Password (`/forgot-password`)  
**Implementation File**: `app/forgot-password.tsx`

## Flow Overview
User submits email to receive password reset instructions.

## Test Scenarios

### 1. Happy Path - Valid Email Submission

**Test Steps**:
1. Navigate to `/forgot-password`
2. Enter valid email: `test@example.com`
3. Click "Send Reset Link" button
4. Verify API call to `POST /api/forgot-password`
5. Verify redirect to `/Login` on success

**Expected Behavior**:
- Email validation passes (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- API mutation triggered with trimmed email
- Success: Navigates to Login screen
- No validation errors shown

**Implementation Details**:
- Uses `usePostApiForgotPassword()` hook
- Validates email on submit
- Trims whitespace from email
- Shows validation errors via `toastService`
- Disables input during pending state

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 2. Error Path - Empty Email

**Test Steps**:
1. Navigate to `/forgot-password`
2. Leave email field empty
3. Click "Send Reset Link" button

**Expected Behavior**:
- Validation error shown: `t("auth.emailRequired")`
- Toast message displayed via `toastService.showValidationError()`
- No API call made
- User remains on forgot-password screen

**Implementation Details**:
- Validation in `validateEmail()` checks for empty/whitespace-only input
- Early return prevents API call

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 3. Error Path - Invalid Email Format

**Test Steps**:
1. Navigate to `/forgot-password`
2. Enter invalid email: `notanemail`
3. Click "Send Reset Link" button

**Expected Behavior**:
- Validation error shown: `t("auth.invalidEmail")`
- Toast message displayed via `toastService.showValidationError()`
- No API call made
- User remains on forgot-password screen

**Implementation Details**:
- Email regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Fails for emails without `@` or domain

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 4. Error Path - API Failure

**Test Steps**:
1. Navigate to `/forgot-password`
2. Enter valid email: `test@example.com`
3. Mock API to return error
4. Click "Send Reset Link" button

**Expected Behavior**:
- Error handled in `onError` callback
- Error message extracted via `getErrorMessage()`
- Toast error shown: `toastService.showError(errorMessage, t("auth.forgotPasswordFailed"))`
- User remains on forgot-password screen
- Can retry submission

**Implementation Details**:
- Error handling in mutation's `onError` callback
- Console logs error for debugging
- Generic fallback message: "Failed to process request"

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 5. UI/UX Validation

**Test Steps**:
1. Navigate to `/forgot-password`
2. Verify layout and styling
3. Test "Remember your password? Login" link

**Expected Behavior**:
- Header hidden (`headerShown: false`)
- Title: "Forgot Password"
- Description text explaining the flow
- Email input with label and required asterisk
- Button disabled during pending state
- "Remember your password?" link navigates to `/Login`
- `MiniLoading` component shown during loading
- Keyboard avoidance works on iOS/Android

**Implementation Details**:
- Uses `KeyboardAvoidingView` for mobile keyboard handling
- `ScrollView` with `keyboardShouldPersistTaps="handled"`
- Button disabled when `isPending` is true
- Focus effect clears errors on mount

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

## Integration Points

### API Endpoint
- **Hook**: `usePostApiForgotPassword()`
- **Request**: `{ data: { email: string } }`
- **Success Response**: User redirected to login
- **Error Response**: Error message shown to user

### Navigation
- **Success**: `router.push("/Login")`
- **Cancel**: `goToLogin()` → `router.push("/Login")`

### State Management
- **AppContext**: `setErrors([])` on focus
- **Toast Service**: `toastService.hide()` on mount/unmount
- **Local State**: `email` (string)

### Translation Keys
- `auth.forgotPassword`
- `auth.forgotPasswordDescription`
- `auth.email`
- `auth.sendResetLink`
- `auth.rememberPassword`
- `auth.login`
- `auth.emailRequired`
- `auth.invalidEmail`
- `auth.forgotPasswordFailed`

---

## Issues Found
None (pending manual verification)

---

## Manual Testing Required
Since no test infrastructure exists, this flow requires manual QA via Playwright:
1. Start web build: `npm run web` (localhost:8083)
2. Navigate to `/forgot-password`
3. Execute each test scenario above
4. Capture screenshots/logs for evidence
5. Verify against expected behavior

---

## Test Summary
- **Total Scenarios**: 5
- **Automated**: 0
- **Manual Verification Required**: 5
- **Passed**: TBD
- **Failed**: TBD
- **Blocked**: TBD

# Reset Password Flow - Smoke Test Evidence

**Test Date**: 2026-05-22  
**Flow**: Reset Password (`/reset-password`)  
**Implementation File**: `app/reset-password.tsx`

## Flow Overview
User resets password using token from reset email link.

## Test Scenarios

### 1. Happy Path - Valid Token & Password Reset

**Test Steps**:
1. Navigate to `/reset-password?token=valid-token-123`
2. Enter new password: `NewPassword123` (6+ chars)
3. Enter confirm password: `NewPassword123` (matches)
4. Click "Reset Password" button
5. Verify API call to `POST /api/reset-password`
6. Verify success toast shown
7. Verify redirect to `/Login`

**Expected Behavior**:
- Token extracted from URL params
- Password validation passes (min 6 chars)
- Passwords match validation passes
- API mutation triggered with token + newPassword
- Success toast: `t("auth.passwordResetSuccess")`
- Navigates to Login screen
- Form disabled during pending state

**Implementation Details**:
- Uses `useLocalSearchParams()` to extract token
- Token type-checked: `typeof params.token === "string"`
- Uses `usePostApiResetPassword()` hook
- Validates: token exists, password length >= 6, passwords match
- Button disabled when form invalid or pending
- Form valid when: `isFormValid = newPassword.length >= 6 && newPassword === confirmPassword && !!token`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 2. Error Path - Missing Token

**Test Steps**:
1. Navigate to `/reset-password` (no token param)
2. Observe UI state

**Expected Behavior**:
- Token is empty string
- Red error box displayed: "Invalid reset token"
- Password inputs disabled (`editable={!!token}`)
- Submit button disabled (`disabled={!isFormValid || isPending}`)
- Validation error on submit: `t("auth.invalidResetToken")`

**Implementation Details**:
- Token defaults to empty string if not provided
- Conditional render: `{!token && <ErrorBox />}`
- Form inputs disabled when no token
- Button remains disabled

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 3. Error Path - Password Too Short

**Test Steps**:
1. Navigate to `/reset-password?token=valid-token`
2. Enter new password: `abc` (< 6 chars)
3. Enter confirm password: `abc`
4. Click "Reset Password" button

**Expected Behavior**:
- Validation error: `t("auth.passwordLength")`
- Toast validation error shown
- No API call made
- User remains on reset-password screen

**Implementation Details**:
- Validation in `validate()` function
- Check: `newPassword.length < 6`
- Error added to array and shown via `toastService.showValidationError(newErrors)`

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 4. Error Path - Empty Password

**Test Steps**:
1. Navigate to `/reset-password?token=valid-token`
2. Leave password fields empty
3. Click "Reset Password" button

**Expected Behavior**:
- Validation error: `t("auth.passwordRequired")`
- Toast validation error shown
- Button should be disabled (form not valid)
- No API call made

**Implementation Details**:
- Check: `!newPassword`
- Button disabled when `isFormValid` is false

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 5. Error Path - Passwords Mismatch

**Test Steps**:
1. Navigate to `/reset-password?token=valid-token`
2. Enter new password: `Password123`
3. Enter confirm password: `Password456`
4. Click "Reset Password" button

**Expected Behavior**:
- Validation error: `t("auth.passwordsMismatch")`
- Toast validation error shown
- Button disabled (passwords don't match)
- No API call made
- User remains on reset-password screen

**Implementation Details**:
- Validation check: `newPassword !== confirmPassword`
- Button disabled when passwords mismatch
- Error shown via toast

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 6. Error Path - API Failure (Invalid/Expired Token)

**Test Steps**:
1. Navigate to `/reset-password?token=expired-or-invalid-token`
2. Enter valid matching passwords
3. Click "Reset Password" button
4. Mock API to return 400/401 error

**Expected Behavior**:
- API call made but fails
- Error handled in `onError` callback
- Error message extracted via `getErrorMessage()`
- Toast error shown: `toastService.showError(errorMessage, t("auth.resetPasswordFailed"))`
- Console logs error
- User remains on reset-password screen
- Can retry with different token

**Implementation Details**:
- Error handling in mutation's `onError` callback
- Generic fallback: `t("auth.resetPasswordFailed")`
- Error logged to console

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

### 7. UI/UX Validation

**Test Steps**:
1. Navigate to `/reset-password?token=test123`
2. Verify layout and styling
3. Test password visibility (secure entry)
4. Test form validation feedback

**Expected Behavior**:
- Header hidden (`headerShown: false`)
- Title: "Reset Password"
- Description text displayed
- Token missing → Error box shown (red background)
- Password inputs: `secureTextEntry={true}`
- Required asterisks shown
- Button disabled when form invalid
- Inputs disabled when no token
- Keyboard avoidance works
- Loading indicator shown during API call

**Implementation Details**:
- `KeyboardAvoidingView` for mobile keyboard
- `ScrollView` with `keyboardShouldPersistTaps="handled"`
- Responsive styling with `smallPhone:` variants
- Focus effect clears errors on mount
- `MiniLoading` component shown

**Status**: ⏳ **REQUIRES MANUAL VERIFICATION**

---

## Integration Points

### API Endpoint
- **Hook**: `usePostApiResetPassword()`
- **Request**: `{ data: { token: string, newPassword: string } }`
- **Success Response**: Success toast + redirect to Login
- **Error Response**: Error message shown to user

### Navigation
- **Success**: `router.push("Login")`
- **Entry**: URL param `?token=...`

### State Management
- **AppContext**: `setErrors([])` on focus
- **Toast Service**: `toastService.hide()` on mount/unmount
- **Local State**:
  - `newPassword` (string)
  - `confirmPassword` (string)
  - `token` (from URL params)

### Translation Keys
- `auth.resetPassword`
- `auth.resetPasswordDescription`
- `auth.newPassword`
- `auth.confirmPassword`
- `auth.invalidResetToken`
- `auth.passwordRequired`
- `auth.passwordLength`
- `auth.passwordsMismatch`
- `auth.passwordResetSuccess`
- `auth.resetPasswordFailed`

---

## Issues Found
None (pending manual verification)

---

## Manual Testing Required
Since no test infrastructure exists, this flow requires manual QA via Playwright:
1. Start web build: `npm run web` (localhost:8083)
2. Navigate to `/reset-password?token=test123`
3. Execute each test scenario above
4. Test with/without token parameter
5. Test various password combinations
6. Capture screenshots/logs for evidence
7. Verify against expected behavior

---

## Test Summary
- **Total Scenarios**: 7
- **Automated**: 0
- **Manual Verification Required**: 7
- **Passed**: TBD
- **Failed**: TBD
- **Blocked**: TBD

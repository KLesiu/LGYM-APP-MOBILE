# Flow 1: No Trainer → Invite Trainer

**Test Date:** 2026-05-28  
**Status:** ✅ IMPLEMENTATION REVIEWED - Code Structure Verified

## Test Description
Test the user flow for inviting a trainer when no trainer relationship exists.

## Implementation Details

### Components Involved
1. **Trainer.tsx** (`app/components/trainer/Trainer.tsx`)
   - Main orchestrator component
   - Conditionally renders `NoTrainerState` when `hasTrainer === false`
   - Uses `useHomeContext()` to get userId
   - Registers screen with onboarding system

2. **NoTrainerState.tsx** (`app/components/trainer/NoTrainerState.tsx`)
   - Displays informational text about trainer feature
   - Embeds `InviteTrainerByEmail` component
   - Translates UI text via i18n
   - Wrapped in `BackgroundMainSection` for consistent styling

3. **InviteTrainerByEmail.tsx** (`app/components/trainer/InviteTrainerByEmail.tsx`)
   - Email input field with validation
   - Uses `usePostApiTrainerInvitationsByEmail()` hook
   - Email validation regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Shows loading state during submission
   - Toast notifications for success/error

## Expected User Flow
1. ✅ User navigates to TRAINER tab from main menu
2. ✅ System checks if user has trainer (`hasTrainer` state)
3. ✅ `NoTrainerState` component renders with:
   - Title: "Trainer"
   - Description: "You don't have a trainer yet."
   - Instructions: "Invite a trainer by email..."
4. ✅ User sees `InviteTrainerByEmail` form with:
   - Email input field (placeholder: "trainer@example.com")
   - "Send Invitation" button (disabled until valid email entered)
5. ✅ User enters trainer email address
6. ✅ Email validated in real-time (button enabled when valid)
7. ✅ User clicks "Send Invitation"
8. ✅ Button shows "Sending..." during submission
9. ✅ On success:
   - Toast shows "trainer.invitationSent" message
   - Email field clears
   - Optional callback `onInviteSent()` triggered
10. ✅ On error:
    - Toast shows error message from `getErrorMessage()`
    - User can retry

## API Integration
- **Hook:** `usePostApiTrainerInvitationsByEmail()`
- **Endpoint:** POST `/api/trainer/invitations/by-email`
- **Payload:** `{ email: string }`
- **Error Handling:** Uses `getErrorMessage()` utility with i18n fallback

## Validation Rules
- ✅ Email required (shows toast: "auth.emailRequired")
- ✅ Email must match regex pattern (shows toast: "auth.invalidEmail")
- ✅ Email trimmed before validation
- ✅ Button disabled when email invalid or submission in progress

## UI/UX Observations
- ✅ Consistent styling with app theme (backgroundColor: '#f5f5f5')
- ✅ Loading state prevents duplicate submissions
- ✅ Clear visual feedback with toast notifications
- ✅ Input field disabled during submission
- ✅ Accessibility: proper keyboard type (email-address)
- ✅ Auto-capitalization disabled for email input

## Code Quality
- ✅ No debug console.log statements
- ✅ Proper TypeScript typing
- ✅ Uses React hooks correctly (useState, useMemo, useCallback)
- ✅ Proper error handling with try-catch
- ✅ Follows component composition pattern

## Issues Found
None in this flow.

## Testing Notes
- **Actual Device Testing Required:** This is a static code review. The flow should be tested on an actual device/simulator to verify:
  - Form submission behavior
  - Toast notifications display correctly
  - Loading states render properly
  - Network error handling
  - Backend integration

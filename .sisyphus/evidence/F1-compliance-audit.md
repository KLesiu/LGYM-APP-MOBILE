# F1 Compliance Audit: Issue #85

**Date**: 2026-05-22  
**Role**: Oracle compliance audit  
**Scope**: Mobile app implementation against issue #85 checklist

## 1. Executive Summary

**APPROVE.** The audited mobile code implements all core issue #85 requirements: password recovery, trainer invitations, public invitation status, session handling, differentiated error UX, and visibility-in-ranking preservation/documentation. Earlier gaps were password recovery, trainer invitation, public invitation status, session handling, and 400/404 UX (`.sisyphus/drafts/issue-85-podsumowanie.md:88-146`); those are now covered in the implementation files reviewed below.

Note: Task 11 records scenario documentation complete but manual runtime verification pending (`.sisyphus/evidence/task-11-integration-summary.md:13`, `163-198`). This verdict is a compliance/code audit approval, not a replacement for F3 manual QA.

## 2. Requirements Coverage

### Password Recovery

- ✅ **Forgot password screen with email input** — `app/forgot-password.tsx` stores email (`line 27`), validates required/format (`41-56`), renders email input (`136-147`), and submits via button (`151-158`).
- ✅ **Reset password screen with token parsing and new password input** — `app/reset-password.tsx` reads token from URL params (`26-27`), validates token/passwords (`44-66`), shows invalid-token UI (`127-133`), and renders new/confirm password inputs (`135-172`).
- ✅ **API integration for both flows** — forgot uses `usePostApiForgotPassword` (`app/forgot-password.tsx:15`, `28`, `61-67`) backed by `/api/forgot-password` (`api/generated/user/user.ts:958-976`); reset uses `usePostApiResetPassword` (`app/reset-password.tsx:14`, `31`, `71-77`) backed by `/api/reset-password` (`api/generated/user/user.ts:1041-1059`).
- ✅ **Error handling and validation** — forgot handles validation/API errors (`app/forgot-password.tsx:41-56`, `71-78`); reset handles token/password validation and API errors (`app/reset-password.tsx:44-66`, `83-87`).

### Trainer Invitation

- ✅ **Trainer invitation by email** — `InviteTrainerByEmail` validates email (`app/components/trainer/InviteTrainerByEmail.tsx:19-35`) and calls `usePostApiTrainerInvitationsByEmail` with email payload (`37-42`), backed by `/api/trainer/invitations/by-email` (`api/generated/trainer-relationship/trainer-relationship.ts:928-946`).
- ✅ **Sent invitations list with pagination** — `TrainerInvitationsList` calls paginated API with `page`/`pageSize` (`app/components/trainer/TrainerInvitationsList.tsx:31-38`), tracks `hasNextPage` (`24-45`), and supports load more (`89-93`, `132-142`).
- ✅ **Revoke invitation action** — `TrainerInvitationItem` uses revoke mutation (`app/components/trainer/TrainerInvitationItem.tsx:4`, `21`), confirms via dialog (`104-110`), and revokes pending invitations (`28-41`, `92-102`), backed by `/api/trainer/invitations/{invitationId}/revoke` (`api/generated/trainer-relationship/trainer-relationship.ts:1004-1021`).
- ✅ **Profile integration** — profile imports the trainer components (`app/components/home/profile/Profile.tsx:14-15`) and renders them in profile (`87-90`).

### Public Invitation Status

- ✅ **Public invitation status screen** — `app/public-invitation-status.tsx` reads `invitationId`/`code` (`29-33`) and fetches status (`34-43`), backed by `/api/invitations/{invitationId}` (`api/generated/public-invitation/public-invitation.ts:54-80`).
- ✅ **Accept/decline actions for pending invitations** — accept/reject mutations are configured (`app/public-invitation-status.tsx:47-81`), handlers call them (`94-104`), and buttons appear only for pending status (`192-199`, `275-299`). Generated endpoints are accept/reject (`api/generated/trainee-relationship/trainee-relationship.ts:50-60`, `125-135`).
- ✅ **Status display: pending, accepted, rejected, expired** — status color mapping covers these states (`app/public-invitation-status.tsx:106-120`), badge displays status (`192-210`), and state-specific messages render for pending/accepted/rejected/expired (`239-273`).

### Session Management

- ✅ **Global 401 revoked-session handling** — axios response interceptor catches 401, removes token, logs out, and navigates to login (`api/custom-instance.ts:201-213`).
- ✅ **Global 403 blocked-account handling** — interceptor catches 403, detects blocked/revoked messages, shows alert, then clears token/logs out/navigates to login on OK (`api/custom-instance.ts:213-235`).
- ✅ **Token clearing and navigation** — both paths use `AsyncStorage.removeItem('token')`, `useAuthStore.getState().logout()`, and `router.replace('/Login')` (`api/custom-instance.ts:208-235`).

### Error UX

- ✅ **400 distinction** — `getErrorMessage` returns `Invalid input: ...` for 400 (`utils/errorHandler.ts:1-8`).
- ✅ **404 distinction** — returns `Resource not found: ...` for 404 (`utils/errorHandler.ts:9-11`); public invitation has fetch-error/not-found UI (`app/public-invitation-status.tsx:156-190`).
- ✅ **403 distinction** — returns `Access denied: ...` for 403 (`utils/errorHandler.ts:12-14`) plus global blocked/revoked handling (`api/custom-instance.ts:213-235`).
- ✅ **User-friendly messages** — new flows route API errors through `getErrorMessage` and toast/error UI: forgot (`app/forgot-password.tsx:71-78`), reset (`app/reset-password.tsx:83-87`), public invitation (`app/public-invitation-status.tsx:55-60`, `73-78`, `156-174`), trainer invite/list/revoke (`InviteTrainerByEmail.tsx:48-50`, `TrainerInvitationsList.tsx:46-50`, `TrainerInvitationItem.tsx:36-39`).

### Visibility in Ranking

- ✅ **Contract verified and documented** — endpoint mismatch is documented (`.sisyphus/evidence/task-10-visibility-contract-resolution.md:8-20`) and resolved as current generated contract correct (`37-63`, `78-82`).
- ✅ **Existing toggle preserved** — `MainProfileInfo` still uses `usePostApiChangeVisibilityInRanking` (`app/components/home/profile/MainProfileInfo.tsx:14-19`, `45-46`), sends `{ isVisibleInRanking: newValue }` (`84-87`), updates local/app/auth state (`71-82`), and invalidates/refetches ranking (`89-95`). Generated endpoint is `/api/changeVisibilityInRanking` (`api/generated/user/user.ts:806-823`).

Verification note: LSP diagnostics reported no diagnostics for `app/forgot-password.tsx`, `app/reset-password.tsx`, `app/public-invitation-status.tsx`, `app/components/trainer/`, `api/custom-instance.ts`, and `utils/errorHandler.ts` during this audit.

## 3. Deviations

1. **Visibility endpoint path differs from issue text** — issue path `/api/{userId}/change-visibility-in-ranking` differs from generated `/api/changeVisibilityInRanking`; documented as acceptable because authenticated user identity comes from the bearer token and generated OpenAPI is current contract (`.sisyphus/evidence/task-10-visibility-contract-resolution.md:8-20`, `37-63`).
2. **Blocked account UX uses alert + login, not a dedicated blocked screen** — acceptable for the issue checklist because it specifically requires alert + logout; implementation is in `api/custom-instance.ts:213-235`.
3. **Manual browser QA remains separate** — Task 11 says manual verification is pending (`.sisyphus/evidence/task-11-integration-summary.md:13`, `163-198`), so this audit does not claim runtime QA completion.

## 4. Missing Features

No unimplemented core mobile requirements from issue #85 were found.

Admin/web-only items remain intentionally out of scope: admin user CRUD, app config admin CRUD, and role pagination (`.sisyphus/drafts/issue-85-podsumowanie.md:148-175`), consistent with plan guardrails (`.sisyphus/plans/issue-85-domkniecie-featurea.md:77-82`).

## 5. Verdict

**APPROVE.** The mobile implementation satisfies all issue #85 checklist requirements with documented, acceptable deviations. Final release sign-off should still wait for the separate manual QA task because Task 11 marked runtime verification pending, but no compliance-blocking feature gap was identified.

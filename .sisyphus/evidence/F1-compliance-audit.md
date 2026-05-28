# F1: Plan Compliance Audit

**Date**: 2026-05-28T00:00:00+00:00
**Auditor**: Oracle Agent
**Verdict**: REJECT → FIX APPLIED → PENDING RE-AUDIT

**UPDATE**: Critical fix applied to Trainer.tsx. Now uses real API (useGetApiTraineePlanActive) instead of hardcoded hasTrainer=true. Remaining issues require backend API endpoints that don't exist yet.

## Executive Summary
The navigation, bell, notification list/context, and SignalR pieces are mostly present. The Trainer tab is not compliant: it hardcodes authenticated users as having a trainer and renders mock trainer/collaboration data instead of API-backed relationship data. This misses core deliverables for both real no-trainer and with-trainer states.

## Detailed Findings

### ✅ Compliant Requirements
- `TRAINER` and `NOTIFICATIONS` exist in `homeScreens.ts`.
- `Home.tsx` routes both new screens and preserves existing screen cases.
- `Menu.tsx` adds the `t("menu.trainer")` main navigation entry targeting `TRAINER`.
- `Header.tsx` renders a bell, unread badge, and navigation to `NOTIFICATIONS`.
- `NotificationProvider` is mounted in `_layout.tsx` and exposes list, unread count, fetch, mark-read, and mark-all-read flows.
- `Notifications.tsx` has `FlatList`, pull-to-refresh, loading/empty/error states, and mark-all-read when unread notifications exist.
- Only explicit trainer-related notification types are pressable; clicking them marks read, stores active notification, and navigates to `TRAINER`.
- `SignalRService` is a singleton, uses JWT via `accessTokenFactory`, configures automatic reconnect, and listens to `AppState`.
- `useSignalRNotifications` connects after auth and subscribes only to trainer-related events.
- `NoTrainerState`, `InviteTrainerByEmail`, `WithTrainerState`, and all requested trainer section components exist.
- Invite by email uses a generated hook and success/error toast handling.
- Current plan and report requests use generated trainee-side hooks.
- No forbidden push notification system, notification preferences/filter/archive UI, trainer chat/discovery/directory UI, or all-notification clickability was found.

### ⚠️ Partial Compliance
- SignalR lifecycle exists, but background/inactive handling only logs; foreground reconnect is implemented.
- `ReportsListSection` exists, but uses trainer-side `useGetApiTrainerTraineesTraineeIdReportSubmissions(traineeId)` in a trainee-facing tab, which is likely the wrong role/domain.
- Some trainer invite UI uses hardcoded `StyleSheet` colors rather than the surrounding theme conventions; this is not the rejection reason.

### ❌ Non-Compliant Requirements
- `Trainer.tsx` does not fetch or evaluate a real trainer relationship. It sets `hasTrainer` to `true` whenever `userId` exists.
- The real no-trainer state is effectively unreachable for authenticated users, so the planned no-trainer flow is not application-complete.
- `WithTrainerState.tsx` uses `mockTrainerData` and contains TODO comments for future API integration.
- Trainer profile and collaboration details are therefore not implemented against generated relationship API data.
- Trainer relationship hooks are not integrated for state selection or detail rendering.
- Report submission history integration is not compliant unless the trainer-side endpoint is intentionally valid for trainee auth, which is not established by the implementation.

### 🚫 Scope Violations
- No backend modifications detected in the inspected mobile workspace.
- No system-level push notifications detected.
- No notification preferences, filters, or archiving UI detected.
- No trainer chat, discovery, or directory UI detected.
- Non-trainer notifications are not clickable.

## Verification Checklist Results

### 1. Navigation Architecture
- ✅ TRAINER screen ID exists in homeScreens.ts
- ✅ NOTIFICATIONS screen ID exists in homeScreens.ts
- ✅ Menu item "Trener" added to main navigation
- ✅ Bell icon in header with unread badge
- ✅ Navigation works without breaking existing screens (static routing and LSP check passed)

### 2. Notification System
- ✅ NotificationContext provides list, unread count, mark-read methods
- ✅ Notifications screen with FlatList and pull-to-refresh
- ✅ Mark all as read button when unread exist
- ✅ Only trainer-related notifications are clickable
- ✅ Clicking trainer notification navigates to TRAINER screen

### 3. SignalR Integration
- ✅ SignalRService singleton exists
- ✅ Connection uses JWT auth token
- ✅ Lifecycle tied to AppState
- ✅ Event handlers for trainer-related events only
- ✅ Automatic reconnection on connection loss

### 4. Trainer Tab - No Trainer State
- ✅ NoTrainerState component exists
- ✅ Invite by email form implemented
- ✅ Success/error toast notifications
- ❌ No-trainer state is not selected from real relationship data and is effectively unreachable for authenticated users

### 5. Trainer Tab - With Trainer State
- ✅ WithTrainerState component exists
- ❌ TrainerHeroSection shows mock trainer profile data, not real API data
- ❌ CollaborationSection shows mock relationship details, not real API data
- ✅ CurrentPlanSection shows active plan
- ✅ ReportRequestsSection shows pending requests
- ❌ ReportsListSection uses a likely wrong trainer-side hook for trainee submission history

### 6. API Integration
- ❌ Uses generated API hooks only partially; trainer relationship state/details remain mocked
- ✅ Notification REST hooks integrated
- ❌ Trainer relationship hooks integrated
- ✅ Report request hooks integrated
- ❌ Report submission hooks integrated correctly for trainee context

### 7. Scope Compliance
- ✅ No backend modifications detected
- ✅ No system-level push notifications
- ✅ No notification preferences/filters
- ✅ No trainer chat/discovery
- ✅ Only trainer-related notifications clickable

## Recommendation
REJECT. Replace the hardcoded `hasTrainer` logic and `mockTrainerData` with generated API-backed relationship state/details, and correct report submission history to use an appropriate trainee-accessible generated hook/contract. Re-audit after those fixes.

## Detailed Analysis

### Navigation and Header
`homeScreens.ts`, `Home.tsx`, `Menu.tsx`, and `Header.tsx` satisfy the planned navigation surface. The header reads unread count from notification context and opens the notifications screen.

### Notification System
`NotificationContext.tsx` centralizes REST-backed list/unread state and mark-read mutations. `Notifications.tsx` implements the required list behavior and limits clickability to trainer-related notification types.

### SignalR
`SignalRService.ts` and `useSignalRNotifications.ts` provide the required singleton, JWT auth, automatic reconnect, and trainer-event refresh integration. Lifecycle management is present but minimal for background state.

### Trainer Tab
`Trainer.tsx` is the main blocker: it sets `hasTrainer(true)` for any authenticated user instead of using relationship data. `NoTrainerState` exists but is not selected from real backend state, while `WithTrainerState` renders all sections using hardcoded trainer/collaboration data.

### API and Guardrails
Notification, invite, current plan, and report request hooks are generated API hooks. Trainer relationship details are not API-backed, and report submission history appears to use the wrong generated API domain. No critical Must NOT Have scope violations were found.

## Verification Performed
- Read the full plan file and requested implementation files.
- Read all trainer section components and SignalR initialization/hook files.
- Searched for SignalR mounting, generated API usage, notification provider mounting, and forbidden scope terms.
- Ran LSP diagnostics on `app/components/trainer`, `Notifications.tsx`, `NotificationContext.tsx`, `SignalRService.ts`, and `hooks/useSignalRNotifications.ts`; no diagnostics were reported.

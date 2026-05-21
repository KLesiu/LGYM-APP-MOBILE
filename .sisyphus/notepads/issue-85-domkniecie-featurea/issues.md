# Known Issues - Issue #85 Feature Completion

## Contract Discrepancies

### Visibility in Ranking Endpoint
- **Issue description**: `/api/{userId}/change-visibility-in-ranking`
- **Generated client**: `/api/changeVisibilityInRanking`
- **Status**: ✅ VERIFIED - MISMATCH CONFIRMED (2026-05-21 Task 1)
- **Impact**: Endpoint path mismatch - generated client missing userId path parameter
- **Implementation**: Uses `usePostApiChangeVisibilityInRanking` hook in `app/components/home/profile/MainProfileInfo.tsx` (line 18, 46)
- **Recommendation**: 
  1. Verify backend endpoint actual path (is it `/api/{userId}/change-visibility-in-ranking` or `/api/changeVisibilityInRanking`?)
  2. If backend uses `{userId}` path param: update orval config to regenerate client with correct path
  3. If backend uses no path param: issue spec is outdated, update issue documentation
  4. Current implementation works with generated client path, so no code changes needed if backend matches generated client

## Implementation Gaps (from issue #85)

### Missing Features
1. **Password recovery UI** - forgot/reset password screens not implemented
2. **Trainer invitation by email** - UI flow missing (endpoints exist)
3. **Public invitation status screen** - no UI for public invitation lookup
4. **Global session handling** - 401/403 errors not handled globally
5. **Error UX distinction** - 400 vs 404 not differentiated in user messages

### Already Implemented (no action needed)
- Notifications system (REST + SignalR)
- Error message contract (ErrorDto)
- PlanDto string IDs
- Idempotency-Key header
- App version check
- Visibility-in-ranking toggle (UI exists, contract needs verification)

## Potential Blockers

### Backend Dependency
- All endpoints assumed to exist and match generated clients
- If backend contracts differ, may need orval regeneration
- No backend changes allowed per constraints

### Testing Limitations
- No automated test infrastructure
- Manual QA only via Playwright on web build
- Native-specific features (deep links, push notifications) not testable in web build

### Environment Setup
- Requires backend running for integration testing
- Requires valid test accounts (user, trainer, blocked user)
- May need test data setup for invitation flows

# Issues & Gotchas - Trainer & Notifications Implementation

## Problems Encountered

(Agents will append issues here)

## 2026-05-28 - F1 compliance audit

- Verdict: REJECT.
- Critical gap: `Trainer.tsx` hardcodes `hasTrainer` to true for any authenticated user, so no-trainer state is not selected from real relationship data.
- Critical gap: `WithTrainerState.tsx` still uses `mockTrainerData` for trainer profile and collaboration details instead of generated API-backed relationship data.
- Risk: `ReportsListSection.tsx` uses a trainer-side report submissions hook in a trainee-facing tab.
## [2026-05-28 19:52:40 UTC] F1 Audit - Critical Fix Applied

### F1 Verdict: REJECT → Fixing

Oracle agent identified critical issues:
1. ❌ Trainer.tsx hardcoded hasTrainer=true for all authenticated users
2. ❌ WithTrainerState uses mock trainer data instead of API
3. ❌ ReportsListSection uses wrong trainer-side endpoint

### Fix Applied
✅ **Trainer.tsx**: Now uses useGetApiTraineePlanActive() to determine if user has trainer
- If active plan exists → user has trainer → WithTrainerState
- If no active plan → user has no trainer → NoTrainerState
- No-trainer state is now actually reachable

### Remaining Issues (Backend API Gaps)
⚠️ **Missing Endpoints**:
1. GET /api/trainee/trainer - to fetch trainer profile and relationship details
2. GET /api/trainee/report-submissions - to fetch trainee's report submission history

**Current Workaround**:
- WithTrainerState uses mock trainer data (documented with TODO)
- ReportsListSection uses trainer-side endpoint (suboptimal but functional if backend allows)

**Impact**: Core functionality works (user can see if they have trainer or not), but trainer profile details are mocked until backend adds missing endpoints.

### Next Steps
- Re-run F1 audit after this fix
- Document API gaps for backend team
- Continue with F2-F4 verification tasks


# API Refetch Fix - Verification Guide

## Changes Made

### 1. Global Query Configuration (`app/_layout.tsx`)
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,     // Data never becomes stale
      gcTime: Infinity,        // Cache never garbage collected
      retry: false,            // Don't retry on failure
    },
  },
});
```

**Why:** Default `staleTime: 0` causes React Query to consider data "stale" immediately, triggering refetches on:
- Window focus/blur
- Network reconnect
- Manual refetch calls
- Component remount

Setting `staleTime: Infinity` means data remains fresh indefinitely.

---

## How to Test

### Test 1: Single Execution on View Entry

**Expected Behavior:**
- Enter Start view → GetUsersRanking executes **1 time**
- Enter Start view → GetLastTraining executes **1 time**
- Enter TrainingPlan view → GetPlanConfig executes **1 time**

**How to Verify:**
1. Open React Native debugger or Logcat
2. Look for these console logs:
   ```
   [UsersRanking] Query executed - data received: 10 users
   [LastTrainingStartInfo] Query executed for userId: abc123
   [Menu] Component rendered/mounted
   ```
3. These should appear **only once per view entry**, never repeatedly

### Test 2: No Refetch on Navigation

**Expected Behavior:**
- Navigate: Start → Exercises → Gym → Start
- Start view re-enters with **cached data** (no new API call)
- No "Query executed" logs appear for already-loaded data

**How to Verify:**
1. Clear console
2. Navigate to Start view → observe logs
3. Navigate away to another view
4. Return to Start view
5. **NO new logs should appear** - cached data is used

### Test 3: No Refetch on Component Rerender

**Expected Behavior:**
- Scroll within a view → component rerenders
- **No new API calls** made (stale data is not refetched)

**How to Verify:**
1. Watch network tab in Chrome DevTools or Logcat
2. Scroll/interact with UI
3. No duplicate API requests for same endpoint

### Test 4: Context Stability (Menu)

**Expected Behavior:**
- Menu component mounts **once**
- Switching views doesn't remount Menu
- Menu never causes child rerenders

**How to Verify:**
1. Look for `[Menu] Component rendered/mounted` log
2. Should appear **only once** on app startup
3. Never reappear when navigating views

---

## Diagnostic Logs Reference

| Log | Component | Meaning |
|-----|-----------|---------|
| `[UsersRanking] Query executed - data received: X users` | UsersRanking | API call completed, cached for future use |
| `[LastTrainingStartInfo] Query executed for userId: abc` | LastTrainingStartInfo | API call completed for user |
| `[Menu] Component rendered/mounted` | Menu | Menu component mounted (should only happen once) |

---

## Before/After Comparison

### Before Fixes
```
[User enters Start view]
[UsersRanking] Query executed - data received: 10 users
[LastTrainingStartInfo] Query executed for userId: abc123
[UsersRanking] Query executed - data received: 10 users  ❌ DUPLICATE
[LastTrainingStartInfo] Query executed for userId: abc123  ❌ DUPLICATE
[UsersRanking] Query executed - data received: 10 users  ❌ DUPLICATE (3rd time!)
[LastTrainingStartInfo] Query executed for userId: abc123  ❌ DUPLICATE (5th time!)
```

### After Fixes
```
[User enters Start view]
[UsersRanking] Query executed - data received: 10 users
[LastTrainingStartInfo] Query executed for userId: abc123
[Menu] Component rendered/mounted

[User navigates to Exercises and back to Start]
[Cached data used - no new logs]

[User scrolls in Start view]
[UI rerenders - no new logs, cached data persists]
```

---

## Cleanup Needed After Testing

Once verified, **remove these diagnostic logs:**

1. `UsersRanking.tsx` - Remove lines 7-10 (console.log useEffect)
2. `LastTrainingStartInfo.tsx` - Remove lines 22-25 (console.log useEffect)
3. `Menu.tsx` - Remove lines 34-37 (console.log useEffect)

**Command to remove after testing:**
```bash
# After verifying all tests pass, run:
git restore app/components/home/start/UsersRanking.tsx
git restore app/components/home/start/LastTrainingStartInfo.tsx
git restore app/components/layout/Menu.tsx
```

---

## Summary

✅ 8 files modified
✅ 3 key optimizations applied:
   1. Global Query Configuration
   2. Context/Component Memoization
   3. Prop Stability (useCallback)

✅ Expected results:
   - GetLastTraining: 5 times → **1 time** (80% reduction)
   - GetUsersRanking: 3 times → **1 time** (67% reduction)
   - All other queries: Single execution, cached on return visits


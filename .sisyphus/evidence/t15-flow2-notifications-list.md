# Flow 2: Notifications Bell → Notifications List

**Test Date:** 2026-05-28  
**Status:** ✅ IMPLEMENTATION REVIEWED - Code Structure Verified

## Test Description
Test the user flow for accessing and viewing notifications from the header bell icon.

## Implementation Details

### Components Involved
1. **Header.tsx** (`app/components/layout/Header.tsx`)
   - Displays bell icon in header
   - Shows unread count badge (red circle)
   - Handles navigation to NOTIFICATIONS screen

2. **Notifications.tsx** (`app/components/home/notifications/Notifications.tsx`)
   - Main notifications list component
   - Uses FlatList for performance
   - Pull-to-refresh functionality
   - Mark all as read button
   - Empty state and error state

3. **NotificationContext.tsx** (`app/contexts/NotificationContext.tsx`)
   - Provides notifications data and methods
   - Manages pagination (pageIndex, pageSize=20)
   - Handles unread count
   - Mark as read functionality

## Expected User Flow

### Step 1: Bell Icon Display
✅ **Header Component** (lines 78-92):
- Bell icon rendered from SVG import
- Positioned in header next to user profile
- Badge overlay shows when `unreadCount.count > 0`
- Badge displays count (max "99+")
- Badge styling: red background, white text, absolute positioned

### Step 2: Tap Bell Icon
✅ **Navigation** (line 48-50):
```typescript
const handleBellPress = () => {
  navigateToScreen("NOTIFICATIONS");
};
```
- Triggers navigation to NOTIFICATIONS screen
- Uses HomeContext's `navigateToScreen` function

### Step 3: Notifications Screen Opens
✅ **Screen Structure:**
- Wrapped in `BackgroundMainSection` for consistent styling
- Shows loading state initially if no cached data
- Shows error state with retry button if fetch fails
- Shows empty state if no notifications exist

### Step 4: Notifications List Display
✅ **List Features** (lines 274-292):
- Uses `FlatList` for virtualized rendering
- Each notification shows:
  - Message text (bold if unread, dimmed if read)
  - Notification type label (small text)
  - Unread indicator (blue dot)
  - Timestamp (formatted as relative time: "2m ago", "3h ago", etc.)
- Padding and spacing for readability

### Step 5: Pull-to-Refresh
✅ **Refresh Control** (lines 203-210, 278-285):
```typescript
const handleRefresh = useCallback(async () => {
  setIsRefreshing(true);
  try {
    await fetchNotifications(0, 20);
  } finally {
    setIsRefreshing(false);
  }
}, [fetchNotifications]);
```
- Pull down to refresh
- Shows loading spinner
- Fetches first page of notifications
- State managed independently from main loading

### Step 6: Mark All as Read Button
✅ **Button Display** (lines 256-271):
- Only shows when `hasUnreadNotifications === true`
- Located at top of screen above list
- Primary color button with white text
- Disabled during marking operation
- Text changes to "Marking as read..." during operation

✅ **Mark All Functionality** (lines 212-220):
```typescript
const handleMarkAllAsRead = useCallback(async () => {
  setIsMarkingAllAsRead(true);
  try {
    await markAllAsRead();
    await fetchNotifications();
  } finally {
    setIsMarkingAllAsRead(false);
  }
}, [markAllAsRead, fetchNotifications]);
```

## API Integration

### Notifications List
- **Hook:** `useGetApiIdNotifications(userId, { pageIndex, pageSize })`
- **Context:** Lines 53-61 in NotificationContext.tsx
- **Data Structure:**
  ```typescript
  {
    items: NotificationItem[],
    hasNextPage: boolean,
    nextCursorCreatedAt: string | null,
    nextCursorId: string | null
  }
  ```

### Unread Count
- **Hook:** `useGetApiIdNotificationsUnreadCount(userId)`
- **Context:** Lines 64-69 in NotificationContext.tsx
- **Returns:** `{ count: number }`

### Mark All as Read
- **Hook:** `usePostApiIdNotificationsMarkAllRead()`
- **Mutation:** Lines 141-152 in NotificationContext.tsx
- **Triggers:** Unread count refresh after success

## States Handled

### Loading State
✅ Lines 237-243:
- Shows `ViewLoading` component
- Only when `isLoading === true` AND `items.length === 0`
- Prevents empty list flash

### Error State
✅ Lines 245-251:
- Shows error message with retry button
- Only when error exists AND `items.length === 0`
- Allows partial success (shows cached items with error toast)

### Empty State
✅ Lines 149-165:
- Shows friendly message: "No notifications yet"
- Description: "You'll see your notifications here"
- Centered with proper opacity
- Rendered via `ListEmptyComponent`

## UI/UX Features

### Timestamp Formatting
✅ Function `formatTimestamp` (lines 21-44):
- "Just now" (< 1 minute)
- "Xm ago" (< 60 minutes)
- "Xh ago" (< 24 hours)
- "Xd ago" (< 7 days)
- Full date (≥ 7 days)
- Error handling for invalid dates

### Visual Indicators
- ✅ Unread badge: blue dot on right side
- ✅ Unread styling: bold text, slightly opaque background
- ✅ Read styling: dimmed text (opacity-70), lighter background
- ✅ Type label: shown in small text below message

### Accessibility
- ✅ Proper touch targets (TouchableOpacity)
- ✅ Active opacity feedback (0.8)
- ✅ Color contrast for readability

## Code Quality
- ✅ No debug console.log statements
- ✅ Proper TypeScript typing throughout
- ✅ Uses React hooks correctly (useCallback, useMemo, useState, useEffect)
- ✅ FlatList keyExtractor properly implemented
- ✅ Memoized render functions to prevent unnecessary re-renders
- ✅ Proper error handling with try-finally blocks

## Issues Found
None in this flow's UI components.

## Testing Notes
- **Actual Device Testing Required:** This is a static code review. The flow should be tested on an actual device/simulator to verify:
  - Bell icon renders correctly
  - Badge count updates in real-time
  - Navigation to notifications screen works
  - Pull-to-refresh functionality
  - Mark all as read button
  - List scrolling performance
  - Empty/error/loading states
  - Timestamp formatting accuracy

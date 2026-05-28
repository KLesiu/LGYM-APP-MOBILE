# Architectural Decisions - Trainer & Notifications Implementation

## Key Decisions

(Agents will append decisions here)

## Architectural Decisions (Task 2)

### 1. Separate State Objects for Notifications and Unread Count
**Decision**: Split into `NotificationsListState` and `UnreadState` within context
**Rationale**: 
- Unread count is frequently accessed and updated independently
- Allows selective refetching without reloading entire notification list
- Clearer separation of concerns

### 2. Cursor-Based Pagination Support
**Decision**: Preserve `nextCursorCreatedAt` and `nextCursorId` from backend DTO
**Rationale**:
- Backend uses cursor-based pagination (more efficient than offset)
- Supports infinite scroll patterns in UI (Task 6)
- Prevents issues with data consistency during concurrent updates

### 3. Automatic Unread Count Refresh
**Decision**: Refresh unread count after mark-read operations
**Rationale**:
- Ensures UI stays in sync with backend state
- Single source of truth for unread count
- Prevents stale data in badge/indicators

### 4. React Query Integration
**Decision**: Use generated React Query hooks directly in context
**Rationale**:
- Leverages existing generated API layer
- Automatic caching and refetching
- Consistent with app's API integration pattern
- Reduces boilerplate for data fetching

### 5. userId Dependency from Auth Store
**Decision**: Extract userId from useAuthStore in context
**Rationale**:
- All notification endpoints require user ID
- Centralizes auth dependency
- Enables context to work independently once mounted


## SignalR Integration Decisions (Task 3)

### Decision: Singleton Pattern for SignalRService
**Rationale**:
- Single SignalR connection should be shared across entire app
- Multiple connections would waste resources and complicate state management
- Singleton ensures consistent connection state accessible from anywhere
- Private constructor prevents accidental instantiation
- `getInstance()` provides controlled access to single instance

**Alternative Considered**: Context-based service
- Rejected because SignalR service is low-level infrastructure, not UI state
- Singleton pattern better suited for connection management services

### Decision: Class-Based Service (Not Functional)
**Rationale**:
- SignalR connection requires complex state management (connection, handlers, lifecycle)
- Class encapsulates internal state and provides clean public API
- Private methods like `setupConnectionHandlers()` and `reattachEventHandlers()` keep implementation details hidden
- Instance methods naturally bind to service state

**Alternative Considered**: Functional service with closures
- Rejected due to complexity of managing multiple pieces of mutable state
- Class pattern is clearer and more maintainable for this use case

### Decision: Integration via NotificationContext Methods
**Rationale**:
- Reuses existing NotificationContext API (`refreshUnreadCount()`, `fetchNotifications()`)
- Avoids duplicating notification state management logic
- SignalR acts as trigger mechanism, NotificationContext as source of truth
- Clean separation of concerns: SignalR handles real-time events, NotificationContext handles data

**Alternative Considered**: SignalR directly updating local state
- Rejected because it would bypass NotificationContext and create state inconsistencies
- Server should remain the source of truth; SignalR events just trigger refetch

### Decision: Automatic Reconnection with Exponential Backoff
**Rationale**:
- Network interruptions are common on mobile devices
- Exponential backoff prevents server overload during outages
- Cap at 30 seconds prevents excessive delays
- 10 attempt limit prevents infinite retry loops

**Parameters Chosen**:
- Start: 1s (quick recovery for brief interruptions)
- Max: 30s (balance between responsiveness and server load)
- Max attempts: 10 (reasonable limit before requiring user action)

### Decision: App Lifecycle Hook Integration
**Rationale**:
- Mobile apps frequently go to background (calls, app switching, etc.)
- SignalR connection may be dropped when app is backgrounded
- Automatic reconnection when app returns to foreground improves UX
- React Native `AppState` API is the standard for lifecycle detection

**Implementation**:
- Listener attached when SignalR connects
- Removed when SignalR disconnects (prevents memory leaks)
- Only reconnects if auth token still available

### Decision: Hook-Based Wiring (useSignalRNotifications)
**Rationale**:
- React hooks enable automatic cleanup on unmount
- Hook can access NotificationContext via `useNotifications()`
- Hook responds to auth state changes via `useAuthStore()`
- Fits React component lifecycle model

**Integration Point**: SignalRInitializer component at app root
- Ensures SignalR initializes early in app lifecycle
- Lives inside NotificationProvider (dependency requirement)
- Returns null (no UI needed)

### Decision: Event Handler Pattern (on/off methods)
**Rationale**:
- Allows multiple handlers per event (flexibility)
- Mirrors SignalR's native API (familiar to developers)
- Handlers automatically reattached after reconnection
- Clean removal via `off()` prevents memory leaks

**Alternative Considered**: Single callback per event
- Rejected because it limits flexibility
- Multiple components might want to react to same event in future


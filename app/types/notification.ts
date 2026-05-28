/**
 * Notification Domain Model Types
 * Defines shared types for notification management across the app
 */

import type { InAppNotificationResultDto } from "../../api/generated/model";

/**
 * Represents a single notification item
 * Extends the generated DTO with additional runtime properties
 */
export interface NotificationItem extends InAppNotificationResultDto {
  _id: string; // Ensure _id is always present
}

/**
 * Represents the unread notification state
 */
export interface UnreadState {
  count: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Represents the notifications list state
 */
export interface NotificationsListState {
  items: NotificationItem[];
  hasNextPage: boolean;
  nextCursorCreatedAt: string | null;
  nextCursorId: string | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Represents the complete notification context state
 */
export interface NotificationContextState {
  notifications: NotificationsListState;
  unreadCount: UnreadState;
}

/**
 * Represents the notification context value with state and methods
 */
export interface NotificationContextValue extends NotificationContextState {
  // Query methods
  fetchNotifications: (pageIndex?: number, pageSize?: number) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;

  // Mutation methods
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  // Utility methods
  isLoading: boolean;
  hasError: boolean;
}

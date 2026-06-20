/**
 * Notification Domain Model Types
 * Defines shared types for notification management across the app
 */

import type { InAppNotificationResultDto } from "../../api/generated/model";

export const TRAINER_INVITATION_NOTIFICATION_TYPES = [
  "trainer.invitation.sent",
  "TrainerInvitationReceived",
] as const;

export const isTrainerInvitationNotificationType = (
  type?: string | null
): boolean =>
  !!type &&
  TRAINER_INVITATION_NOTIFICATION_TYPES.includes(
    type as (typeof TRAINER_INVITATION_NOTIFICATION_TYPES)[number]
  );

/**
 * Represents a single notification item
 * Extends the generated DTO with additional runtime properties
 */
export interface NotificationItem extends InAppNotificationResultDto {
  _id: string; // Ensure _id is always present
}

export const getInvitationIdFromRedirectUrl = (
  redirectUrl?: string | null
): string | null => {
  if (!redirectUrl) {
    return null;
  }

  const match = redirectUrl.match(/\/trainers\/invitations\/([^/?#]+)/);
  return match?.[1] ?? null;
};

export const getReportRequestIdFromRedirectUrl = (
  redirectUrl?: string | null
): string | null => {
  if (!redirectUrl) {
    return null;
  }

  const match = redirectUrl.match(/\/trainer\/report-requests\/([^/?#]+)/);
  return match?.[1] ?? null;
};

export const getReportSubmissionIdFromRedirectUrl = (
  redirectUrl?: string | null
): string | null => {
  if (!redirectUrl) {
    return null;
  }

  const match = redirectUrl.match(/\/trainer\/report-submissions\/([^/?#]+)/);
  return match?.[1] ?? null;
};

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

  // Deep link context
  activeNotification: NotificationItem | null;
  setActiveNotification: (notification: NotificationItem | null) => void;
  clearActiveNotification: () => void;

  // Utility methods
  isLoading: boolean;
  hasError: boolean;
}

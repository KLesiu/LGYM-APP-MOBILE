/**
 * Notification Domain Model Types
 * Defines shared types for notification management across the app
 */

import type { InAppNotificationResultDto } from "../api/generated/model";

export const TRAINER_INVITATION_NOTIFICATION_TYPES = [
  "trainer.invitation.sent",
  "TrainerInvitationReceived",
] as const;

export const TRAINER_RELEVANT_NOTIFICATION_TYPES = [
  ...TRAINER_INVITATION_NOTIFICATION_TYPES,
  "trainer.invitation.accepted",
  "trainer.invitation.rejected",
  "ReportRequestReceived",
  "ReportFeedbackReceived",
  "TrainingPlanUpdated",
  "DietPlanUpdated",
  "TraineeNoteUpdated",
  "TrainerMessageReceived",
] as const;

export const isTrainerInvitationNotificationType = (
  type?: string | null
): boolean =>
  !!type &&
  TRAINER_INVITATION_NOTIFICATION_TYPES.includes(
    type as (typeof TRAINER_INVITATION_NOTIFICATION_TYPES)[number]
  );

export const isTrainerRelevantNotificationType = (
  type?: string | null
): boolean =>
  !!type &&
  TRAINER_RELEVANT_NOTIFICATION_TYPES.includes(
    type as (typeof TRAINER_RELEVANT_NOTIFICATION_TYPES)[number]
  );

/**
 * Represents a single notification item
 * Extends the generated DTO with additional runtime properties
 */
export interface NotificationItem extends InAppNotificationResultDto {
  _id: string; // Ensure _id is always present
}

export const getNotificationDeduplicationKey = (item: NotificationItem): string => {
  if (isTrainerInvitationNotificationType(item.type)) {
    const invitationId = getInvitationIdFromRedirectUrl(item.redirectUrl);
    if (invitationId) {
      return `trainer-invitation:${invitationId}`;
    }
  }

  return item._id;
};

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

export const getTraineeNoteIdFromRedirectUrl = (
  redirectUrl?: string | null
): string | null => {
  if (!redirectUrl) {
    return null;
  }

  const match = redirectUrl.match(/\/trainer\/notes\/([^/?#]+)/);
  return match?.[1] ?? null;
};

export type TrainerNotificationTargetTab = "overview" | "plan" | "diet" | "notes" | "requests" | "reports";

export const getTrainerNotificationTargetTab = (
  notification?: Pick<NotificationItem, "type" | "redirectUrl"> | null
): TrainerNotificationTargetTab | null => {
  if (!notification?.type) {
    return null;
  }

  if (
    notification.type === "ReportRequestReceived" &&
    getReportRequestIdFromRedirectUrl(notification.redirectUrl)
  ) {
    return "requests";
  }

  if (
    notification.type === "ReportFeedbackReceived" &&
    getReportSubmissionIdFromRedirectUrl(notification.redirectUrl)
  ) {
    return "reports";
  }

  if (notification.type === "TrainingPlanUpdated") {
    return "plan";
  }

  if (notification.type === "DietPlanUpdated") {
    return "diet";
  }

  if (
    notification.type === "TraineeNoteUpdated" &&
    getTraineeNoteIdFromRedirectUrl(notification.redirectUrl)
  ) {
    return "notes";
  }

  return null;
};

export const formatNotificationTimestamp = (dateString?: string | null): string => {
  if (!dateString) {
    return "";
  }

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Just now";
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString();
  } catch {
    return "";
  }
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

  // Active notification state
  activeNotification: NotificationItem | null;
  setActiveNotification: (notification: NotificationItem | null) => void;
  clearActiveNotification: () => void;

  // Aggregate request state
  isLoading: boolean;
  hasError: boolean;
}

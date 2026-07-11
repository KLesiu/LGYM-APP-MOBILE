import type { NotificationItem } from "../../types/notification";

type PushNavigationSource = "background-open" | "initial-open";

export interface PushNavigationPayload {
  schemaVersion: string | null;
  type: string | null;
  eventId: string | null;
  entityId: string | null;
  inAppNotificationId: string | null;
  deeplink: string | null;
}

export interface PendingPushNavigation extends PushNavigationPayload {
  source: PushNavigationSource;
  receivedAt: number;
}

type MessageLike = {
  data?: Record<string, unknown>;
};

type PendingPushNavigationListener = (
  pendingNavigation: PendingPushNavigation | null
) => void;

let pendingPushNavigation: PendingPushNavigation | null = null;
const listeners = new Set<PendingPushNavigationListener>();

const normalizeNullableValue = (value?: string | null): string | null => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
};

const normalizeMessageDataValue = (value: unknown): string | null => {
  return typeof value === "string" ? normalizeNullableValue(value) : null;
};

const notifyListeners = (): void => {
  listeners.forEach((listener) => {
    listener(pendingPushNavigation);
  });
};

export const extractPushNavigationPayload = (
  message?: MessageLike | null
): PushNavigationPayload | null => {
  if (!message?.data) {
    return null;
  }

  const payload: PushNavigationPayload = {
    schemaVersion: normalizeMessageDataValue(message.data.schemaVersion),
    type: normalizeMessageDataValue(message.data.type),
    eventId: normalizeMessageDataValue(message.data.eventId),
    entityId: normalizeMessageDataValue(message.data.entityId),
    inAppNotificationId: normalizeMessageDataValue(message.data.inAppNotificationId),
    deeplink: normalizeMessageDataValue(message.data.deeplink),
  };

  if (!payload.inAppNotificationId && !payload.deeplink && !payload.entityId) {
    return null;
  }

  return payload;
};

export const queuePendingPushNavigation = (
  pendingNavigation: PendingPushNavigation
): void => {
  pendingPushNavigation = pendingNavigation;
  notifyListeners();
};

export const getPendingPushNavigation = (): PendingPushNavigation | null => {
  return pendingPushNavigation;
};

export const clearPendingPushNavigation = (): void => {
  pendingPushNavigation = null;
  notifyListeners();
};

export const subscribeToPendingPushNavigation = (
  listener: PendingPushNavigationListener
): (() => void) => {
  listeners.add(listener);
  listener(pendingPushNavigation);

  return () => {
    listeners.delete(listener);
  };
};

export const buildNotificationFromPushPayload = (
  payload: PushNavigationPayload
): NotificationItem | null => {
  if (!payload.type && !payload.deeplink && !payload.inAppNotificationId) {
    return null;
  }

  return {
    _id: payload.inAppNotificationId ?? payload.eventId ?? payload.deeplink ?? payload.entityId ?? "push",
    type: payload.type,
    redirectUrl: payload.deeplink,
    message: null,
    isRead: false,
  } as NotificationItem;
};

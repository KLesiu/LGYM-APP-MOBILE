import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { getApiIdNotifications } from "../../../api/generated/in-app-notification/in-app-notification";
import type { InAppNotificationResultDto } from "../../../api/generated/model";
import type { NotificationItem } from "../../types/notification";
import {
  formatNotificationTimestamp,
  getNotificationDeduplicationKey,
  isTrainerRelevantNotificationType,
} from "../../types/notification";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useHomeContext } from "../home/HomeContext";
import useInterval from "../../../helpers/hooks/useInterval";

const OLD_NOTIFICATION_AGE_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 50;
const WARNING_CHECK_INTERVAL_MS = 15 * 1000;

const isOlderThan24Hours = (createdAt?: string | null): boolean => {
  if (!createdAt) {
    return false;
  }

  const createdAtTimestamp = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtTimestamp)) {
    return false;
  }

  return Date.now() - createdAtTimestamp >= OLD_NOTIFICATION_AGE_MS;
};

const mapNotification = (notification: InAppNotificationResultDto): NotificationItem => ({
  ...notification,
  _id: typeof notification._id === "string" ? notification._id : "",
});

const UnreadNotificationWarningModal: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { currentScreen, navigateToScreen } = useHomeContext();
  const {
    notifications,
    unreadCount,
    markAsRead,
    fetchNotifications,
    refreshUnreadCount,
    setActiveNotification,
  } = useNotifications();

  const userId = user?._id || "";
  const isCheckingRef = useRef(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    isCheckingRef.current = false;
    setNotification(null);
    setIsSubmitting(false);
    setRetryTick(0);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, [userId]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const shouldMonitorUnreadNotifications =
    !!userId && currentScreen === "START" && !unreadCount.isLoading && unreadCount.count > 0;

  useInterval(
    () => {
      setRetryTick((value) => value + 1);
    },
    shouldMonitorUnreadNotifications ? WARNING_CHECK_INTERVAL_MS : null
  );

  const loadOldestUnreadNotification = useCallback(async () => {
    if (!userId) {
      return null;
    }

    let oldestNotification: NotificationItem | null = null;
    let hasNextPage = true;
    let cursorCreatedAt: string | undefined;
    let cursorId: string | undefined;
    const visitedCursors = new Set<string>();

    while (hasNextPage) {
      const cursorKey = `${cursorCreatedAt ?? "start"}:${cursorId ?? "start"}`;
      if (visitedCursors.has(cursorKey)) {
        break;
      }
      visitedCursors.add(cursorKey);

      const response = await getApiIdNotifications(userId, {
        Limit: PAGE_SIZE,
        CursorCreatedAt: cursorCreatedAt,
        CursorId: cursorId,
      });

      if (response.status !== 200) {
        throw new Error("Failed to load notifications");
      }

      const items = (response.data.items ?? []).map(mapNotification);

      for (const item of items) {
        if (!item._id || item.isRead || !isOlderThan24Hours(item.createdAt)) {
          continue;
        }

        if (!oldestNotification) {
          oldestNotification = item;
          continue;
        }

        const currentOldestTime = new Date(oldestNotification.createdAt ?? "").getTime();
        const candidateTime = new Date(item.createdAt ?? "").getTime();

        if (!Number.isNaN(candidateTime) && candidateTime < currentOldestTime) {
          oldestNotification = item;
        }
      }

      hasNextPage = response.data.hasNextPage ?? false;
      cursorCreatedAt = response.data.nextCursorCreatedAt ?? undefined;
      cursorId = response.data.nextCursorId ?? undefined;
    }

    return oldestNotification;
  }, [userId]);

  useEffect(() => {
    if (!userId || currentScreen !== "START") {
      setNotification(null);
      return;
    }

    if (unreadCount.isLoading) {
      return;
    }

    if (unreadCount.count < 1) {
      setNotification(null);
      return;
    }

    if (isCheckingRef.current) {
      return;
    }

    let isCancelled = false;
    isCheckingRef.current = true;

    void loadOldestUnreadNotification()
      .then((oldestUnreadNotification) => {
        if (!isCancelled) {
          setNotification(oldestUnreadNotification);
        }
      })
      .catch((error) => {
        console.error("Failed to load unread notification warning:", error);

        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }

        retryTimeoutRef.current = setTimeout(() => {
          setRetryTick((value) => value + 1);
        }, 5000);
      })
      .finally(() => {
        isCheckingRef.current = false;
      });

    return () => {
      isCancelled = true;
    };
  }, [
    currentScreen,
    loadOldestUnreadNotification,
    notifications.items,
    retryTick,
    unreadCount.count,
    unreadCount.isLoading,
    userId,
  ]);

  const navigateNotification = useMemo(
    () => (notification && isTrainerRelevantNotificationType(notification.type) ? "TRAINER" : "NOTIFICATIONS"),
    [notification]
  );

  const finishNotificationAction = useCallback(async () => {
    await refreshUnreadCount();
    await fetchNotifications(0, 20);
    setNotification(null);
  }, [fetchNotifications, refreshUnreadCount]);

  const handleMarkAsRead = useCallback(async () => {
    if (!notification?._id || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await markAsRead(notification._id);
      await finishNotificationAction();
    } catch (error) {
      console.error("Failed to mark notification as read from warning modal:", error);
      Toast.show({
        type: "error",
        text1: t("notifications.markAsReadFailed", "Failed to mark as read"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [finishNotificationAction, isSubmitting, markAsRead, notification, t]);

  const handleGoToNotification = useCallback(async () => {
    if (!notification?._id || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await markAsRead(notification._id);

      if (isTrainerRelevantNotificationType(notification.type)) {
        setActiveNotification(notification);
      }

      await finishNotificationAction();
      navigateToScreen(navigateNotification, { force: true });
    } catch (error) {
      console.error("Failed to open notification from warning modal:", error);
      Toast.show({
        type: "error",
        text1: t("notifications.markAsReadFailed", "Failed to mark as read"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [finishNotificationAction, isSubmitting, markAsRead, navigateNotification, navigateToScreen, notification, setActiveNotification, t]);

  const modalVisible = !!notification;
  const warningKey = notification ? getNotificationDeduplicationKey(notification) : "";

  return (
    <Modal
      key={warningKey}
      transparent
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => undefined}
    >
      <View className="flex-1 items-center justify-center bg-black/70 px-5">
        <View className="w-full max-w-[360px] rounded-3xl border border-primaryColor/30 bg-[#202020] px-6 py-7">
          <Text
            className="text-xs uppercase tracking-[2px] text-primaryColor opacity-90"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("notifications.warningEyebrow")}
          </Text>

          <Text
            className="mt-3 text-3xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("notifications.warningTitle")}
          </Text>

          <Text
            className="mt-3 text-base leading-6 text-textColor opacity-90"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {notification?.message || t("notifications.warningFallbackMessage")}
          </Text>

          {notification?.createdAt ? (
            <Text
              className="mt-4 text-sm text-textColor opacity-60"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("notifications.warningAge", {
                age: formatNotificationTimestamp(notification.createdAt),
              })}
            </Text>
          ) : null}

          <View className="mt-6" style={{ gap: 12 }}>
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={handleGoToNotification}
              className={`rounded-2xl px-4 py-4 ${isSubmitting ? "bg-primaryColor/60" : "bg-primaryColor"}`}
            >
              <Text
                className="text-center text-base text-black"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t("notifications.goToNotification")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isSubmitting}
              onPress={handleMarkAsRead}
              className="rounded-2xl border border-white/15 bg-secondaryColor px-4 py-4"
            >
              <Text
                className="text-center text-base text-textColor"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t("notifications.markAsRead")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UnreadNotificationWarningModal;

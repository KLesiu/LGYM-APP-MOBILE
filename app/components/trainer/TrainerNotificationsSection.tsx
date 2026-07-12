import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { getApiIdNotifications } from "../../../api/generated/in-app-notification/in-app-notification";
import type {
  PagedNotificationsResultDto,
  ResponseMessageDto,
} from "../../../api/generated/model";
import ViewLoading from "../elements/ViewLoading";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAuthStore } from "../../../stores/useAuthStore";
import type { NotificationItem } from "../../../types/notification";
import {
  formatNotificationTimestamp,
  getNotificationDeduplicationKey,
  getTrainerNotificationTargetTab,
  isTrainerRelevantNotificationType,
} from "../../../types/notification";

type TrainerNotificationsTab = "new" | "read" | "all";

interface TrainerNotificationsSectionProps {
  onOpenTargetTab: (notification: NotificationItem) => void;
}

const TrainerNotificationsSection: React.FC<TrainerNotificationsSectionProps> = ({
  onOpenTargetTab,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const userId = user?._id ?? "";
  const {
    markAsRead,
    unreadCount: globalUnreadCount,
    refreshUnreadCount,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<TrainerNotificationsTab>("new");
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);
  const [trainerNotifications, setTrainerNotifications] = useState<NotificationItem[]>([]);
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState<Error | null>(null);

  const isPagedNotificationsResult = (
    data: PagedNotificationsResultDto | ResponseMessageDto | undefined
  ): data is PagedNotificationsResultDto => !!data && "items" in data;

  const fetchTrainerNotifications = useCallback(async () => {
    if (!userId) {
      setTrainerNotifications([]);
      setSectionError(null);
      return;
    }

    setIsSectionLoading(true);
    setSectionError(null);

    try {
      const allItems: NotificationItem[] = [];
      let cursorCreatedAt: string | undefined;
      let cursorId: string | undefined;
      let hasNextPage = true;
      const visitedCursors = new Set<string>();

      while (hasNextPage) {
        const cursorKey = `${cursorCreatedAt ?? "start"}:${cursorId ?? "start"}`;

        if (visitedCursors.has(cursorKey)) {
          break;
        }

        visitedCursors.add(cursorKey);
        const response = await getApiIdNotifications(userId, {
          Limit: 50,
          CursorCreatedAt: cursorCreatedAt,
          CursorId: cursorId,
        });
        const payload = response.data;

        if (!isPagedNotificationsResult(payload)) {
          break;
        }

        const pageItems = (payload.items ?? []).map((item) => ({
          ...item,
          _id: item._id || "",
        }));

        allItems.push(...pageItems);
        hasNextPage = payload.hasNextPage ?? false;
        cursorCreatedAt = payload.nextCursorCreatedAt ?? undefined;
        cursorId = payload.nextCursorId ?? undefined;
      }

      const deduplicatedTrainerNotifications = Array.from(
        new Map(
          allItems
            .filter((notification) => isTrainerRelevantNotificationType(notification.type))
            .map((notification) => [
              getNotificationDeduplicationKey(notification),
              notification,
            ])
        ).values()
      );

      setTrainerNotifications(deduplicatedTrainerNotifications);
    } catch (error) {
      setSectionError(
        error instanceof Error ? error : new Error("Failed to load trainer notifications")
      );
    } finally {
      setIsSectionLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchTrainerNotifications();
  }, [fetchTrainerNotifications, globalUnreadCount.count]);

  const trainerUnreadCount = useMemo(
    () => trainerNotifications.filter((notification) => !notification.isRead).length,
    [trainerNotifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return trainerNotifications;
    }

    return trainerNotifications.filter((notification) =>
      activeTab === "new" ? !notification.isRead : notification.isRead
    );
  }, [activeTab, trainerNotifications]);

  const handleRetry = useCallback(async () => {
    await Promise.all([fetchTrainerNotifications(), refreshUnreadCount()]);
  }, [fetchTrainerNotifications, refreshUnreadCount]);

  const handleNotificationPress = useCallback(
    async (notification: NotificationItem) => {
      const targetTab = getTrainerNotificationTargetTab(notification);

      setActiveNotificationId(notification._id);

      try {
        if (!notification.isRead) {
          await markAsRead(notification._id);
          await refreshUnreadCount();
        }

        await fetchTrainerNotifications();

        if (targetTab) {
          onOpenTargetTab(notification);
        }
      } catch {
        Toast.show({
          type: "error",
          text1: t("notifications.markAsReadFailed", "Failed to mark as read"),
        });
      } finally {
        setActiveNotificationId(null);
      }
    },
    [fetchTrainerNotifications, markAsRead, onOpenTargetTab, refreshUnreadCount, t]
  );

  if (isSectionLoading && trainerNotifications.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
          <Text
            className="text-primaryColor text-base"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("trainer.notificationsSectionTitle", "Notifications")}
          </Text>
        </View>
        <ViewLoading />
      </View>
    );
  }

  if (sectionError && trainerNotifications.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
          <Text
            className="text-primaryColor text-base"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("trainer.notificationsSectionTitle", "Notifications")}
          </Text>
        </View>
        <Text className="text-red-500 text-center">
          {t(
            "trainer.notificationsSectionError",
            "Failed to load trainer notifications"
          )}
        </Text>
        <TouchableOpacity
          onPress={() => {
            void handleRetry();
          }}
          className="bg-primaryColor p-3 rounded-lg"
        >
          <Text
            className="text-black text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("common.retry", "Retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
      <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.notificationsSectionTitle", "Notifications")}
        </Text>
        <View className="bg-primaryColor min-w-8 px-2 py-1 rounded-full items-center justify-center">
          <Text className="text-black text-xs" style={{ fontFamily: "OpenSans_700Bold" }}>
            {trainerUnreadCount > 99 ? "99+" : trainerUnreadCount}
          </Text>
        </View>
      </View>

      <Text className="text-textColor opacity-60" style={{ fontFamily: "OpenSans_400Regular" }}>
        {t(
          "trainer.notificationsSectionDescription",
          "Stay on top of reports, comments and plan changes without leaving the trainer view."
        )}
      </Text>

      <View className="flex-row" style={{ gap: 8 }}>
        {([
          { key: "new", label: t("trainer.notificationsTabNew", "New") },
          { key: "read", label: t("trainer.notificationsTabRead", "Read") },
          { key: "all", label: t("trainer.notificationsTabAll", "All") },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg px-3 py-2 ${
                isActive ? "bg-primaryColor" : "bg-[#202020]"
              }`}
            >
              <Text
                className={`text-center text-sm ${
                  isActive ? "text-black" : "text-textColor"
                }`}
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredNotifications.length === 0 ? (
        <View className="rounded-xl bg-[#202020] px-4 py-6" style={{ gap: 8 }}>
          <Text
            className="text-textColor text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("trainer.notificationsSectionEmpty", "No trainer notifications yet")}
          </Text>
          <Text
            className="text-textColor opacity-60 text-center"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t(
              "trainer.notificationsSectionEmptyDescription",
              "New report updates and plan changes will appear here."
            )}
          </Text>
        </View>
      ) : (
        filteredNotifications.map((notification) => {
          const isBusy = activeNotificationId === notification._id;
          const targetTab = getTrainerNotificationTargetTab(notification);

          return (
            <TouchableOpacity
              key={notification._id}
              onPress={() => {
                void handleNotificationPress(notification);
              }}
              activeOpacity={0.85}
              disabled={isBusy}
              className={`rounded-xl px-4 py-3 ${
                notification.isRead ? "bg-[#202020]" : "bg-[#202020]/80"
              }`}
              style={{ gap: 8 }}
            >
              <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text
                    className={`text-textColor ${notification.isRead ? "opacity-80" : ""}`}
                    style={{
                      fontFamily: notification.isRead
                        ? "OpenSans_400Regular"
                        : "OpenSans_600SemiBold",
                    }}
                  >
                    {notification.message ||
                      t("trainer.notificationsFallbackMessage", "Notification")}
                  </Text>
                  <Text
                    className="text-textColor opacity-50 text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {formatNotificationTimestamp(notification.createdAt)}
                  </Text>
                </View>

                {!notification.isRead ? (
                  <View className="mt-1 h-2 w-2 rounded-full bg-primaryColor" />
                ) : null}
              </View>

              {targetTab ? (
                <View className="flex-row items-center" style={{ gap: 6 }}>
                  <Ionicons name="arrow-forward-outline" size={14} color="#22c55e" />
                  <Text
                    className="text-primaryColor text-xs"
                    style={{ fontFamily: "OpenSans_600SemiBold" }}
                  >
                    {t(
                      "trainer.notificationsOpenContext",
                      "Open related trainer context"
                    )}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

export default TrainerNotificationsSection;

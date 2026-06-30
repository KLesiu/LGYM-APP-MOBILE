import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useNotifications } from "../../../contexts/NotificationContext";
import type { NotificationItem } from "../../../types/notification";
import {
  getInvitationIdFromRedirectUrl,
  isTrainerRelevantNotificationType,
  isTrainerInvitationNotificationType,
} from "../../../types/notification";
import ViewLoading from "../../elements/ViewLoading";
import { useHomeContext } from "../HomeContext";
import {
  usePostApiTraineeInvitationsInvitationIdAccept,
  usePostApiTraineeInvitationsInvitationIdReject,
} from "../../../../api/generated/trainee-relationship/trainee-relationship";
import toastService from "../../../services/toastService";
import { getErrorMessage } from "../../../../utils/errorHandler";

type NotificationTypeLabels = Partial<Record<string, string>>;

interface NotificationItemComponentProps {
  notification: NotificationItem;
}

const formatTimestamp = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch {
    return "";
  }
};

const NotificationItemComponent: React.FC<NotificationItemComponentProps> = ({
  notification,
}) => {
  const { t } = useTranslation();
  const { navigateToScreen } = useHomeContext();
  const { markAsRead, setActiveNotification, fetchNotifications, refreshUnreadCount } = useNotifications();
  const { mutateAsync: acceptInvitation, isPending: isAccepting } =
    usePostApiTraineeInvitationsInvitationIdAccept();
  const { mutateAsync: rejectInvitation, isPending: isRejecting } =
    usePostApiTraineeInvitationsInvitationIdReject();

  const notificationTypeLabels = useMemo(
    (): NotificationTypeLabels => ({
      "trainer.invitation.sent": t("notifications.trainerInvitationLabel"),
      TrainerInvitationReceived: t(
        "notifications.trainerInvitationReceivedLabel"
      ),
      "trainer.invitation.accepted": t("notifications.trainerInvitationAcceptedLabel"),
      "trainer.invitation.rejected": t("notifications.trainerInvitationRejectedLabel"),
      ReportRequestReceived: t("notifications.reportRequestReceivedLabel"),
      ReportFeedbackReceived: t("notifications.reportFeedbackReceivedLabel"),
      TrainingPlanUpdated: t("notifications.trainingPlanUpdatedLabel", "Training plan updated"),
      DietPlanUpdated: t("notifications.dietPlanUpdatedLabel", "Diet updated"),
      TraineeNoteUpdated: t("notifications.traineeNoteUpdatedLabel", "Trainer note updated"),
      TrainerMessageReceived: t("notifications.trainerMessageReceivedLabel", "Trainer message"),
    }),
    [t]
  );

  const isTrainerNotification = useMemo(
    () => isTrainerRelevantNotificationType(notification.type),
    [notification.type]
  );

  const invitationId = useMemo(
    () => getInvitationIdFromRedirectUrl(notification.redirectUrl),
    [notification.redirectUrl]
  );
  const [isInvitationResolved, setIsInvitationResolved] = useState(false);

  const isTrainerInvitation =
    isTrainerInvitationNotificationType(notification.type) &&
    !!invitationId &&
    !notification.isRead &&
    !isInvitationResolved;

  const handleInvitationActionSuccess = useCallback(async () => {
    await markAsRead(notification._id);
    setIsInvitationResolved(true);
    await refreshUnreadCount();
    await fetchNotifications(0, 20);
  }, [fetchNotifications, markAsRead, notification._id, refreshUnreadCount]);

  const handleAcceptInvitation = useCallback(async () => {
    if (!invitationId) {
      return;
    }

    try {
      await acceptInvitation({ invitationId });
      toastService.showSuccess(t("trainer.invitationAccepted"));
      await handleInvitationActionSuccess();
    } catch (error) {
      toastService.showError(
        getErrorMessage(error, t("trainer.invitationAcceptFailed"))
      );
    }
  }, [acceptInvitation, handleInvitationActionSuccess, invitationId, t]);

  const handleRejectInvitation = useCallback(async () => {
    if (!invitationId) {
      return;
    }

    try {
      await rejectInvitation({ invitationId });
      toastService.showSuccess(t("trainer.invitationRejected"));
      await handleInvitationActionSuccess();
    } catch (error) {
      toastService.showError(
        getErrorMessage(error, t("trainer.invitationRejectFailed"))
      );
    }
  }, [handleInvitationActionSuccess, invitationId, rejectInvitation, t]);

  const handlePress = useCallback(async () => {
    if (!isTrainerNotification) {
      return;
    }

    try {
      await markAsRead(notification._id);
      await refreshUnreadCount();
      await fetchNotifications(0, 20);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("notifications.markAsReadFailed", "Failed to mark as read"),
      });
    }

    setActiveNotification(notification);
    navigateToScreen("TRAINER");
  }, [
    isTrainerNotification,
    fetchNotifications,
    markAsRead,
    navigateToScreen,
    notification,
    refreshUnreadCount,
    setActiveNotification,
    t,
  ]);

  const content = (
    <View className="flex-row justify-between items-start">
      <View className="flex-1 pr-2">
        <Text
          className={`text-textColor ${
            notification.isRead ? "opacity-70" : "font-semibold"
          }`}
        >
          {notification.message || "No message"}
        </Text>
        {notification.type && (
          <Text className="text-textColor text-xs opacity-50 mt-1">
            {notificationTypeLabels[notification.type] || notification.type}
          </Text>
        )}
      </View>
      {!notification.isRead && (
        <View className="w-2 h-2 bg-primaryColor rounded-full mt-1" />
      )}
    </View>
  );

  const invitationActions = isTrainerInvitation ? (
    <View className="flex-row mt-3" style={{ gap: 8 }}>
      <TouchableOpacity
        onPress={handleAcceptInvitation}
        disabled={isAccepting || isRejecting}
        className={`flex-1 p-2 rounded-lg ${(isAccepting || isRejecting) ? "bg-primaryColor/60" : "bg-primaryColor"}`}
      >
        <Text className="text-white text-center text-sm font-semibold">
          {isAccepting
            ? t("common.loading", "Loading...")
            : t("trainer.acceptInvitation")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleRejectInvitation}
        disabled={isAccepting || isRejecting}
        className={`flex-1 p-2 rounded-lg ${(isAccepting || isRejecting) ? "bg-red-500/60" : "bg-red-500"}`}
      >
        <Text className="text-white text-center text-sm font-semibold">
          {isRejecting
            ? t("common.loading", "Loading...")
            : t("trainer.rejectInvitation")}
        </Text>
      </TouchableOpacity>
    </View>
  ) : null;

  const containerClassName = `p-4 rounded-lg mb-2 ${
    notification.isRead ? "bg-secondaryColor" : "bg-secondaryColor/80"
  }`;

  if (!isTrainerNotification) {
    return (
      <View className={containerClassName}>
        {content}
        {invitationActions}
        {notification.createdAt && (
          <Text className="text-textColor text-xs opacity-50 mt-2">
            {formatTimestamp(notification.createdAt)}
          </Text>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={containerClassName}
    >
      {content}
      {invitationActions}
      {notification.createdAt && (
        <Text className="text-textColor text-xs opacity-50 mt-2">
          {formatTimestamp(notification.createdAt)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const EmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-textColor text-lg opacity-50">
        {t("notifications.empty", "No notifications yet")}
      </Text>
      <Text className="text-textColor text-sm opacity-30 mt-2">
        {t(
          "notifications.emptyDescription",
          "You'll see your notifications here"
        )}
      </Text>
    </View>
  );
};

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-textColor text-lg opacity-50 mb-4">
        {t("notifications.error", "Failed to load notifications")}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-primaryColor px-6 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          {t("common.retry", "Retry")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const { navigateToScreen } = useHomeContext();
  const {
    notifications,
    fetchNotifications,
    markAllAsRead,
    isLoading,
  } = useNotifications();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = React.useState(false);
  const [activeTab, setActiveTab] = useState<"new" | "seen">("new");

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchNotifications(0, 20);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchNotifications]);

  const handleMarkAllAsRead = useCallback(async () => {
    setIsMarkingAllAsRead(true);
    try {
      await markAllAsRead();
      await fetchNotifications();
    } finally {
      setIsMarkingAllAsRead(false);
    }
  }, [markAllAsRead, fetchNotifications]);

  const handleRetry = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderNotificationItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <NotificationItemComponent notification={item} />
    ),
    []
  );

  const hasUnreadNotifications = notifications.items.some(
    (item) => !item.isRead
  );

  const filteredNotifications = useMemo(
    () =>
      notifications.items.filter((item) =>
        activeTab === "new" ? !item.isRead : !!item.isRead
      ),
    [activeTab, notifications.items]
  );

  if (isLoading && notifications.items.length === 0) {
    return (
      <BackgroundMainSection>
        <ViewLoading />
      </BackgroundMainSection>
    );
  }

  if (notifications.error && notifications.items.length === 0) {
    return (
      <BackgroundMainSection>
        <ErrorState onRetry={handleRetry} />
      </BackgroundMainSection>
    );
  }

  return (
    <BackgroundMainSection>
      <View className="flex-1">
        <View
          className="px-4 pt-4 pb-2 flex-row items-center justify-between"
          style={{ gap: 12 }}
        >
          <Text
            className="text-primaryColor text-xl"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("notifications.title", "Notifications")}
          </Text>
          <TouchableOpacity
            onPress={() => navigateToScreen("START")}
            className="bg-secondaryColor px-4 py-2 rounded-lg"
          >
            <Text className="text-textColor font-semibold">
              {t("notifications.backToStart", "Back to Start")}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="px-4 pt-3 pb-2 flex-row" style={{ gap: 8 }}>
          <TouchableOpacity
            onPress={() => setActiveTab("new")}
            className={`flex-1 p-3 rounded-lg ${
              activeTab === "new" ? "bg-primaryColor" : "bg-secondaryColor"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "new" ? "text-white" : "text-textColor"
              }`}
            >
              {t("notifications.newTab")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("seen")}
            className={`flex-1 p-3 rounded-lg ${
              activeTab === "seen" ? "bg-primaryColor" : "bg-secondaryColor"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "seen" ? "text-white" : "text-textColor"
              }`}
            >
              {t("notifications.seenTab")}
            </Text>
          </TouchableOpacity>
        </View>

        {hasUnreadNotifications && (
          <View className="px-4 pt-2 pb-2">
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className={`bg-primaryColor p-3 rounded-lg ${
                isMarkingAllAsRead ? "opacity-50" : ""
              }`}
            >
              <Text className="text-white text-center font-semibold">
                {isMarkingAllAsRead
                  ? t("notifications.markingAsRead", "Marking as read...")
                  : t("notifications.markAllAsRead", "Mark all as read")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotificationItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#fff"
              colors={["#fff"]}
            />
          }
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            flexGrow: 1,
          }}
        />
      </View>
    </BackgroundMainSection>
  );
};

export default Notifications;

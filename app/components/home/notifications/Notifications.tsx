import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useNotifications } from "../../../contexts/NotificationContext";
import type { NotificationItem } from "../../../types/notification";
import ViewLoading from "../../elements/ViewLoading";

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
  return (
    <View
      className={`p-4 rounded-lg mb-2 ${
        notification.isRead ? "bg-secondaryColor" : "bg-secondaryColor/80"
      }`}
    >
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
              {notification.type}
            </Text>
          )}
        </View>
        {!notification.isRead && (
          <View className="w-2 h-2 bg-primaryColor rounded-full mt-1" />
        )}
      </View>
      {notification.createdAt && (
        <Text className="text-textColor text-xs opacity-50 mt-2">
          {formatTimestamp(notification.createdAt)}
        </Text>
      )}
    </View>
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
  const {
    notifications,
    fetchNotifications,
    markAllAsRead,
    isLoading,
  } = useNotifications();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = React.useState(false);

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
          data={notifications.items}
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

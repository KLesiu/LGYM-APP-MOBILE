import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import {
  useGetApiIdNotifications,
  useGetApiIdNotificationsUnreadCount,
  usePostApiIdNotificationsNotificationIdMarkRead,
  usePostApiIdNotificationsMarkAllRead,
} from "../../api/generated/in-app-notification/in-app-notification";
import type {
  PagedNotificationsResultDto,
  ResponseMessageDto,
  UnreadCountDto,
} from "../../api/generated/model";
import type {
  NotificationContextValue,
  NotificationItem,
  NotificationsListState,
  UnreadState,
} from "../types/notification";
import {
  getNotificationDeduplicationKey,
} from "../types/notification";

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

const isPagedNotificationsResult = (
  data: PagedNotificationsResultDto | ResponseMessageDto | undefined
): data is PagedNotificationsResultDto => !!data && "items" in data;

const isUnreadCountResult = (
  data: UnreadCountDto | ResponseMessageDto | undefined
): data is UnreadCountDto => !!data && "count" in data;

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const userId = user?._id || "";

  // Local state for pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(20);
  const [activeNotification, setActiveNotification] =
    useState<NotificationItem | null>(null);

  // Notifications list query
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useGetApiIdNotifications(userId, {
    Limit: pageSize,
  });

  // Unread count query
  const {
    data: unreadCountData,
    isLoading: unreadCountLoading,
    error: unreadCountError,
    refetch: refetchUnreadCount,
  } = useGetApiIdNotificationsUnreadCount(userId);

  // Mark single notification as read mutation
  const { mutateAsync: markAsReadMutate } =
    usePostApiIdNotificationsNotificationIdMarkRead();

  // Mark all notifications as read mutation
  const { mutateAsync: markAllAsReadMutate } =
    usePostApiIdNotificationsMarkAllRead();

  // Build notifications list state
  const notifications: NotificationsListState = useMemo(() => {
    const notificationsResult = notificationsData?.data;
    const rawItems = isPagedNotificationsResult(notificationsResult)
      ? notificationsResult.items ?? []
      : [];

    const mappedItems: NotificationItem[] = rawItems.map((item) => ({
      ...item,
      _id: item._id || "",
    }));

    const items = Array.from(
      new Map(
        mappedItems.map((item) => [getNotificationDeduplicationKey(item), item])
      ).values()
    );

    return {
      items,
      hasNextPage: isPagedNotificationsResult(notificationsResult)
        ? notificationsResult.hasNextPage ?? false
        : false,
      nextCursorCreatedAt: isPagedNotificationsResult(notificationsResult)
        ? notificationsResult.nextCursorCreatedAt ?? null
        : null,
      nextCursorId: isPagedNotificationsResult(notificationsResult)
        ? notificationsResult.nextCursorId ?? null
        : null,
      isLoading: notificationsLoading,
      error: notificationsError as Error | null,
    };
  }, [notificationsData, notificationsLoading, notificationsError]);

  // Build unread count state
  const unreadCount: UnreadState = useMemo(() => {
    const unreadResult = unreadCountData?.data;

    return {
      count: isUnreadCountResult(unreadResult) ? unreadResult.count ?? 0 : 0,
      isLoading: unreadCountLoading,
      error: unreadCountError as Error | null,
    };
  }, [unreadCountData, unreadCountLoading, unreadCountError]);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (newPageIndex: number = 0, newPageSize: number = 20) => {
      setPageIndex(newPageIndex);
      await refetchNotifications();
    },
    [refetchNotifications]
  );

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    await refetchUnreadCount();
  }, [refetchUnreadCount]);

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await markAsReadMutate({
          id: userId,
          notificationId,
        });
        // Refresh unread count after marking as read
        await refreshUnreadCount();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
      }
    },
    [userId, markAsReadMutate, refreshUnreadCount]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutate({
        id: userId,
      });
      // Refresh unread count after marking all as read
      await refreshUnreadCount();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  }, [userId, markAllAsReadMutate, refreshUnreadCount]);

  // Compute overall loading state
  const isLoading = notificationsLoading || unreadCountLoading;

  // Compute overall error state
  const hasError = !!(notificationsError || unreadCountError);

  // Build context value
  const clearActiveNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  const contextValue: NotificationContextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      fetchNotifications,
      refreshUnreadCount,
      markAsRead,
      markAllAsRead,
      activeNotification,
      setActiveNotification,
      clearActiveNotification,
      isLoading,
      hasError,
    }),
    [
      notifications,
      unreadCount,
      fetchNotifications,
      refreshUnreadCount,
      markAsRead,
      markAllAsRead,
      activeNotification,
      clearActiveNotification,
      isLoading,
      hasError,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

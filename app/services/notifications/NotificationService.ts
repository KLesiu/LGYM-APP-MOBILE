import {
  useGetApiIdNotifications,
  useGetApiIdNotificationsUnreadCount,
  usePostApiIdNotificationsNotificationIdMarkRead,
  usePostApiIdNotificationsMarkAllRead,
} from '../../../api/generated/in-app-notification/in-app-notification';
import type {
  GetApiIdNotificationsParams,
  PostApiIdNotificationsMarkAllReadParams,
  ResponseMessageDto,
  UnreadCountDto,
} from '../../../api/generated/model';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useNotifications } from '../../contexts/NotificationContext';

/**
 * Service layer for notification operations
 * Wraps generated React Query hooks with clean API and error handling
 */
export const useNotificationService = () => {
  const { user } = useAuthStore();
  const userId = user?._id || '';

  const notificationContext = useNotifications();

  // Generated hooks
  const { refetch: refetchNotificationsList } = useGetApiIdNotifications(
    userId,
    { Limit: 20 }
  );

  const { refetch: refetchUnreadCount } =
    useGetApiIdNotificationsUnreadCount(userId);

  const { mutateAsync: markReadMutation } =
    usePostApiIdNotificationsNotificationIdMarkRead();

  const { mutateAsync: markAllReadMutation } =
    usePostApiIdNotificationsMarkAllRead();

  const isUnreadCountResult = (
    data: UnreadCountDto | ResponseMessageDto | undefined
  ): data is UnreadCountDto => !!data && 'count' in data;

  /**
   * Fetch notifications list with pagination
   * @param params - Pagination and filter parameters
   * @returns Promise resolving to notifications data
   */
  const fetchNotifications = async (
    params?: GetApiIdNotificationsParams
  ) => {
    try {
      const result = await refetchNotificationsList();
      if (result.error) {
        console.error('Failed to fetch notifications:', result.error);
        throw result.error;
      }
      return result.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };

  /**
   * Fetch unread notification count
   * @returns Promise resolving to unread count
   */
  const fetchUnreadCount = async () => {
    try {
      const result = await refetchUnreadCount();
      if (result.error) {
        console.error('Failed to fetch unread count:', result.error);
        throw result.error;
      }

      return isUnreadCountResult(result.data?.data)
        ? result.data.data.count ?? 0
        : 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  };

  /**
   * Mark a single notification as read
   * @param notificationId - ID of the notification to mark as read
   * @returns Promise resolving when operation completes
   */
  const markAsRead = async (notificationId: string) => {
    try {
      await markReadMutation({
        id: userId,
        notificationId,
      });

      // Refresh unread count after marking as read
      await notificationContext.refreshUnreadCount();

      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  /**
   * Mark all notifications as read
   * @param params - Optional parameters for the operation
   * @returns Promise resolving when operation completes
   */
  const markAllAsRead = async (
    params?: PostApiIdNotificationsMarkAllReadParams
  ) => {
    try {
      await markAllReadMutation({
        id: userId,
        params,
      });

      // Refresh unread count after marking all as read
      await notificationContext.refreshUnreadCount();

      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  };

  return {
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};

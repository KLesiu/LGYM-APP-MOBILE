import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNotifications } from "../app/contexts/NotificationContext";
import { SignalRService, TrainerNotificationEvents } from "../app/services/signalr";

export const useSignalRNotifications = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { refreshUnreadCount, fetchNotifications } = useNotifications();
  const signalRServiceRef = useRef<SignalRService | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!signalRServiceRef.current) {
      signalRServiceRef.current = SignalRService.getInstance();
    }

    const signalRService = signalRServiceRef.current;

    const refreshNotifications = async (trigger: string) => {
      console.log(`[useSignalRNotifications] Received ${trigger}, refreshing notifications...`);
      try {
        await refreshUnreadCount();
        await fetchNotifications(0, 20);
      } catch (error) {
        console.error("[useSignalRNotifications] Failed to refresh notifications:", error);
      }
    };

    const handleNotificationEvent = async (notification?: { type?: string | null }) => {
      if (!notification) {
        return;
      }

      await refreshNotifications(
        `notification${notification.type ? ` type ${notification.type}` : ""}`
      );
    };

    const handleTrainerEvent = async (eventName: string) => {
      await refreshNotifications(`SignalR event ${eventName}`);
    };

    const handleTrainerInvitationReceived = () =>
      handleTrainerEvent(TrainerNotificationEvents.TrainerInvitationReceived);
    const handleReportRequestReceived = () =>
      handleTrainerEvent(TrainerNotificationEvents.ReportRequestReceived);
    const handleTrainingPlanUpdated = () =>
      handleTrainerEvent(TrainerNotificationEvents.TrainingPlanUpdated);
    const handleTrainerMessageReceived = () =>
      handleTrainerEvent(TrainerNotificationEvents.TrainerMessageReceived);

    const connectSignalR = async () => {
      if (!isAuthenticated || !token) {
        console.log("[useSignalRNotifications] Not authenticated, skipping SignalR connection");
        return;
      }

      try {
        console.log("[useSignalRNotifications] Connecting to SignalR...");
        await signalRService.connect(token);

        signalRService.on(TrainerNotificationEvents.ReceiveNotification, handleNotificationEvent);
        signalRService.on(
          TrainerNotificationEvents.TrainerInvitationReceived,
          handleTrainerInvitationReceived
        );
        signalRService.on(
          TrainerNotificationEvents.ReportRequestReceived,
          handleReportRequestReceived
        );
        signalRService.on(
          TrainerNotificationEvents.TrainingPlanUpdated,
          handleTrainingPlanUpdated
        );
        signalRService.on(
          TrainerNotificationEvents.TrainerMessageReceived,
          handleTrainerMessageReceived
        );

        console.log("[useSignalRNotifications] SignalR event handlers attached");
        isInitializedRef.current = true;
      } catch (error) {
        console.error("[useSignalRNotifications] Failed to connect SignalR:", error);
      }
    };

    const disconnectSignalR = async () => {
      if (!isInitializedRef.current) return;

      try {
        console.log("[useSignalRNotifications] Disconnecting from SignalR...");
        signalRService.off(TrainerNotificationEvents.ReceiveNotification, handleNotificationEvent);
        signalRService.off(
          TrainerNotificationEvents.TrainerInvitationReceived,
          handleTrainerInvitationReceived
        );
        signalRService.off(
          TrainerNotificationEvents.ReportRequestReceived,
          handleReportRequestReceived
        );
        signalRService.off(
          TrainerNotificationEvents.TrainingPlanUpdated,
          handleTrainingPlanUpdated
        );
        signalRService.off(
          TrainerNotificationEvents.TrainerMessageReceived,
          handleTrainerMessageReceived
        );

        await signalRService.disconnect();
        isInitializedRef.current = false;
        console.log("[useSignalRNotifications] SignalR disconnected");
      } catch (error) {
        console.error("[useSignalRNotifications] Failed to disconnect SignalR:", error);
      }
    };

    if (isAuthenticated && token) {
      connectSignalR();
    } else if (isInitializedRef.current) {
      disconnectSignalR();
    }

    return () => {
      if (isInitializedRef.current) {
        disconnectSignalR();
      }
    };
  }, [isAuthenticated, token, refreshUnreadCount, fetchNotifications]);

  return {
    isConnected: signalRServiceRef.current?.isConnected() || false,
    connectionState: signalRServiceRef.current?.getConnectionState() || "disconnected",
  };
};

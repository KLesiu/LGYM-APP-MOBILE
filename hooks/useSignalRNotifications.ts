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

    const handleNotificationEvent = async () => {
      console.log("[useSignalRNotifications] Received notification event, refreshing...");
      try {
        await refreshUnreadCount();
        await fetchNotifications(0, 20);
      } catch (error) {
        console.error("[useSignalRNotifications] Failed to refresh notifications:", error);
      }
    };

    const connectSignalR = async () => {
      if (!isAuthenticated || !token) {
        console.log("[useSignalRNotifications] Not authenticated, skipping SignalR connection");
        return;
      }

      try {
        console.log("[useSignalRNotifications] Connecting to SignalR...");
        await signalRService.connect(token);

        signalRService.on(
          TrainerNotificationEvents.TrainerInvitationReceived,
          handleNotificationEvent
        );
        signalRService.on(
          TrainerNotificationEvents.ReportRequestReceived,
          handleNotificationEvent
        );
        signalRService.on(
          TrainerNotificationEvents.TrainingPlanUpdated,
          handleNotificationEvent
        );
        signalRService.on(
          TrainerNotificationEvents.TrainerMessageReceived,
          handleNotificationEvent
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
        signalRService.off(
          TrainerNotificationEvents.TrainerInvitationReceived,
          handleNotificationEvent
        );
        signalRService.off(
          TrainerNotificationEvents.ReportRequestReceived,
          handleNotificationEvent
        );
        signalRService.off(
          TrainerNotificationEvents.TrainingPlanUpdated,
          handleNotificationEvent
        );
        signalRService.off(
          TrainerNotificationEvents.TrainerMessageReceived,
          handleNotificationEvent
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

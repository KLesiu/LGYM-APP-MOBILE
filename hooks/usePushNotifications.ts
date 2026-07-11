import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { useRouter } from "expo-router";
import { useAppContext } from "../app/AppContext";
import { useAuthStore } from "../stores/useAuthStore";
import {
  getPushAppVersion,
  getPushEnvironment,
  isSamePushRegistrationState,
  registerPushInstallation,
  unregisterPushInstallation,
} from "../app/services/push/pushInstallationService";
import {
  clearPersistedPushRegistrationState,
  getOrCreatePushInstallationId,
  getStoredPushRegistrationState,
  storePushRegistrationState,
  type PushPermissionStatus,
  type PushRegistrationState,
} from "../app/services/push/pushStorage";
import { useNotifications } from "../app/contexts/NotificationContext";
import {
  extractPushNavigationPayload,
  queuePendingPushNavigation,
} from "../app/services/push/pushNotificationNavigation";

const mapPermissionStatus = (status: number): PushPermissionStatus => {
  switch (status) {
    case messaging.AuthorizationStatus.AUTHORIZED:
      return "authorized";
    case messaging.AuthorizationStatus.PROVISIONAL:
      return "provisional";
    case messaging.AuthorizationStatus.EPHEMERAL:
      return "ephemeral";
    case messaging.AuthorizationStatus.DENIED:
      return "denied";
    default:
      return "notDetermined";
  }
};

const isPermissionGranted = (status: PushPermissionStatus): boolean => {
  return status === "authorized" || status === "provisional" || status === "ephemeral";
};

const explainPushPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      "Enable notifications",
      "Turn on notifications to get trainer, report, and app activity updates even when LGYM is closed.",
      [
        {
          text: "Not now",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Continue",
          onPress: () => resolve(true),
        },
      ],
      {
        cancelable: false,
      }
    );
  });
};

const ensureMessagingRegistration = async (): Promise<void> => {
  try {
    await messaging().registerDeviceForRemoteMessages();
  } catch (error) {
    console.warn("Push remote message registration failed", error);
  }
};

export const usePushNotifications = (): void => {
  const { isTokenChecked } = useAppContext();
  const { token, user, isAuthenticated } = useAuthStore();
  const { refreshUnreadCount, fetchNotifications } = useNotifications();
  const router = useRouter();
  const syncInFlightRef = useRef<Promise<void> | null>(null);
  const notificationRefreshInFlightRef = useRef<Promise<void> | null>(null);
  const hasReadInitialNotificationRef = useRef<boolean>(false);

  const refreshNotificationState = async (): Promise<void> => {
    if (!isTokenChecked || !isAuthenticated || !user?._id) {
      return;
    }

    if (notificationRefreshInFlightRef.current) {
      await notificationRefreshInFlightRef.current;
      return;
    }

    const refreshPromise = (async () => {
      await refreshUnreadCount();
      await fetchNotifications(0, 20);
    })();

    notificationRefreshInFlightRef.current = refreshPromise;

    try {
      await refreshPromise;
    } catch (error) {
      console.error("Foreground push refresh failed", error);
    } finally {
      notificationRefreshInFlightRef.current = null;
    }
  };

  const queuePushOpen = async (
    message: { data?: Record<string, unknown> } | null | undefined,
    source: "background-open" | "initial-open"
  ): Promise<void> => {
    const payload = extractPushNavigationPayload(message);
    if (!payload) {
      return;
    }

    queuePendingPushNavigation({
      ...payload,
      source,
      receivedAt: Date.now(),
    });

    if (isAuthenticated) {
      router.replace("/Start");
    }
  };

  const syncPushRegistration = async (forcedToken?: string): Promise<void> => {
    if (!isTokenChecked || !isAuthenticated || !token || !user?._id) {
      console.log("[Push] registration skipped", {
        isTokenChecked,
        isAuthenticated,
        hasToken: Boolean(token),
        userId: user?._id,
      });
      return;
    }

    if (syncInFlightRef.current) {
      await syncInFlightRef.current;
      return;
    }

    const syncPromise = (async () => {
      console.log("[Push] registration sync start", {
        userId: user._id,
        forcedToken: Boolean(forcedToken),
      });

      const installationId = await getOrCreatePushInstallationId();
      const currentPermission = mapPermissionStatus(
        await messaging().hasPermission()
      );

      console.log("[Push] current permission", {
        installationId,
        currentPermission,
      });

      let permissionStatus = currentPermission;
      if (currentPermission === "notDetermined") {
        const acceptedPrePrompt = await explainPushPermission();
        console.log("[Push] pre-prompt result", { acceptedPrePrompt });
        if (!acceptedPrePrompt) {
          return;
        }

        permissionStatus = mapPermissionStatus(await messaging().requestPermission());
        console.log("[Push] permission after request", { permissionStatus });
      }

      if (!isPermissionGranted(permissionStatus)) {
        console.log("[Push] permission not granted", { permissionStatus });
        const storedState = await getStoredPushRegistrationState();
        if (storedState?.installationId === installationId) {
          try {
            await unregisterPushInstallation(installationId, token);
          } catch (error) {
            console.error("Failed to unregister push installation after denied permission", error);
          }
        }

        await clearPersistedPushRegistrationState();
        return;
      }

      await ensureMessagingRegistration();

      const fcmToken = forcedToken ?? (await messaging().getToken());
      if (!fcmToken) {
        console.log("[Push] empty FCM token");
        return;
      }

      console.log("[Push] FCM token acquired", {
        installationId,
        tokenPrefix: fcmToken.slice(0, 12),
      });

      const nextState: PushRegistrationState = {
        authToken: token,
        installationId,
        fcmToken,
        appVersion: getPushAppVersion(),
        environment: getPushEnvironment(),
        permissionStatus,
      };

      const storedState = await getStoredPushRegistrationState();
      if (isSamePushRegistrationState(storedState, nextState)) {
        console.log("[Push] registration unchanged, skipping backend sync", {
          installationId,
        });
        return;
      }

      await registerPushInstallation(nextState, token);
      await storePushRegistrationState(nextState);
      console.log("[Push] registration synced", {
        installationId,
        permissionStatus,
        environment: nextState.environment,
      });
    })();

    syncInFlightRef.current = syncPromise;

    try {
      await syncPromise;
    } catch (error) {
      console.error("Push registration sync failed", error);
    } finally {
      syncInFlightRef.current = null;
    }
  };

  useEffect(() => {
    void syncPushRegistration();
  }, [isAuthenticated, isTokenChecked, token, user?._id]);

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh((refreshedToken) => {
      const authState = useAuthStore.getState();
      if (!authState.isAuthenticated || !authState.token || !authState.user?._id) {
        return;
      }

      void syncPushRegistration(refreshedToken);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async () => {
      await refreshNotificationState();
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp((message) => {
      void queuePushOpen(message, "background-open");
    });

    if (!hasReadInitialNotificationRef.current) {
      hasReadInitialNotificationRef.current = true;

      void messaging()
        .getInitialNotification()
        .then((message) => queuePushOpen(message, "initial-open"))
        .catch((error) => {
          console.error("Failed to read initial push notification", error);
        });
    }

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [fetchNotifications, isAuthenticated, isTokenChecked, refreshUnreadCount, user?._id]);
};

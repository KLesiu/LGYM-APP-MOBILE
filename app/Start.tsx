import { View } from "react-native";
import React, { JSX, useCallback, useRef } from "react";
import { useState } from "react";
import Menu from "./components/layout/Menu";
import Header from "./components//layout/Header";
import Loading from "./components/elements/Loading";
import HomeProvider from "./components/home/HomeContext";
import Start from "./components/home/start/Start";
import { SafeAreaView } from "react-native-safe-area-context";
import Exercises from "./components/home/exercises/Exercises";
import Gym from "./components/home/gym/Gym";
import Training from "./components/home/training/Training";
import TrainingPlan from "./components/home/plan/TrainingPlan";
import History from "./components/home/history/History";
import Measurements from "./components/home/measurements/Measurements";
import Records from "./components/home/records/Records";
import Profile from "./components/home/profile/Profile";
import Trainer from "./components/trainer/Trainer";
import Notifications from "./components/home/notifications/Notifications";
import { DEFAULT_HOME_SCREEN, type HomeScreenId } from "./components/home/homeScreens";
import { useOnboarding } from "./onboarding/OnboardingContext";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useNotifications } from "./contexts/NotificationContext";
import { useAppContext } from "./AppContext";
import { useAuthStore } from "../stores/useAuthStore";
import { getApiIdNotifications } from "../api/generated/in-app-notification/in-app-notification";
import type { PagedNotificationsResultDto, ResponseMessageDto } from "../api/generated/model";
import type { NotificationItem } from "./types/notification";
import {
  buildNotificationFromPushPayload,
  clearPendingPushNavigation,
  getPendingPushNavigation,
  subscribeToPendingPushNavigation,
  type PendingPushNavigation,
} from "./services/push/pushNotificationNavigation";
import {
  getTrainerNotificationTargetTab,
  isTrainerRelevantNotificationType,
} from "./types/notification";

const isPagedNotificationsResult = (
  data: PagedNotificationsResultDto | ResponseMessageDto | undefined
): data is PagedNotificationsResultDto => !!data && "items" in data;

const findNotificationById = async (
  userId: string,
  notificationId: string
): Promise<NotificationItem | null> => {
  let cursorCreatedAt: string | undefined;
  let cursorId: string | undefined;
  const visitedCursors = new Set<string>();

  while (true) {
    const cursorKey = `${cursorCreatedAt ?? "start"}:${cursorId ?? "start"}`;
    if (visitedCursors.has(cursorKey)) {
      return null;
    }

    visitedCursors.add(cursorKey);
    const response = await getApiIdNotifications(userId, {
      Limit: 50,
      CursorCreatedAt: cursorCreatedAt,
      CursorId: cursorId,
    });
    const payload = response.data;

    if (!isPagedNotificationsResult(payload)) {
      return null;
    }

    const matchingNotification = (payload.items ?? []).find(
      (item) => item._id === notificationId
    );
    if (matchingNotification) {
      return {
        ...matchingNotification,
        _id: matchingNotification._id || notificationId,
      };
    }

    if (!payload.hasNextPage) {
      return null;
    }

    cursorCreatedAt = payload.nextCursorCreatedAt ?? undefined;
    cursorId = payload.nextCursorId ?? undefined;
  }
};

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { setScreenNavigator, canUserNavigateToScreen } = useOnboarding();
  const { isTokenChecked } = useAppContext();
  const { isAuthenticated, user } = useAuthStore();
  const {
    fetchNotifications,
    refreshUnreadCount,
    markAsRead,
    setActiveNotification,
    clearActiveNotification,
  } = useNotifications();
  const [currentScreen, setCurrentScreen] = useState<HomeScreenId>(DEFAULT_HOME_SCREEN);
  const [view, setView] = useState<JSX.Element>();
  const [isHeaderShow, setIsHeaderShow] = useState<boolean>(true);
  const lastBlockedToastAtRef = useRef<number>(0);
  const hasInitializedHomeScreenRef = useRef<boolean>(false);
  const pendingPushNavigationRef = useRef<PendingPushNavigation | null>(
    getPendingPushNavigation()
  );
  const isProcessingPushNavigationRef = useRef<boolean>(false);

  const changeView = useCallback((nextView?: JSX.Element) => {
    setCurrentScreen(DEFAULT_HOME_SCREEN);
    setView(nextView ?? <Start />);
  }, []);

  const buildScreen = useCallback(
    (screenId: HomeScreenId): JSX.Element => {
      switch (screenId) {
        case "EXERCISES":
          return <Exercises addExerciseToList={() => {}} />;
        case "GYM":
          return <Gym />;
        case "TRAINING":
          return <Training />;
        case "PLAN":
          return <TrainingPlan />;
        case "HISTORY":
          return <History />;
        case "MEASUREMENTS":
          return <Measurements />;
        case "RECORDS":
          return <Records />;
        case "PROFILE":
          return <Profile changeView={changeView} />;
        case "TRAINER":
          return <Trainer />;
        case "NOTIFICATIONS":
          return <Notifications />;
        case "START":
        default:
          return <Start />;
      }
    },
    [changeView]
  );

  const navigateToScreen = useCallback(
    (screenId: HomeScreenId, options?: { force?: boolean; showBlockedToast?: boolean }) => {
      if (!options?.force && !canUserNavigateToScreen(screenId)) {
        if (options?.showBlockedToast) {
          const now = Date.now();
          if (now - lastBlockedToastAtRef.current > 1200) {
            lastBlockedToastAtRef.current = now;
            Toast.show({
              type: "success",
              text1: t("onboarding.tutorial.navigationLockedTitle"),
              text2: t("onboarding.tutorial.navigationLockedDescription"),
            });
          }
        }

        return;
      }

      setCurrentScreen(screenId);
      setView(buildScreen(screenId));
    },
    [buildScreen, canUserNavigateToScreen, t]
  );

  const changeHeaderVisibility = useCallback((isVisible: boolean) => {
    setIsHeaderShow(isVisible);
  }, []);

  useEffect(() => {
    if (hasInitializedHomeScreenRef.current) {
      return;
    }

    hasInitializedHomeScreenRef.current = true;
    navigateToScreen(DEFAULT_HOME_SCREEN, { force: true });
  }, [navigateToScreen]);

  useEffect(() => {
    setScreenNavigator((screenId) => {
      navigateToScreen(screenId, { force: true });
    });
  }, [navigateToScreen, setScreenNavigator]);

  const showPushFallback = useCallback(() => {
    clearActiveNotification();
    navigateToScreen("NOTIFICATIONS", { force: true });
    Toast.show({
      type: "error",
      text1: t("notifications.openTargetUnavailableTitle", "Notification unavailable"),
      text2: t(
        "notifications.openTargetUnavailableDescription",
        "The related content is no longer available."
      ),
    });
  }, [clearActiveNotification, navigateToScreen, t]);

  const openResolvedNotification = useCallback(
    async (notification: NotificationItem): Promise<void> => {
      if (!notification.isRead) {
        try {
          await markAsRead(notification._id);
        } catch (error) {
          console.error("Failed to mark pushed notification as read", error);
        }
      }

      await Promise.all([refreshUnreadCount(), fetchNotifications(0, 20)]);

      setActiveNotification(notification);

      if (isTrainerRelevantNotificationType(notification.type)) {
        navigateToScreen("TRAINER", { force: true });
        return;
      }

      navigateToScreen("NOTIFICATIONS", { force: true });
    },
    [fetchNotifications, markAsRead, navigateToScreen, refreshUnreadCount, setActiveNotification]
  );

  const processPendingPushNavigation = useCallback(async (): Promise<void> => {
    const pendingNavigation = pendingPushNavigationRef.current;
    if (!pendingNavigation || isProcessingPushNavigationRef.current) {
      return;
    }

    if (!isTokenChecked || !isAuthenticated || !user?._id) {
      return;
    }

    isProcessingPushNavigationRef.current = true;

    try {
      if (pendingNavigation.inAppNotificationId) {
        const notification = await findNotificationById(
          user._id,
          pendingNavigation.inAppNotificationId
        );

        if (notification) {
          await openResolvedNotification(notification);
          clearPendingPushNavigation();
          pendingPushNavigationRef.current = null;
          return;
        }
      }

      const pushNotification = buildNotificationFromPushPayload(pendingNavigation);
      const trainerTargetTab = getTrainerNotificationTargetTab(pushNotification);
      const isTrainerPush = isTrainerRelevantNotificationType(pushNotification?.type);

      if (pushNotification && (trainerTargetTab || isTrainerPush)) {
        await Promise.all([refreshUnreadCount(), fetchNotifications(0, 20)]);
        setActiveNotification(pushNotification);
        navigateToScreen("TRAINER", { force: true });
        clearPendingPushNavigation();
        pendingPushNavigationRef.current = null;
        return;
      }

      showPushFallback();
      clearPendingPushNavigation();
      pendingPushNavigationRef.current = null;
    } catch (error) {
      console.error("Failed to process pending push navigation", error);
      showPushFallback();
      clearPendingPushNavigation();
      pendingPushNavigationRef.current = null;
    } finally {
      isProcessingPushNavigationRef.current = false;
    }
  }, [
    fetchNotifications,
    isAuthenticated,
    isTokenChecked,
    navigateToScreen,
    openResolvedNotification,
    refreshUnreadCount,
    setActiveNotification,
    showPushFallback,
    user?._id,
  ]);

  useEffect(() => {
    const unsubscribe = subscribeToPendingPushNavigation((pendingNavigation) => {
      pendingPushNavigationRef.current = pendingNavigation;
      void processPendingPushNavigation();
    });

    return unsubscribe;
  }, [processPendingPushNavigation]);

  useEffect(() => {
    void processPendingPushNavigation();
  }, [processPendingPushNavigation]);

  return (
    <SafeAreaView className="bg-bgColor flex-1">
      <View className="bg-bgColor flex flex-col justify-between relative h-full ">
        <HomeProvider
          viewChange={changeView}
          navigateToScreen={navigateToScreen}
          changeHeaderVisibility={changeHeaderVisibility}
          currentScreen={currentScreen}
        >
          <Header viewChange={changeView} isHeaderShow={isHeaderShow} />
          {view}
          <Menu />
        </HomeProvider>
        {!view && <Loading />}
      </View>
    </SafeAreaView>
  );
};
export default Home;

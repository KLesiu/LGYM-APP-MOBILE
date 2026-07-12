import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from "react-native-vector-icons/Ionicons";
import BackgroundMainSection from "../elements/BackgroundMainSection";
import ConfirmDialog from "../elements/ConfirmDialog";
import TrainerHeroSection from "./TrainerHeroSection";
import CollaborationSection from "./CollaborationSection";
import CurrentDietSection from "./CurrentDietSection";
import CurrentPlanSection from "./CurrentPlanSection";
import ReportRequestsSection from "./ReportRequestsSection";
import ReportsListSection from "./ReportsListSection";
import TrainerNotesSection from "./TrainerNotesSection";
import TrainerNotificationsSection from "./TrainerNotificationsSection";
import type { TraineeTrainerProfileDto } from "../../../api/generated/model";
import { useNotifications } from "../../contexts/NotificationContext";
import {
  getTrainerNotificationTargetTab,
  type NotificationItem,
} from "../../../types/notification";
import {
  getGetApiTraineeTrainerQueryKey,
  usePostApiTraineeTrainerDetach,
} from "../../../api/generated/trainee-relationship/trainee-relationship";
import toastService from "../../services/toastService";

type TrainerTabKey =
  | "overview"
  | "notifications"
  | "plan"
  | "diet"
  | "notes"
  | "requests"
  | "reports";

interface WithTrainerStateProps {
  trainerProfile?: TraineeTrainerProfileDto;
}

const WithTrainerState: React.FC<WithTrainerStateProps> = ({ trainerProfile }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { activeNotification, setActiveNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<TrainerTabKey>("overview");
  const [isDetachDialogVisible, setDetachDialogVisible] = useState<boolean>(false);
  const detachTrainerMutation = usePostApiTraineeTrainerDetach();
  const isDetachingTrainer = detachTrainerMutation.isPending;

  useEffect(() => {
    const targetTab = getTrainerNotificationTargetTab(activeNotification);

    if (targetTab) {
      setActiveTab(targetTab);
    }
  }, [activeNotification]);

  const handleOpenNotificationTarget = (notification: NotificationItem) => {
    const targetTab = getTrainerNotificationTargetTab(notification);

    if (!targetTab) {
      return;
    }

    setActiveNotification(notification);
    setActiveTab(targetTab);
  };

  const tabs = useMemo(
    () => [
      { key: "overview" as const, label: t("trainer.overviewTab"), icon: "person-outline" },
      { key: "notifications" as const, label: t("trainer.notificationsTab"), icon: "notifications-outline" },
      { key: "plan" as const, label: t("trainer.planTab"), icon: "barbell-outline" },
      { key: "diet" as const, label: t("trainer.dietTab"), icon: "restaurant-outline" },
      { key: "notes" as const, label: t("trainer.notesTab"), icon: "document-text-outline" },
      { key: "requests" as const, label: t("trainer.requestsTab"), icon: "clipboard-outline" },
      { key: "reports" as const, label: t("trainer.reportsTab"), icon: "document-text-outline" },
    ],
    [t]
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case "overview":
        return (
          <CollaborationSection
            relationshipStartDate={trainerProfile?.linkedAt}
            relationshipStatus="active"
            onDetachPress={() => setDetachDialogVisible(true)}
            isDetachingTrainer={isDetachingTrainer}
          />
        );
      case "notifications":
        return (
          <TrainerNotificationsSection
            onOpenTargetTab={handleOpenNotificationTarget}
          />
        );
      case "plan":
        return <CurrentPlanSection />;
      case "diet":
        return <CurrentDietSection />;
      case "notes":
        return <TrainerNotesSection />;
      case "requests":
        return <ReportRequestsSection />;
      case "reports":
        return <ReportsListSection />;
      default:
        return null;
    }
  };

  const detachFromTrainer = async (): Promise<void> => {
    try {
      await detachTrainerMutation.mutateAsync();
      setDetachDialogVisible(false);
      toastService.showSuccess(t("trainer.detachSuccess"));
      await queryClient.invalidateQueries({
        queryKey: getGetApiTraineeTrainerQueryKey(),
      });
      await queryClient.refetchQueries({
        queryKey: getGetApiTraineeTrainerQueryKey(),
        type: "all",
      });
    } catch (error) {
      console.error("Detach from trainer failed", error);
      toastService.showError(t("trainer.detachFailed"));
    }
  };

  return (
    <BackgroundMainSection>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <TrainerHeroSection
          trainerName={trainerProfile?.name}
          trainerEmail={trainerProfile?.email}
          trainerAvatar={trainerProfile?.avatar}
        />

        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`px-4 py-3 rounded-xl flex-row items-center ${
                  isActive ? "bg-primaryColor" : "bg-secondaryColor"
                }`}
                style={{ gap: 8 }}
              >
                <Ionicons
                  name={tab.icon}
                  size={18}
                  color={isActive ? "#000000" : "#22c55e"}
                />
                <Text
                  className={`font-semibold ${
                    isActive ? "text-black" : "text-textColor"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {renderActiveSection()}
      </ScrollView>

      <ConfirmDialog
        visible={isDetachDialogVisible}
        title={t("trainer.detachConfirmTitle")}
        message={t("trainer.detachConfirmMessage")}
        onConfirm={() => {
          void detachFromTrainer();
        }}
        onCancel={() => {
          if (!isDetachingTrainer) {
            setDetachDialogVisible(false);
          }
        }}
      />
    </BackgroundMainSection>
  );
};

export default WithTrainerState;

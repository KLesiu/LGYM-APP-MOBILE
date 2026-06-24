import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import BackgroundMainSection from "../elements/BackgroundMainSection";
import TrainerHeroSection from "./TrainerHeroSection";
import CollaborationSection from "./CollaborationSection";
import CurrentDietSection from "./CurrentDietSection";
import CurrentPlanSection from "./CurrentPlanSection";
import ReportRequestsSection from "./ReportRequestsSection";
import ReportsListSection from "./ReportsListSection";
import TrainerNotificationsSection from "./TrainerNotificationsSection";
import type { TraineeTrainerProfileDto } from "../../../api/generated/model";
import { useNotifications } from "../../contexts/NotificationContext";
import {
  getTrainerNotificationTargetTab,
  type NotificationItem,
} from "../../types/notification";

type TrainerTabKey = "overview" | "plan" | "diet" | "requests" | "reports";

interface WithTrainerStateProps {
  trainerProfile?: TraineeTrainerProfileDto;
}

const WithTrainerState: React.FC<WithTrainerStateProps> = ({ trainerProfile }) => {
  const { t } = useTranslation();
  const { activeNotification, setActiveNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<TrainerTabKey>("overview");

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
      { key: "plan" as const, label: t("trainer.planTab"), icon: "barbell-outline" },
      { key: "diet" as const, label: t("trainer.dietTab"), icon: "restaurant-outline" },
      { key: "requests" as const, label: t("trainer.requestsTab"), icon: "clipboard-outline" },
      { key: "reports" as const, label: t("trainer.reportsTab"), icon: "document-text-outline" },
    ],
    [t]
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <TrainerNotificationsSection
              onOpenTargetTab={handleOpenNotificationTarget}
            />
            <CollaborationSection
              relationshipStartDate={trainerProfile?.linkedAt}
              relationshipStatus="active"
            />
          </>
        );
      case "plan":
        return <CurrentPlanSection />;
      case "diet":
        return <CurrentDietSection />;
      case "requests":
        return <ReportRequestsSection />;
      case "reports":
        return <ReportsListSection />;
      default:
        return null;
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
    </BackgroundMainSection>
  );
};

export default WithTrainerState;

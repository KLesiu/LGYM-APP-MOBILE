import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useGetApiTraineePlanActive } from "../../../api/generated/trainee-relationship/trainee-relationship";
import ViewLoading from "../elements/ViewLoading";
import { useHomeContext } from "../home/HomeContext";

  const CurrentPlanSection: React.FC = () => {
  const { t } = useTranslation();
  const { navigateToScreen } = useHomeContext();
  const { data: planResponse, isLoading, error, refetch } =
    useGetApiTraineePlanActive({
      query: {
        refetchOnMount: "always",
      },
    });

  const formatDate = (isoString: string | undefined): string => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  if (isLoading) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg">
        <ViewLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.currentPlan", "Current Plan")}
        </Text>
        <View style={{ gap: 8 }}>
          <Text className="text-red-500 text-center">
            {t("trainer.planLoadError", "Failed to load plan")}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-primaryColor p-3 rounded-lg"
          >
            <Text
              className="text-black text-center"
              style={{ fontFamily: "OpenSans_600SemiBold" }}
            >
              {t("common.retry", "Retry")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const plan = planResponse?.data;

  if (!plan || !plan._id) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.currentPlan", "Current Plan")}
        </Text>
        <Text className="text-textColor opacity-60 text-center">
          {t("trainer.noPlanAssigned", "No training plan assigned yet")}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
      <Text
        className="text-primaryColor text-base"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {t("trainer.currentPlan", "Current Plan")}
      </Text>

      <View style={{ gap: 10 }}>
        <View>
          <Text
            className="text-textColor text-lg"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {plan.name || t("trainer.unnamedPlan", "Unnamed Plan")}
          </Text>
        </View>

        {plan.createdAt && (
          <View className="flex-row justify-between items-center">
            <Text
              className="text-textColor opacity-60"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("trainer.createdOn", "Created on")}
            </Text>
            <Text
              className="text-textColor"
              style={{ fontFamily: "OpenSans_600SemiBold" }}
            >
              {formatDate(plan.createdAt)}
            </Text>
          </View>
        )}

        {plan.isActive && (
          <View className="flex-row items-center">
            <View className="bg-green-500 px-3 py-1 rounded-full">
              <Text
                className="text-black text-sm"
                style={{ fontFamily: "OpenSans_600SemiBold" }}
              >
                {t("trainer.activePlan", "Active")}
              </Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigateToScreen("PLAN")}
        className="bg-primaryColor p-3 rounded-lg"
      >
        <Text
          className="text-black text-center"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.viewPlanDetails", "View Plan Details")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CurrentPlanSection;

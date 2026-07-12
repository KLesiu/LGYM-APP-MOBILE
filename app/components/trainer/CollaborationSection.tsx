import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomButton, { ButtonStyle } from "../elements/CustomButton";

interface CollaborationSectionProps {
  relationshipStartDate?: string | null;
  relationshipStatus?: string | null;
  onDetachPress?: () => void;
  isDetachingTrainer?: boolean;
}

const CollaborationSection: React.FC<CollaborationSectionProps> = ({
  relationshipStartDate,
  relationshipStatus,
  onDetachPress,
  isDetachingTrainer = false,
}) => {
  const { t } = useTranslation();

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString();
    } catch (error) {
      return isoString;
    }
  };

  const formatDuration = (startDateStr: string): string => {
    try {
      const startDate = new Date(startDateStr);
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return t("trainer.durationDays", {
          count: diffDays,
          defaultValue: `${diffDays} day${diffDays !== 1 ? "s" : ""}`,
        });
      }
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) {
        return t("trainer.durationMonths", {
          count: diffMonths,
          defaultValue: `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`,
        });
      }
      
      const diffYears = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      if (remainingMonths === 0) {
        return t("trainer.durationYears", {
          count: diffYears,
          defaultValue: `${diffYears} year${diffYears !== 1 ? "s" : ""}`,
        });
      }
      return t("trainer.durationYearsMonths", {
        years: diffYears,
        months: remainingMonths,
        defaultValue: `${diffYears}y ${remainingMonths}m`,
      });
    } catch (error) {
      return "";
    }
  };

  const getStatusColor = (status?: string | null): string => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "inactive":
        return "text-red-500";
      default:
        return "text-textColor";
    }
  };

  const getStatusLabel = (status?: string | null): string => {
    switch (status?.toLowerCase()) {
      case "active":
        return t("trainer.statusActive", "Active");
      case "pending":
        return t("trainer.statusPending", "Pending");
      case "inactive":
        return t("trainer.statusInactive", "Inactive");
      default:
        return status || t("trainer.statusUnknown", "Unknown");
    }
  };

  const hasStartDate = !!relationshipStartDate;
  const hasStatus = !!relationshipStatus;
  const hasAnyDetails = hasStartDate || hasStatus;

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 16 }}>
      <Text 
        className="text-primaryColor text-base"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {t("trainer.collaboration", "Collaboration")}
      </Text>

      <View style={{ gap: 10 }}>
        {!hasAnyDetails ? (
          <Text
            className="text-textColor opacity-60"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t("trainer.collaborationDetailsUnavailable")}
          </Text>
        ) : (
          <>
            {hasStartDate && relationshipStartDate ? (
              <>
                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-textColor opacity-60"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("trainer.since", "Since")}
                  </Text>
                  <Text
                    className="text-textColor"
                    style={{ fontFamily: "OpenSans_600SemiBold" }}
                  >
                    {formatDate(relationshipStartDate)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-textColor opacity-60"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("trainer.duration", "Duration")}
                  </Text>
                  <Text
                    className="text-textColor"
                    style={{ fontFamily: "OpenSans_600SemiBold" }}
                  >
                    {formatDuration(relationshipStartDate)}
                  </Text>
                </View>
              </>
            ) : null}

            {hasStatus ? (
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-textColor opacity-60"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {t("trainer.status", "Status")}
                </Text>
                <Text
                  className={getStatusColor(relationshipStatus)}
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {getStatusLabel(relationshipStatus)}
                </Text>
              </View>
            ) : null}
          </>
        )}
      </View>

      {onDetachPress ? (
        <View className="border-t border-[#3f3f3f] pt-4" style={{ gap: 12 }}>
          <View className="flex-row items-start" style={{ gap: 12 }}>
            <View className="w-10 h-10 rounded-full bg-[#3f3f3f] items-center justify-center">
              <Ionicons name="link-outline" size={20} color="#f87171" />
            </View>
            <View className="flex-1" style={{ gap: 4 }}>
              <Text
                className="text-textColor text-base"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t("trainer.detachTitle")}
              </Text>
              <Text
                className="text-textColor text-xs opacity-70"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {t("trainer.detachDescription")}
              </Text>
            </View>
          </View>

          <CustomButton
            text={t("trainer.detachAction")}
            onPress={onDetachPress}
            buttonStyleType={ButtonStyle.cancel}
            disabled={isDetachingTrainer}
            isLoading={isDetachingTrainer}
          />
        </View>
      ) : null}
    </View>
  );
};

export default CollaborationSection;

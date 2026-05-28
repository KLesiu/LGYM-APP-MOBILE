import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

interface CollaborationSectionProps {
  relationshipStartDate: string;
  relationshipStatus: string;
}

const CollaborationSection: React.FC<CollaborationSectionProps> = ({
  relationshipStartDate,
  relationshipStatus,
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

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
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

  return (
    <View className="bg-secondaryColor p-4 rounded-lg">
      <Text 
        className="text-primaryColor text-base mb-3"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {t("trainer.collaboration", "Collaboration")}
      </Text>
      
      <View style={{ gap: 10 }}>
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
            {relationshipStatus.charAt(0).toUpperCase() + relationshipStatus.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CollaborationSection;

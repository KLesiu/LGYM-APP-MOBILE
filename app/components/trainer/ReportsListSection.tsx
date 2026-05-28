import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import ViewLoading from "../elements/ViewLoading";

/**
 * ReportsListSection displays the history of submitted reports.
 * 
 * TODO: Integrate with actual API when available:
 * - Hook: useGetApiTraineeReports() or similar
 * - Endpoint: GET /api/trainee/reports
 */
const ReportsListSection: React.FC = () => {
  const { t } = useTranslation();

  // TODO: Replace with actual API hook
  // const { data: reports, isLoading, error, refetch } = useGetApiTraineeReports();
  
  // Mock data for development
  const isLoading = false;
  const error = null;
  const mockReports: any[] = []; // Empty for now

  if (isLoading) {
    return <ViewLoading />;
  }

  if (error) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg">
        <Text className="text-primaryColor text-base font-bold mb-2">
          {t("trainer.reportsList", "Reports History")}
        </Text>
        <Text className="text-red-500 text-center mb-2">
          {t("errors.loadFailed", "Failed to load")}
        </Text>
        <TouchableOpacity
          className="bg-primaryColor p-2 rounded-lg"
          onPress={() => {/* refetch() */}}
        >
          <Text className="text-white text-center font-bold">
            {t("common.retry", "Retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mockReports.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg">
        <Text className="text-primaryColor text-base font-bold mb-2">
          {t("trainer.reportsList", "Reports History")}
        </Text>
        <Text className="text-textColor opacity-60 text-center">
          {t("trainer.noReportsSubmitted", "No reports submitted yet")}
        </Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-green-500";
      case "pending":
      case "submitted":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
      <Text className="text-primaryColor text-base font-bold">
        {t("trainer.reportsList", "Reports History")}
      </Text>
      {mockReports.map((report: any) => (
        <View key={report._id} className="border-b border-textColor/10 pb-3">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-textColor font-bold">{report.type}</Text>
              <Text className="text-textColor opacity-60 text-xs">
                {new Date(report.submittedAt).toLocaleDateString()}
              </Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${getStatusColor(report.status)}`}>
              <Text className="text-white text-xs font-bold">{report.status}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReportsListSection;

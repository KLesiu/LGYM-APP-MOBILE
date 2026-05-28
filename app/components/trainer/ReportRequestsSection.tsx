import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import ViewLoading from "../elements/ViewLoading";

/**
 * ReportRequestsSection displays pending report requests from the trainer.
 * 
 * TODO: Integrate with actual API when available:
 * - Hook: useGetApiTraineeReportRequests() or similar
 * - Endpoint: GET /api/trainee/report-requests
 */
const ReportRequestsSection: React.FC = () => {
  const { t } = useTranslation();

  // TODO: Replace with actual API hook
  // const { data: requests, isLoading, error, refetch } = useGetApiTraineeReportRequests();
  
  // Mock data for development
  const isLoading = false;
  const error = null;
  const mockRequests: any[] = []; // Empty for now

  if (isLoading) {
    return <ViewLoading />;
  }

  if (error) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg">
        <Text className="text-primaryColor text-base font-bold mb-2">
          {t("trainer.reportRequests", "Report Requests")}
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

  if (mockRequests.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg">
        <Text className="text-primaryColor text-base font-bold mb-2">
          {t("trainer.reportRequests", "Report Requests")}
        </Text>
        <Text className="text-textColor opacity-60 text-center">
          {t("trainer.noReportRequests", "No pending report requests")}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
      <Text className="text-primaryColor text-base font-bold">
        {t("trainer.reportRequests", "Report Requests")}
      </Text>
      {mockRequests.map((request: any) => (
        <View key={request._id} className="border-b border-textColor/10 pb-3">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-textColor font-bold">{request.type}</Text>
              <Text className="text-textColor opacity-60 text-xs">
                {t("trainer.dueDate", "Due")}: {new Date(request.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {/* Handle submit */}}
              className="bg-primaryColor px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-sm font-bold">
                {t("trainer.submit", "Submit")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReportRequestsSection;

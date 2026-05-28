import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import ViewLoading from "../elements/ViewLoading";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useGetApiTrainerTraineesTraineeIdReportSubmissions } from "../../../api/generated/trainer-reporting/trainer-reporting";

const ReportsListSection: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const traineeId = user?._id || "";
  const {
    data: submissionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetApiTrainerTraineesTraineeIdReportSubmissions(traineeId);

  const submissions = useMemo(() => submissionsResponse?.data ?? [], [
    submissionsResponse?.data,
  ]);

  const formatDate = (isoString: string | undefined | null): string => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleDateString();
    } catch (formatError) {
      return "";
    }
  };

  const getStatusLabel = (requestStatus?: string | null): string => {
    if (!requestStatus) return t("trainer.statusUnknown", "Unknown");
    switch (requestStatus) {
      case "Submitted":
        return t("trainer.statusSubmitted", "Submitted");
      case "Pending":
        return t("trainer.statusPending", "Pending");
      case "Cancelled":
        return t("trainer.statusCancelled", "Cancelled");
      case "Expired":
        return t("trainer.statusExpired", "Expired");
      default:
        return requestStatus;
    }
  };

  const getStatusColor = (requestStatus?: string | null): string => {
    switch (requestStatus) {
      case "Submitted":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Cancelled":
        return "bg-red-500";
      case "Expired":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!traineeId) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.reportsList", "Reports List")}
        </Text>
        <Text className="text-textColor opacity-60 text-center">
          {t("trainer.noReportsSubmitted", "No reports submitted yet")}
        </Text>
      </View>
    );
  }

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
          {t("trainer.reportsList", "Reports List")}
        </Text>
        <View style={{ gap: 8 }}>
          <Text className="text-red-500 text-center">
            {t("trainer.reportsListError", "Failed to load reports")}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-primaryColor p-3 rounded-lg"
          >
            <Text
              className="text-white text-center"
              style={{ fontFamily: "OpenSans_600SemiBold" }}
            >
              {t("common.retry", "Retry")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (submissions.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.reportsList", "Reports List")}
        </Text>
        <Text className="text-textColor opacity-60 text-center">
          {t("trainer.noReportsSubmitted", "No reports submitted yet")}
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
        {t("trainer.reportsList", "Reports List")}
      </Text>

      {submissions.map((submission, index) => (
        <View
          key={submission._id ?? submission.reportRequestId ?? `submission-${index}`}
          className="border-b border-textColor/10 pb-3"
          style={{ gap: 8 }}
        >
          <View className="flex-row justify-between items-center" style={{ gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                className="text-textColor text-base"
                style={{ fontFamily: "OpenSans_600SemiBold" }}
              >
                {submission.request?.template?.name ||
                  t("trainer.reportSubmission", "Report submission")}
              </Text>
              {submission.submittedAt && (
                <Text className="text-textColor opacity-60 text-xs">
                  {t("trainer.submittedOn", "Submitted on")}:
                  {" "}
                  {formatDate(submission.submittedAt)}
                </Text>
              )}
            </View>
            <View
              className={`px-3 py-1 rounded-full ${getStatusColor(
                submission.request?.status
              )}`}
            >
              <Text
                className="text-white text-xs"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {getStatusLabel(submission.request?.status)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReportsListSection;

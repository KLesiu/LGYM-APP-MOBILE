import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import ViewLoading from "../elements/ViewLoading";
import toastService from "../../services/toastService";
import { getErrorMessage } from "../../../utils/errorHandler";
import {
  useGetApiTraineeReportRequests,
  usePostApiTraineeReportRequestsRequestIdSubmit,
} from "../../../api/generated/trainee-reporting/trainee-reporting";

const ReportRequestsSection: React.FC = () => {
  const { t } = useTranslation();
  const [submittingRequestId, setSubmittingRequestId] = useState<string | null>(
    null
  );
  const {
    data: requestsResponse,
    isLoading,
    error,
    refetch,
  } = useGetApiTraineeReportRequests();
  const { mutateAsync: submitReport } =
    usePostApiTraineeReportRequestsRequestIdSubmit();

  const formatDate = (isoString: string | undefined | null): string => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleDateString();
    } catch (formatError) {
      return "";
    }
  };

  const pendingRequests = useMemo(() => {
    const requests = requestsResponse?.data ?? [];
    return requests.filter((request) => request.status === "Pending");
  }, [requestsResponse?.data]);

  const handleSubmitReport = async (requestId: string) => {
    setSubmittingRequestId(requestId);
    try {
      await submitReport({
        requestId,
        data: {
          answers: {},
        },
      });
      toastService.showSuccess(
        t("trainer.reportSubmitted", "Report submitted")
      );
      await refetch();
    } catch (submitError) {
      const errorMessage = getErrorMessage(
        submitError,
        t("trainer.submitReportFailed", "Unable to submit report")
      );
      toastService.showError(errorMessage);
    } finally {
      setSubmittingRequestId(null);
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
          {t("trainer.reportRequests", "Report Requests")}
        </Text>
        <View style={{ gap: 8 }}>
          <Text className="text-red-500 text-center">
            {t("trainer.reportRequestsError", "Failed to load report requests")}
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

  if (pendingRequests.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
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
      <Text
        className="text-primaryColor text-base"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {t("trainer.reportRequests", "Report Requests")}
      </Text>

      {pendingRequests.map((request, index) => (
        <View
          key={request._id ?? request.templateId ?? `request-${index}`}
          className="border-b border-textColor/10 pb-3"
          style={{ gap: 8 }}
        >
          <View className="flex-row justify-between items-center" style={{ gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                className="text-textColor text-base"
                style={{ fontFamily: "OpenSans_600SemiBold" }}
              >
                {request.template?.name ||
                  t("trainer.reportRequest", "Report request")}
              </Text>
              {request.dueAt && (
                <Text className="text-textColor opacity-60 text-xs">
                  {t("trainer.dueDate", "Due date")}:
                  {" "}
                  {formatDate(request.dueAt)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => request._id && handleSubmitReport(request._id)}
              disabled={!request._id || submittingRequestId === request._id}
              className={`px-4 py-2 rounded-lg ${
                submittingRequestId === request._id
                  ? "bg-primaryColor/60"
                  : "bg-primaryColor"
              }`}
            >
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {submittingRequestId === request._id
                  ? t("trainer.submitting", "Submitting...")
                  : t("trainer.submit", "Submit")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReportRequestsSection;

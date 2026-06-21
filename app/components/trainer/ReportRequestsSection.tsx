import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import ViewLoading from "../elements/ViewLoading";
import toastService from "../../services/toastService";
import { getErrorMessage } from "../../../utils/errorHandler";
import type {
  ReportRequestDto,
  SubmitReportRequestRequestAnswers,
} from "../../../api/generated/model";
import {
  getGetApiMeasurementsIdGetHistoryQueryKey,
  getGetApiMeasurementsIdListQueryKey,
  getGetApiMeasurementsIdTrendQueryKey,
  getGetApiMeasurementsIdTrendsQueryKey,
} from "../../../api/generated/measurements/measurements";
import {
  getGetApiTraineeReportSubmissionsQueryKey,
  useGetApiTraineeReportRequests,
  usePostApiTraineeReportRequestsRequestIdSubmit,
} from "../../../api/generated/trainee-reporting/trainee-reporting";
import ReportRequestFormModal from "./ReportRequestFormModal";
import { useNotifications } from "../../contexts/NotificationContext";
import { getReportRequestIdFromRedirectUrl } from "../../types/notification";
import { useHomeContext } from "../home/HomeContext";

const ReportRequestsSection: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { userId } = useHomeContext();
  const { activeNotification, clearActiveNotification } = useNotifications();
  const [submittingRequestId, setSubmittingRequestId] = useState<string | null>(
    null
  );
  const [selectedRequest, setSelectedRequest] = useState<ReportRequestDto | null>(null);
  const {
    data: requestsResponse,
    isLoading,
    error,
    refetch,
  } = useGetApiTraineeReportRequests({
    query: {
      refetchOnMount: "always",
    },
  });
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

  const visibleRequests = useMemo(() => {
    const requests = requestsResponse?.data ?? [];
    return requests.filter(
      (request) => request.status === "Pending" || request.status === "Expired"
    );
  }, [requestsResponse?.data]);

  const activeReportRequestId = useMemo(
    () => getReportRequestIdFromRedirectUrl(activeNotification?.redirectUrl),
    [activeNotification?.redirectUrl]
  );

  React.useEffect(() => {
    if (activeNotification?.type !== "ReportRequestReceived" || !activeReportRequestId) {
      return;
    }

    if (selectedRequest?._id === activeReportRequestId) {
      return;
    }

    const matchingRequest = visibleRequests.find(
      (request) => request._id === activeReportRequestId
    );

    if (!matchingRequest) {
      return;
    }

    setSelectedRequest(matchingRequest);
    clearActiveNotification();
  }, [
    activeNotification?.type,
    activeReportRequestId,
    clearActiveNotification,
    visibleRequests,
    selectedRequest?._id,
  ]);

  const handleSubmitReport = async (
    requestId: string,
    answers: SubmitReportRequestRequestAnswers
  ) => {
    setSubmittingRequestId(requestId);
    try {
      await submitReport({
        requestId,
        data: {
          answers,
        },
      });
      toastService.showSuccess(
        t(
          "trainer.reportSubmittedWithMeasurements",
          "Raport wysłany. Pomiary zapisano w historii."
        )
      );
      setSelectedRequest(null);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getGetApiTraineeReportSubmissionsQueryKey(),
        }),
        ...(userId
          ? [
              queryClient.invalidateQueries({
                queryKey: getGetApiMeasurementsIdListQueryKey(userId),
              }),
              queryClient.invalidateQueries({
                queryKey: getGetApiMeasurementsIdGetHistoryQueryKey(userId),
              }),
              queryClient.invalidateQueries({
                queryKey: getGetApiMeasurementsIdTrendQueryKey(userId),
              }),
              queryClient.invalidateQueries({
                queryKey: getGetApiMeasurementsIdTrendsQueryKey(userId),
              }),
            ]
          : []),
      ]);
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

  const openRequestForm = (request: ReportRequestDto) => {
    setSelectedRequest(request);
  };

  const closeRequestForm = () => {
    if (submittingRequestId) {
      return;
    }

    setSelectedRequest(null);
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

  if (visibleRequests.length === 0) {
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
    <>
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.reportRequests", "Report Requests")}
        </Text>

        {visibleRequests.map((request, index) => {
          const validFieldCount = (request.template?.fields ?? []).filter(
            (field) => Boolean(field?.key)
          ).length;
          const noteText = request.note?.trim() || t("trainer.noReportRequestNote", "No note");
          const dueDateLabel = request.dueAt
            ? `${t("trainer.dueDateShort", "Due:")} ${formatDate(request.dueAt)}`
            : t("trainer.noDueDate", "No due date");

          return (
            <View
              key={request._id ?? request.templateId ?? `request-${index}`}
              className="border-b border-textColor/10 pb-2"
              style={{ gap: 6 }}
            >
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={() => openRequestForm(request)}
                  disabled={!request._id || submittingRequestId === request._id}
                  activeOpacity={0.8}
                  style={{ flex: 1, gap: 6 }}
                >
                  <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
                    <Text
                      className="text-textColor text-sm flex-1"
                      numberOfLines={1}
                      style={{ fontFamily: "OpenSans_600SemiBold" }}
                    >
                      {request.template?.name ||
                        t("trainer.reportRequest", "Report request")}
                    </Text>
                    <Text
                      className="text-textColor opacity-60 text-xs"
                      numberOfLines={1}
                      style={{ fontFamily: "OpenSans_400Regular" }}
                    >
                      {dueDateLabel}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
                    <Text
                      className="text-textColor opacity-70 text-xs flex-1"
                      numberOfLines={1}
                      style={{ fontFamily: "OpenSans_400Regular" }}
                    >
                      {noteText}
                    </Text>
                    <Text
                      className="text-textColor opacity-60 text-xs"
                      style={{ fontFamily: "OpenSans_600SemiBold" }}
                    >
                      {t("trainer.reportFieldsCount", {
                        count: validFieldCount,
                        defaultValue: "{{count}} fields",
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => openRequestForm(request)}
                  disabled={!request._id || submittingRequestId === request._id}
                  className={`px-4 py-2 rounded-lg ${
                    submittingRequestId === request._id
                      ? "bg-primaryColor/60"
                      : "bg-primaryColor"
                  }`}
                >
                  <Text
                    className="text-black text-sm"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    {submittingRequestId === request._id
                      ? t("trainer.submitting", "Submitting...")
                      : t("trainer.fillReport", "Fill report")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      <ReportRequestFormModal
        visible={Boolean(selectedRequest)}
        request={selectedRequest}
        isSubmitting={Boolean(
          selectedRequest?._id && submittingRequestId === selectedRequest._id
        )}
        onClose={closeRequestForm}
        onSubmit={async (answers) => {
          if (!selectedRequest?._id) {
            return;
          }

          await handleSubmitReport(selectedRequest._id, answers);
        }}
      />
    </>
  );
};

export default ReportRequestsSection;

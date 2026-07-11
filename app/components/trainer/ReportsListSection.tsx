import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import ViewLoading from "../elements/ViewLoading";
import { useGetApiTraineeReportSubmissions } from "../../../api/generated/trainee-reporting/trainee-reporting";
import type { ReportSubmissionDto, ResponseMessageDto } from "../../../api/generated/model";
import ReportSubmissionPreviewModal from "./ReportSubmissionPreviewModal";
import { useNotifications } from "../../contexts/NotificationContext";
import { getReportSubmissionIdFromRedirectUrl } from "../../types/notification";
import { markReportSubmissionFeedbackRead, type ReportSubmissionFeedbackStateDto } from "../../services/reporting/reportingFeedback";

const ReportsListSection: React.FC = () => {
  const { t } = useTranslation();
  const { activeNotification, clearActiveNotification } = useNotifications();
  const [selectedSubmission, setSelectedSubmission] = useState<ReportSubmissionDto | null>(null);
  const markedSubmissionIdsRef = useRef<Set<string>>(new Set());
  const {
    data: submissionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetApiTraineeReportSubmissions({
    query: {
      refetchOnMount: "always",
    },
  });

  const submissions = useMemo<ReportSubmissionDto[]>(() => {
    const responseData = submissionsResponse?.data as
      | ReportSubmissionDto[]
      | ResponseMessageDto
      | undefined;

    return Array.isArray(responseData) ? responseData : [];
  }, [submissionsResponse?.data]);

  const hasTrainerFeedback = useCallback((submission: ReportSubmissionDto | null | undefined) => {
    if (!submission) {
      return false;
    }

    return Boolean(
      submission.trainerOverallComment ||
        (submission.trainerFieldComments && Object.keys(submission.trainerFieldComments).length > 0)
    );
  }, []);

  const openSubmission = useCallback(
    async (submission: ReportSubmissionDto) => {
      setSelectedSubmission(submission);

      const submissionWithState = submission as ReportSubmissionFeedbackStateDto;
      const submissionId = submission._id;
      if (
        !submissionId ||
        !hasTrainerFeedback(submission) ||
        submissionWithState.trainerFeedbackReadAt ||
        markedSubmissionIdsRef.current.has(submissionId)
      ) {
        return;
      }

      markedSubmissionIdsRef.current.add(submissionId);

      try {
        const response = await markReportSubmissionFeedbackRead(submissionId);
        const updatedSubmission = response.data as ReportSubmissionFeedbackStateDto;

        if (response.status === 200 && updatedSubmission && typeof updatedSubmission === "object") {
          setSelectedSubmission((current) =>
            current?._id === submissionId
              ? {
                  ...current,
                  ...(updatedSubmission as ReportSubmissionDto),
                }
              : current
          );
          await refetch();
          return;
        }

        markedSubmissionIdsRef.current.delete(submissionId);
      } catch {
        markedSubmissionIdsRef.current.delete(submissionId);
      }
    },
    [hasTrainerFeedback, refetch]
  );

  const extractSubmissions = (responseData: unknown): ReportSubmissionDto[] => {
    if (
      typeof responseData !== "object" ||
      responseData === null ||
      !("data" in responseData)
    ) {
      return [];
    }

    const payload = (responseData as { data?: unknown }).data;

    if (!payload || typeof payload !== "object" || !("data" in payload)) {
      return [];
    }

    const submissionsPayload = (payload as { data?: unknown }).data;
    return Array.isArray(submissionsPayload) ? submissionsPayload : [];
  };

  const activeSubmissionId = useMemo(
    () => getReportSubmissionIdFromRedirectUrl(activeNotification?.redirectUrl),
    [activeNotification?.redirectUrl]
  );

  React.useEffect(() => {
    if (activeNotification?.type !== "ReportFeedbackReceived" || !activeSubmissionId) {
      return;
    }

    if (selectedSubmission?._id === activeSubmissionId) {
      return;
    }

    let isCancelled = false;

    const openSubmissionFromFreshData = async () => {
      const currentMatch = submissions.find(
        (submission) => submission._id === activeSubmissionId
      );

      if (currentMatch && hasTrainerFeedback(currentMatch)) {
        if (!isCancelled) {
          await openSubmission(currentMatch);
          clearActiveNotification();
        }
        return;
      }

      const refreshedResponse = await refetch();
      const refreshedSubmissions = extractSubmissions(refreshedResponse);
      const refreshedMatch = refreshedSubmissions.find(
        (submission) => submission._id === activeSubmissionId
      );

      if (!refreshedMatch || isCancelled) {
        if (!isCancelled) {
          clearActiveNotification();
          Toast.show({
            type: "error",
            text1: t("notifications.openTargetUnavailableTitle", "Notification unavailable"),
            text2: t(
              "notifications.openTargetUnavailableDescription",
              "The related content is no longer available."
            ),
          });
        }
        return;
      }

        await openSubmission(refreshedMatch);
        clearActiveNotification();
      };

    void openSubmissionFromFreshData();

    return () => {
      isCancelled = true;
    };
  }, [
    activeNotification?.type,
    activeSubmissionId,
    clearActiveNotification,
    refetch,
    selectedSubmission?._id,
    submissions,
    hasTrainerFeedback,
    openSubmission,
  ]);

  const formatDate = (isoString: string | undefined | null): string => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleDateString();
    } catch (formatError) {
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
    <>
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
              <View style={{ alignItems: "flex-end", gap: 8 }}>
                <TouchableOpacity
                  onPress={() => {
                    void openSubmission(submission);
                  }}
                  className="bg-primaryColor px-4 py-2 rounded-lg"
                >
                  <Text
                    className="text-black text-sm"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    {t("trainer.viewReportAnswers", "View answers")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <ReportSubmissionPreviewModal
        visible={Boolean(selectedSubmission)}
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </>
  );
};

export default ReportsListSection;

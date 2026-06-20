import React, { useMemo } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import type { ReportSubmissionDto, ReportTemplateFieldDto } from "../../../api/generated/model";
import CustomButton, { ButtonStyle } from "../elements/CustomButton";

type ModularReportTemplateFieldDto = Omit<ReportTemplateFieldDto, "type"> & {
  type?: string | null;
  moduleConfig?: unknown | null;
};

interface ReportSubmissionPreviewModalProps {
  visible: boolean;
  submission: ReportSubmissionDto | null;
  onClose: () => void;
}

interface AnswerItem {
  key: string;
  label: string;
  value: string;
  kind: "text" | "measurements" | "photos";
  measurementRows: Array<{ label: string; value: string }>;
  photos: Array<{
    id: string;
    viewType: string;
    thumbnailUrl?: string | null;
    readUrl?: string | null;
    uploadedAt?: string;
  }>;
}

interface AnswerValueLabels {
  yes: string;
  no: string;
  noAnswer: string;
}

const formatAnswerValue = (value: unknown, labels: AnswerValueLabels) => {
  if (typeof value === "boolean") {
    return value ? labels.yes : labels.no;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "string") {
    return value.trim() || labels.noAnswer;
  }

  if (value === null || typeof value === "undefined") {
    return labels.noAnswer;
  }

  return JSON.stringify(value);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getHumanizedKey = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

const ReportSubmissionPreviewModal: React.FC<ReportSubmissionPreviewModalProps> = ({
  visible,
  submission,
  onClose,
}) => {
  const { t } = useTranslation();
  const answerLabels = useMemo<AnswerValueLabels>(
    () => ({
      yes: t("trainer.answerYes", "Yes"),
      no: t("trainer.answerNo", "No"),
      noAnswer: t("trainer.noAnswerValue", "No answer"),
    }),
    [t]
  );

  const answerItems = useMemo<AnswerItem[]>(() => {
    const answers = submission?.answers ?? {};
    const answerEntries = Object.entries(answers);
    const templateFields = [...(submission?.request?.template?.fields ?? [])]
      .filter((field) => Boolean(field?.key))
      .map(
        (field): ModularReportTemplateFieldDto => ({
          ...field,
          type: typeof field.type === "string" ? field.type : undefined,
          moduleConfig: Reflect.get(field, "moduleConfig") as unknown,
        })
      )
      .sort((firstField, secondField) => (firstField.order ?? 0) - (secondField.order ?? 0));

    const getFieldKind = (fieldType: string | null | undefined): AnswerItem["kind"] => {
      if (fieldType === "Measurements") {
        return "measurements";
      }

      if (fieldType === "Photos") {
        return "photos";
      }

      return "text";
    };

    const getMeasurementRows = (
      field: ModularReportTemplateFieldDto | undefined,
      value: unknown
    ): Array<{ label: string; value: string }> => {
      if (!isRecord(value)) {
        return [];
      }

      const configuredTypes =
        field && isRecord(field.moduleConfig) && Array.isArray(field.moduleConfig.measurementTypes)
          ? field.moduleConfig.measurementTypes.filter(
              (item): item is string => typeof item === "string" && item.trim().length > 0
            )
          : [];

      const sourceEntries = Object.entries(value);
      const orderedEntries = configuredTypes.length
        ? configuredTypes
            .map(
              (configuredType) =>
                sourceEntries.find(([key]) => key.toLowerCase() === configuredType.toLowerCase()) ?? null
            )
            .filter((entry): entry is [string, unknown] => entry !== null)
        : sourceEntries;

      return orderedEntries.map(([key, rawValue]) => {
        if (isRecord(rawValue)) {
          const numericValue = rawValue.value;
          const unit = typeof rawValue.unit === "string" ? rawValue.unit : null;
          const formattedValue = formatAnswerValue(numericValue, answerLabels);

          return {
            label: getHumanizedKey(key),
            value: unit ? `${formattedValue} ${unit}` : formattedValue,
          };
        }

        return {
          label: getHumanizedKey(key),
          value: formatAnswerValue(rawValue, answerLabels),
        };
      });
    };

    const getPhotos = (value: unknown): AnswerItem["photos"] => {
      if (!Array.isArray(value)) {
        return [];
      }

      return value
        .filter((item): item is Record<string, unknown> => isRecord(item))
        .map((photo, index) => ({
          id:
            typeof photo._id === "string"
              ? photo._id
              : typeof photo.photoId === "string"
                ? photo.photoId
                : `${index}`,
          viewType: typeof photo.viewType === "string" ? photo.viewType : t("common.photo", "Photo"),
          thumbnailUrl: typeof photo.thumbnailUrl === "string" ? photo.thumbnailUrl : null,
          readUrl: typeof photo.readUrl === "string" ? photo.readUrl : null,
          uploadedAt: typeof photo.uploadedAt === "string" ? photo.uploadedAt : undefined,
        }));
    };

    const usedKeys = new Set<string>();
    const orderedItems = templateFields.map((field) => {
      const fieldKey = field.key as string;
      usedKeys.add(fieldKey);

      const kind = getFieldKind(field.type);
      const measurementRows = kind === "measurements" ? getMeasurementRows(field, answers[fieldKey]) : [];
      const photos = kind === "photos" ? getPhotos(answers[fieldKey]) : [];

      return {
        key: fieldKey,
        label: field.label || fieldKey,
        value: formatAnswerValue(answers[fieldKey], answerLabels),
        kind,
        measurementRows,
        photos,
      };
    });

    const extraItems = answerEntries
      .filter(([key]) => !usedKeys.has(key))
      .map(([key, value]) => ({
        key,
        label: key,
        value: formatAnswerValue(value, answerLabels),
        kind: "text" as const,
        measurementRows: [],
        photos: [],
      }));

    return [...orderedItems, ...extraItems];
  }, [answerLabels, submission?.answers, submission?.request?.template?.fields]);

  const formatDate = (isoString?: string) => {
    if (!isoString) {
      return t("trainer.noSubmissionDate", "No date");
    }

    try {
      return new Date(isoString).toLocaleDateString();
    } catch {
      return t("trainer.noSubmissionDate", "No date");
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 justify-center bg-black/75 px-4"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          className="w-full rounded-3xl border border-white/10 bg-[#141414]"
          style={{ elevation: 16, maxHeight: "90%" }}
        >
          <View className="px-5 pb-4 pt-5" style={{ gap: 16, flexShrink: 1 }}>
            <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text
                  className="text-primaryColor text-xs uppercase"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {t("trainer.reportsTab")}
                </Text>
                <Text
                  className="text-textColor text-2xl"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {submission?.request?.template?.name ||
                    t("trainer.reportSubmission", "Report submission")}
                </Text>
                <Text
                  className="text-textColor opacity-60 text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {t("trainer.submittedOn", "Submitted on")}: {formatDate(submission?.submittedAt)}
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                hitSlop={12}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
              >
                <Text
                  className="text-textColor text-lg"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  ×
                </Text>
              </Pressable>
            </View>

            <ScrollView
              style={{ flexShrink: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingBottom: 4 }}
            >
              {answerItems.length === 0 ? (
                <View className="rounded-2xl bg-[#1B1B1B] px-4 py-5">
                  <Text
                    className="text-textColor text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("trainer.noSubmittedAnswers", "No submitted answers")}
                  </Text>
                </View>
              ) : (
                answerItems.map((item) => (
                  <View
                    key={item.key}
                    className="rounded-2xl bg-[#1B1B1B] px-4 py-4"
                    style={{ gap: 8 }}
                  >
                    <Text
                      className="text-textColor text-sm"
                      style={{ fontFamily: "OpenSans_700Bold" }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      className="text-textColor opacity-85 text-sm"
                      style={{ fontFamily: "OpenSans_400Regular" }}
                    >
                      {item.kind === "text" ? item.value : ""}
                    </Text>

                    {item.kind === "measurements" && item.measurementRows.length > 0 ? (
                      <View style={{ gap: 8 }}>
                        {item.measurementRows.map((row) => (
                          <View
                            key={`${item.key}-${row.label}`}
                            className="flex-row items-center justify-between rounded-xl bg-[#202020] px-3 py-3"
                            style={{ gap: 12 }}
                          >
                            <Text
                              className="text-textColor opacity-70 text-sm flex-1"
                              style={{ fontFamily: "OpenSans_400Regular" }}
                            >
                              {row.label}
                            </Text>
                            <Text
                              className="text-textColor text-sm"
                              style={{ fontFamily: "OpenSans_700Bold" }}
                            >
                              {row.value}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    {item.kind === "photos" && item.photos.length > 0 ? (
                      <View style={{ gap: 10 }}>
                        {item.photos.map((photo) => (
                          <View
                            key={`${item.key}-${photo.id}`}
                            className="overflow-hidden rounded-xl bg-[#202020]"
                            style={{ gap: 8 }}
                          >
                            {photo.thumbnailUrl || photo.readUrl ? (
                              <Image
                                source={{ uri: photo.thumbnailUrl || photo.readUrl || undefined }}
                                style={{ width: "100%", height: 180 }}
                                resizeMode="cover"
                              />
                            ) : null}
                            <View className="px-3 py-3" style={{ gap: 4 }}>
                              <Text
                                className="text-textColor text-sm"
                                style={{ fontFamily: "OpenSans_700Bold" }}
                              >
                                {photo.viewType}
                              </Text>
                              {photo.uploadedAt ? (
                                <Text
                                  className="text-textColor opacity-60 text-xs"
                                  style={{ fontFamily: "OpenSans_400Regular" }}
                                >
                                  {formatDate(photo.uploadedAt)}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    {item.kind !== "text" && item.measurementRows.length === 0 && item.photos.length === 0 ? (
                      <Text
                        className="text-textColor opacity-85 text-sm"
                        style={{ fontFamily: "OpenSans_400Regular" }}
                      >
                        {item.value}
                      </Text>
                    ) : null}

                    {submission?.trainerFieldComments?.[item.key] ? (
                      <View
                        className="rounded-xl border border-white/10 bg-[#202020] px-3 py-3"
                        style={{ gap: 4 }}
                      >
                        <Text
                          className="text-primaryColor text-xs uppercase"
                          style={{ fontFamily: "OpenSans_700Bold" }}
                        >
                          {t("trainer.trainerFeedbackLabel", "Trainer feedback")}
                        </Text>
                        <Text
                          className="text-textColor text-sm"
                          style={{ fontFamily: "OpenSans_400Regular" }}
                        >
                          {submission.trainerFieldComments[item.key]}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))
              )}

              {submission?.trainerOverallComment ? (
                <View className="rounded-2xl bg-[#1B1B1B] px-4 py-4" style={{ gap: 8 }}>
                  <Text
                    className="text-primaryColor text-sm uppercase"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    {t("trainer.trainerOverallFeedback", "Trainer overall feedback")}
                  </Text>
                  <Text
                    className="text-textColor opacity-85 text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {submission.trainerOverallComment}
                  </Text>
                </View>
              ) : null}
            </ScrollView>

            <CustomButton
              onPress={onClose}
              text={t("common.close", "Close")}
              buttonStyleType={ButtonStyle.success}
              width="w-full"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportSubmissionPreviewModal;

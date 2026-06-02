import React, { useMemo } from "react";
import {
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

interface ReportSubmissionPreviewModalProps {
  visible: boolean;
  submission: ReportSubmissionDto | null;
  onClose: () => void;
}

interface AnswerItem {
  key: string;
  label: string;
  value: string;
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
      .filter((field): field is ReportTemplateFieldDto => Boolean(field?.key))
      .sort((firstField, secondField) => (firstField.order ?? 0) - (secondField.order ?? 0));

    const usedKeys = new Set<string>();
    const orderedItems = templateFields.map((field) => {
      const fieldKey = field.key as string;
      usedKeys.add(fieldKey);

      return {
        key: fieldKey,
        label: field.label || fieldKey,
        value: formatAnswerValue(answers[fieldKey], answerLabels),
      };
    });

    const extraItems = answerEntries
      .filter(([key]) => !usedKeys.has(key))
      .map(([key, value]) => ({
        key,
        label: key,
        value: formatAnswerValue(value, answerLabels),
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
                      {item.value}
                    </Text>
                  </View>
                ))
              )}
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

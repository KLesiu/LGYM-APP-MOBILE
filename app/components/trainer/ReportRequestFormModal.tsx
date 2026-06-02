import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import type {
  ReportRequestDto,
  ReportTemplateFieldDto,
  SubmitReportRequestRequestAnswers,
} from "../../../api/generated/model";
import CustomButton, { ButtonStyle } from "../elements/CustomButton";
import Checkbox from "../elements/Checkbox";

type FormValue = string | boolean | null;
type FormState = Record<string, FormValue>;

interface ReportRequestFormModalProps {
  visible: boolean;
  request: ReportRequestDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (answers: SubmitReportRequestRequestAnswers) => Promise<void>;
}

const buildInitialValues = (fields: ReportTemplateFieldDto[]): FormState => {
  return fields.reduce<FormState>((accumulator, field) => {
    if (!field.key) {
      return accumulator;
    }

    accumulator[field.key] = field.type === "Boolean" ? null : "";
    return accumulator;
  }, {});
};

const resolveFieldType = (field: ReportTemplateFieldDto) => field.type ?? "Text";

const isValidDateValue = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.toISOString().slice(0, 10) === value;
};

const ReportRequestFormModal: React.FC<ReportRequestFormModalProps> = ({
  visible,
  request,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState<FormState>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fields = useMemo(() => {
    return [...(request?.template?.fields ?? [])]
      .filter((field): field is ReportTemplateFieldDto => Boolean(field?.key))
      .sort((firstField, secondField) => (firstField.order ?? 0) - (secondField.order ?? 0));
  }, [request?.template?.fields]);

  useEffect(() => {
    if (!visible) {
      setValidationErrors({});
      return;
    }

    setValues(buildInitialValues(fields));
    setValidationErrors({});
  }, [fields, visible]);

  const setFieldValue = (fieldKey: string, value: FormValue) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldKey]: value,
    }));

    setValidationErrors((currentErrors) => {
      if (!currentErrors[fieldKey]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldKey];
      return nextErrors;
    });
  };

  const getStringValue = (fieldKey: string): string => {
    const value = values[fieldKey];
    return typeof value === "string" ? value : "";
  };

  const validateAndBuildAnswers = (): SubmitReportRequestRequestAnswers | null => {
    const nextErrors: Record<string, string> = {};
    const answers: NonNullable<SubmitReportRequestRequestAnswers> = {};

    fields.forEach((field) => {
      const fieldKey = field.key;
      if (!fieldKey) {
        return;
      }

      const rawValue = values[fieldKey];

      const fieldType = resolveFieldType(field);

      if (fieldType === "Boolean") {
        const boolValue = typeof rawValue === "boolean" ? rawValue : null;
        if (field.isRequired && boolValue === null) {
          nextErrors[fieldKey] = t("trainer.requiredBooleanField");
          return;
        }

        if (boolValue !== null) {
          answers[fieldKey] = boolValue;
        }
        return;
      }

      const stringValue = typeof rawValue === "string" ? rawValue.trim() : "";

      if (field.isRequired && !stringValue) {
        nextErrors[fieldKey] = t("common.fieldRequired");
        return;
      }

      if (!stringValue) {
        return;
      }

      if (fieldType === "Number") {
        const numericValue = Number(stringValue.replace(",", "."));

        if (Number.isNaN(numericValue)) {
          nextErrors[fieldKey] = t("trainer.invalidNumberValue");
          return;
        }

        answers[fieldKey] = numericValue;
        return;
      }

      if (fieldType === "Date") {
        if (!isValidDateValue(stringValue)) {
          nextErrors[fieldKey] = t("trainer.invalidDateValue");
          return;
        }

        answers[fieldKey] = stringValue;
        return;
      }

      answers[fieldKey] = stringValue;
    });

    setValidationErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    return answers;
  };

  const handleSubmit = async () => {
    const answers = validateAndBuildAnswers();

    if (!answers) {
      return;
    }

    await onSubmit(answers);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
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
                  {t("trainer.requestsTab")}
                </Text>
                <Text
                  className="text-textColor text-2xl"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {request?.template?.name || t("trainer.fillReport")}
                </Text>
                {request?.note ? (
                  <Text
                    className="text-textColor opacity-60 text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("trainer.reportRequestNote")}: {request.note}
                  </Text>
                ) : null}
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
              {fields.length === 0 ? (
                <View className="rounded-2xl bg-[#1B1B1B] px-4 py-5">
                  <Text
                    className="text-textColor text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("trainer.noReportFields")}
                  </Text>
                </View>
              ) : (
                fields.map((field) => {
                  const fieldKey = field.key;
                  if (!fieldKey) {
                    return null;
                  }

                  const fieldLabel = field.label || fieldKey;
                  const validationError = validationErrors[fieldKey];

                  return (
                    <View
                      key={fieldKey}
                      className="rounded-2xl bg-[#1B1B1B] px-4 py-4"
                      style={{ gap: 10 }}
                    >
                      <View className="flex-row flex-wrap items-center" style={{ gap: 6 }}>
                        <Text
                          className="text-textColor text-base"
                          style={{ fontFamily: "OpenSans_700Bold" }}
                        >
                          {fieldLabel}
                        </Text>
                        {field.isRequired ? (
                          <Text className="text-red-500">*</Text>
                        ) : null}
                      </View>

                      {resolveFieldType(field) === "Boolean" ? (
                        <Pressable
                          onPress={() =>
                            setFieldValue(
                              fieldKey,
                              values[fieldKey] === true ? false : true
                            )
                          }
                          className="flex-row items-center rounded-xl border border-white/10 bg-[#202020] px-4 py-3"
                          style={{ gap: 12 }}
                        >
                          <Checkbox value={values[fieldKey] === true} />
                          <Text
                            className="text-textColor flex-1"
                            style={{ fontFamily: "OpenSans_400Regular" }}
                          >
                            {t("trainer.booleanFieldLabel")}
                          </Text>
                        </Pressable>
                      ) : (
                        <TextInput
                          value={getStringValue(fieldKey)}
                          onChangeText={(text) => setFieldValue(fieldKey, text)}
                          keyboardType={resolveFieldType(field) === "Number" ? "numeric" : "default"}
                          placeholder={
                            resolveFieldType(field) === "Date"
                              ? t("trainer.dateFieldPlaceholder")
                              : t("trainer.answerPlaceholder")
                          }
                          placeholderTextColor="#7a7a7a"
                          multiline={resolveFieldType(field) === "Text"}
                          numberOfLines={resolveFieldType(field) === "Text" ? 4 : 1}
                          textAlignVertical={resolveFieldType(field) === "Text" ? "top" : "center"}
                          style={{
                            fontFamily: "OpenSans_400Regular",
                            backgroundColor: "#202020",
                            borderRadius: 12,
                            minHeight: resolveFieldType(field) === "Text" ? 110 : 52,
                          }}
                          className="px-4 py-3 text-textColor"
                        />
                      )}

                      {validationError ? (
                        <Text
                          className="text-red-500 text-xs"
                          style={{ fontFamily: "OpenSans_400Regular" }}
                        >
                          {validationError}
                        </Text>
                      ) : null}
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View className="flex-row" style={{ gap: 12 }}>
              <CustomButton
                onPress={onClose}
                text={t("common.cancel")}
                buttonStyleType={ButtonStyle.outlineBlack}
                width="flex-1"
              />
              <CustomButton
                onPress={handleSubmit}
                text={t("trainer.submitReport")}
                buttonStyleType={ButtonStyle.success}
                width="flex-1"
                disabled={fields.length === 0}
                isLoading={isSubmitting}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportRequestFormModal;

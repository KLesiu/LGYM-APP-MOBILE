import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import Dialog from "../../elements/Dialog";
import CustomDropdown from "../../elements/Dropdown";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { useHomeContext } from "../HomeContext";
import { DropdownItem } from "../../../../interfaces/Dropdown";
import toastService from "../../../services/toastService";
import { getErrorMessage } from "../../../../utils/errorHandler";
import {
  getGetApiMeasurementsIdGetHistoryQueryKey,
  getGetApiMeasurementsIdListQueryKey,
  getGetApiMeasurementsIdTrendQueryKey,
  getGetApiMeasurementsIdTrendsQueryKey,
  usePostApiMeasurementsAddBulk,
} from "../../../../api/generated/measurements/measurements";
import {
  MeasurementFormDtoBodyPart,
  MeasurementFormDtoUnit,
  type MeasurementFormDto,
  type MeasurementsBulkFormDto,
} from "../../../../api/generated/model";

type UnitOption = {
  value: MeasurementFormDtoUnit;
  labelKey: string;
};

type MeasurementFieldConfig = {
  key: MeasurementFormDtoBodyPart;
  labelKey: string;
  defaultUnit: MeasurementFormDtoUnit;
  unitOptions: UnitOption[];
};

const LENGTH_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
  { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
  { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
];

const WEIGHT_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Kilograms, labelKey: "measurements.units.Kilograms" },
  { value: MeasurementFormDtoUnit.Pounds, labelKey: "measurements.units.Pounds" },
];

const PERCENT_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Percent, labelKey: "measurements.units.Percent" },
];

const BMI_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Bmi, labelKey: "measurements.units.Bmi" },
];

const FIELD_CONFIGS: MeasurementFieldConfig[] = [
  {
    key: MeasurementFormDtoBodyPart.BodyWeight,
    labelKey: "measurements.bodyParts.BodyWeight",
    defaultUnit: MeasurementFormDtoUnit.Kilograms,
    unitOptions: WEIGHT_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Neck,
    labelKey: "measurements.bodyParts.Neck",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Chest,
    labelKey: "measurements.bodyParts.Chest",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Waist,
    labelKey: "measurements.bodyParts.Waist",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Abs,
    labelKey: "measurements.bodyParts.Abs",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Hips,
    labelKey: "measurements.bodyParts.Hips",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Thigh,
    labelKey: "measurements.bodyParts.Thigh",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Calves,
    labelKey: "measurements.bodyParts.Calves",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Biceps,
    labelKey: "measurements.bodyParts.Biceps",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.BodyFat,
    labelKey: "measurements.bodyParts.BodyFat",
    defaultUnit: MeasurementFormDtoUnit.Percent,
    unitOptions: PERCENT_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Bmi,
    labelKey: "measurements.bodyParts.Bmi",
    defaultUnit: MeasurementFormDtoUnit.Bmi,
    unitOptions: BMI_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Shoulders,
    labelKey: "measurements.bodyParts.Shoulders",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
];

type FormState = Record<MeasurementFormDtoBodyPart, { value: string; unit: MeasurementFormDtoUnit }>;

const MEASUREMENTS_QUICK_FILL_STORAGE_KEY = "measurements.quickFill.lastSnapshot";

const createInitialState = (): FormState =>
  FIELD_CONFIGS.reduce((accumulator, field) => {
    accumulator[field.key] = {
      value: "",
      unit: field.defaultUnit,
    };
    return accumulator;
  }, {} as FormState);

const sanitizeStoredState = (rawValue: string | null): FormState | null => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<FormState>;
    const baseState = createInitialState();

    for (const field of FIELD_CONFIGS) {
      const storedField = parsedValue[field.key];
      if (!storedField) {
        continue;
      }

      const matchingUnit = field.unitOptions.some((option) => option.value === storedField.unit)
        ? storedField.unit
        : field.defaultUnit;

      baseState[field.key] = {
        value: typeof storedField.value === "string" ? storedField.value : "",
        unit: matchingUnit,
      };
    }

    return baseState;
  } catch {
    return null;
  }
};

interface MeasurementsPopUpProps {
  offPopUp: () => void;
}

const MeasurementsPopUp: React.FC<MeasurementsPopUpProps> = ({ offPopUp }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { userId, toggleMenuButton, hideMenu } = useHomeContext();
  const [formState, setFormState] = useState<FormState>(() => createInitialState());
  const [savedQuickFillState, setSavedQuickFillState] = useState<FormState | null>(null);

  const { mutateAsync: addMeasurementsBulkMutation, isPending } = usePostApiMeasurementsAddBulk();

  useEffect(() => {
    toggleMenuButton(true);
    hideMenu();

    return () => {
      toggleMenuButton(false);
    };
  }, [hideMenu, toggleMenuButton]);

  useEffect(() => {
    const loadQuickFill = async () => {
      const storedSnapshot = await AsyncStorage.getItem(MEASUREMENTS_QUICK_FILL_STORAGE_KEY);
      const parsedSnapshot = sanitizeStoredState(storedSnapshot);
      if (parsedSnapshot) {
        setSavedQuickFillState(parsedSnapshot);
      }
    };

    void loadQuickFill();
  }, []);

  const unitDropdownOptions = useMemo<Record<MeasurementFormDtoBodyPart, DropdownItem[]>>(
    () =>
      FIELD_CONFIGS.reduce((accumulator, field) => {
        accumulator[field.key] = field.unitOptions.map((option) => ({
          label: t(option.labelKey),
          value: option.value,
        }));
        return accumulator;
      }, {} as Record<MeasurementFormDtoBodyPart, DropdownItem[]>),
    [t]
  );

  const updateFieldValue = (fieldKey: MeasurementFormDtoBodyPart, input: string) => {
    if (!input) {
      setFormState((current) => ({
        ...current,
        [fieldKey]: { ...current[fieldKey], value: "" },
      }));
      return;
    }

    const normalizedInput = input.replace(/,/g, ".");
    if (/^\d*(\.\d*)?$/.test(normalizedInput)) {
      setFormState((current) => ({
        ...current,
        [fieldKey]: { ...current[fieldKey], value: input },
      }));
    }
  };

  const updateFieldUnit = (fieldKey: MeasurementFormDtoBodyPart, unit: MeasurementFormDtoUnit) => {
    setFormState((current) => ({
      ...current,
      [fieldKey]: { ...current[fieldKey], unit },
    }));
  };

  const buildPayload = (): MeasurementsBulkFormDto | null => {
    const measurements: MeasurementFormDto[] = [];

    for (const field of FIELD_CONFIGS) {
      const normalizedValue = formState[field.key].value.replace(/,/g, ".").trim();
      if (!normalizedValue) {
        continue;
      }

      const parsedValue = Number.parseFloat(normalizedValue);
      if (Number.isNaN(parsedValue) || parsedValue <= 0) {
        toastService.showValidationError(
          t("measurements.validation.invalidSpecificValue", {
            field: t(field.labelKey),
          })
        );
        return null;
      }

      measurements.push({
        bodyPart: field.key,
        unit: formState[field.key].unit,
        value: parsedValue,
        createdAt: new Date().toISOString(),
      });
    }

    if (!measurements.length) {
      toastService.showValidationError(t("measurements.validation.atLeastOneMeasurementRequired"));
      return null;
    }

    return { measurements };
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    try {
      const response = await addMeasurementsBulkMutation({ data: payload });

      if (response.status !== 200) {
        toastService.showError(t("common.tryAgain"), t("common.error"));
        return;
      }

      if (userId) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getGetApiMeasurementsIdListQueryKey(userId) }),
          queryClient.invalidateQueries({ queryKey: getGetApiMeasurementsIdGetHistoryQueryKey(userId) }),
          queryClient.invalidateQueries({ queryKey: getGetApiMeasurementsIdTrendQueryKey(userId) }),
          queryClient.invalidateQueries({ queryKey: getGetApiMeasurementsIdTrendsQueryKey(userId) }),
        ]);
      }

      await AsyncStorage.setItem(MEASUREMENTS_QUICK_FILL_STORAGE_KEY, JSON.stringify(formState));
      setSavedQuickFillState(formState);

      toastService.showSuccess(t("measurements.createSuccess"));
      offPopUp();
    } catch (error) {
      const errorMessage = getErrorMessage(error, t("common.tryAgain"));
      toastService.showError(errorMessage, t("common.error"));
    }
  };

  const applyQuickFill = () => {
    if (!savedQuickFillState) {
      return;
    }

    setFormState(savedQuickFillState);
  };

  const clearQuickFill = async () => {
    await AsyncStorage.removeItem(MEASUREMENTS_QUICK_FILL_STORAGE_KEY);
    setSavedQuickFillState(null);
  };

  return (
    <Dialog>
      <View className="w-full h-full px-5 py-6" style={{ gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Text className="text-3xl text-textColor" style={{ fontFamily: "OpenSans_700Bold" }}>
            {t("measurements.addTitle")}
          </Text>
          <Text className="text-base text-fifthColor" style={{ fontFamily: "OpenSans_400Regular" }}>
            {t("measurements.bulkAddDescription")}
          </Text>
        </View>

        {savedQuickFillState && (
          <View className="bg-cardColor rounded-2xl p-4" style={{ gap: 12 }}>
            <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
              {t("measurements.quickFill.title")}
            </Text>
            <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
              {t("measurements.quickFill.description")}
            </Text>
            <View className="flex-row justify-between" style={{ gap: 12 }}>
              <CustomButton
                text={t("measurements.quickFill.useLast")}
                onPress={applyQuickFill}
                buttonStyleType={ButtonStyle.success}
                width="flex-1"
              />
              <CustomButton
                text={t("measurements.quickFill.clear")}
                onPress={() => {
                  void clearQuickFill();
                }}
                buttonStyleType={ButtonStyle.cancel}
                width="flex-1"
              />
            </View>
          </View>
        )}

        <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 12 }}>
          {FIELD_CONFIGS.map((field) => {
            const selectedUnit = formState[field.key].unit;

            return (
              <View key={field.key} className="bg-cardColor rounded-2xl p-4" style={{ gap: 10 }}>
                <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                  {t(field.labelKey)}
                </Text>

                <CustomDropdown
                  value={selectedUnit}
                  data={unitDropdownOptions[field.key]}
                  onSelect={(item) => {
                    if (!item) {
                      return;
                    }

                    updateFieldUnit(field.key, item.value as MeasurementFormDtoUnit);
                  }}
                />

                <TextInput
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className="w-full px-3 py-4 bg-secondaryColor rounded-lg text-textColor"
                  value={formState[field.key].value}
                  onChangeText={(text) => updateFieldValue(field.key, text)}
                  keyboardType="decimal-pad"
                  placeholder={t("measurements.valuePlaceholder", {
                    unit: t(
                      field.unitOptions.find((option) => option.value === selectedUnit)?.labelKey ||
                        field.unitOptions[0].labelKey
                    ),
                  })}
                  placeholderTextColor="gray"
                />
              </View>
            );
          })}
        </ScrollView>

        <View className="flex-row justify-between" style={{ gap: 16 }}>
          <CustomButton
            text={t("common.cancel")}
            onPress={offPopUp}
            buttonStyleType={ButtonStyle.cancel}
            width="flex-1"
            disabled={isPending}
          />
          <CustomButton
            text={t("measurements.saveAllCta")}
            onPress={handleSubmit}
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
            isLoading={isPending}
          />
        </View>
      </View>
    </Dialog>
  );
};

export default MeasurementsPopUp;

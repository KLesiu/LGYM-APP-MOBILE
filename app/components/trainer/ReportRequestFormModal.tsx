import React, { useEffect, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Image,
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
  MeasurementFormDtoBodyPart,
  MeasurementFormDtoUnit,
  MeasurementResponseDto,
  ReportRequestDto,
  ReportTemplateFieldDto,
  SubmitReportRequestRequestAnswers,
} from "../../../api/generated/model";
import {
  MeasurementFormDtoBodyPart as MeasurementBodyPart,
  MeasurementFormDtoUnit as MeasurementUnit,
} from "../../../api/generated/model";
import { useGetApiMeasurementsIdList } from "../../../api/generated/measurements/measurements";
import { useHomeContext } from "../home/HomeContext";
import CustomButton, { ButtonStyle } from "../elements/CustomButton";
import Checkbox from "../elements/Checkbox";
import CustomDropdown from "../elements/Dropdown";
import toastService from "../../services/toastService";
import {
  completeTraineeReportingPhotoUpload,
  getTraineeReportingPhotoHistory,
  initiateTraineeReportingPhotoUpload,
  type ReportingPhotoHistoryItem,
  uploadPhotoToSignedUrl,
} from "../../services/reporting/reportingPhotos";

type ReportFieldType =
  | "Text"
  | "Number"
  | "Boolean"
  | "Date"
  | "Measurements"
  | "Photos"
  | (string & {});

type ModularReportTemplateFieldDto = Omit<ReportTemplateFieldDto, "type"> & {
  type?: ReportFieldType | null;
  moduleConfig?: unknown | null;
};

type PrimitiveFormValue = string | boolean | null;
type MeasurementDraftEntry = { value: string; unit: MeasurementFormDtoUnit };
type MeasurementDraftValue = Record<string, MeasurementDraftEntry>;
type PhotoDraftValue = ReportingPhotoHistoryItem[];
type FormValue = PrimitiveFormValue | MeasurementDraftValue | PhotoDraftValue;
type FormState = Record<string, FormValue>;

type DropdownOption = {
  label: string;
  value: string;
};

const LENGTH_UNITS: MeasurementFormDtoUnit[] = [
  MeasurementUnit.Centimeters,
  MeasurementUnit.Meters,
  MeasurementUnit.Millimeters,
];

const WEIGHT_UNITS: MeasurementFormDtoUnit[] = [MeasurementUnit.Kilograms, MeasurementUnit.Pounds];

const PERCENT_UNITS: MeasurementFormDtoUnit[] = [MeasurementUnit.Percent];

const BMI_UNITS: MeasurementFormDtoUnit[] = [MeasurementUnit.Bmi];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isMeasurementBodyPart = (value: string): value is MeasurementFormDtoBodyPart => {
  return Object.values(MeasurementBodyPart).includes(value as MeasurementFormDtoBodyPart);
};

const isMeasurementUnit = (value: string): value is MeasurementFormDtoUnit => {
  return Object.values(MeasurementUnit).includes(value as MeasurementFormDtoUnit);
};

const getMeasurementUnitOptions = (type: MeasurementFormDtoBodyPart): MeasurementFormDtoUnit[] => {
  switch (type) {
    case MeasurementBodyPart.BodyWeight:
      return WEIGHT_UNITS;
    case MeasurementBodyPart.BodyFat:
      return PERCENT_UNITS;
    case MeasurementBodyPart.Bmi:
      return BMI_UNITS;
    default:
      return LENGTH_UNITS;
  }
};

const getDefaultMeasurementUnit = (type: MeasurementFormDtoBodyPart): MeasurementFormDtoUnit => {
  return getMeasurementUnitOptions(type)[0];
};

const resolveFieldType = (field: ModularReportTemplateFieldDto): ReportFieldType => field.type ?? "Text";

const getMeasurementTypes = (field: ModularReportTemplateFieldDto): MeasurementFormDtoBodyPart[] => {
  if (!isRecord(field.moduleConfig) || !Array.isArray(field.moduleConfig.measurementTypes)) {
    return [];
  }

  return field.moduleConfig.measurementTypes.filter(
    (item): item is MeasurementFormDtoBodyPart =>
      typeof item === "string" && isMeasurementBodyPart(item)
  );
};

const getRequiredPhotoViews = (field: ModularReportTemplateFieldDto): string[] => {
  if (!isRecord(field.moduleConfig) || !Array.isArray(field.moduleConfig.requiredViews)) {
    return [];
  }

  return field.moduleConfig.requiredViews.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
};

const createMeasurementDraft = (
  measurementTypes: MeasurementFormDtoBodyPart[]
): MeasurementDraftValue => {
  return measurementTypes.reduce<MeasurementDraftValue>((accumulator, type) => {
    accumulator[type] = {
      value: "",
      unit: getDefaultMeasurementUnit(type),
    };
    return accumulator;
  }, {});
};

interface ReportRequestFormModalProps {
  visible: boolean;
  request: ReportRequestDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (answers: SubmitReportRequestRequestAnswers) => Promise<void>;
}

const buildInitialValues = (fields: ModularReportTemplateFieldDto[]): FormState => {
  return fields.reduce<FormState>((accumulator, field) => {
    if (!field.key) {
      return accumulator;
    }

    const fieldType = resolveFieldType(field);

    if (fieldType === "Boolean") {
      accumulator[field.key] = null;
      return accumulator;
    }

    if (fieldType === "Measurements") {
      accumulator[field.key] = createMeasurementDraft(getMeasurementTypes(field));
      return accumulator;
    }

    if (fieldType === "Photos") {
      accumulator[field.key] = [];
      return accumulator;
    }

    accumulator[field.key] = "";
    return accumulator;
  }, {});
};

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
  const { userId } = useHomeContext();
  const [values, setValues] = useState<FormState>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [uploadingPhotoKeys, setUploadingPhotoKeys] = useState<Record<string, boolean>>({});

  const fields = useMemo(() => {
    return [...(request?.template?.fields ?? [])]
      .filter((field) => Boolean(field?.key))
      .map(
        (field): ModularReportTemplateFieldDto => ({
          ...field,
          type: typeof field.type === "string" ? field.type : undefined,
          moduleConfig: Reflect.get(field, "moduleConfig") as unknown,
        })
      )
      .sort((firstField, secondField) => (firstField.order ?? 0) - (secondField.order ?? 0));
  }, [request?.template?.fields]);

  const hasMeasurementsField = useMemo(
    () => fields.some((field) => resolveFieldType(field) === "Measurements"),
    [fields]
  );

  const { data: latestMeasurementsResponse } = useGetApiMeasurementsIdList(userId, undefined, {
    query: {
      enabled: visible && hasMeasurementsField && Boolean(userId),
      refetchOnMount: "always",
    },
  });

  const latestMeasurementsByType = useMemo(() => {
    const measurements =
      latestMeasurementsResponse?.status === 200 &&
      Array.isArray(latestMeasurementsResponse.data?.measurements)
        ? latestMeasurementsResponse.data.measurements
        : [];

    return measurements.reduce<Record<string, MeasurementResponseDto>>((accumulator, measurement) => {
      const bodyPartName = measurement.bodyPart?.name;
      if (typeof bodyPartName !== "string" || bodyPartName.trim().length === 0) {
        return accumulator;
      }

      if (!accumulator[bodyPartName]) {
        accumulator[bodyPartName] = measurement;
      }

      return accumulator;
    }, {});
  }, [latestMeasurementsResponse]);

  useEffect(() => {
    if (!visible) {
      setValidationErrors({});
      setUploadingPhotoKeys({});
      return;
    }

    setValues(buildInitialValues(fields));
    setValidationErrors({});
    setUploadingPhotoKeys({});
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

  const getMeasurementValue = (
    fieldKey: string,
    measurementTypes: MeasurementFormDtoBodyPart[]
  ): MeasurementDraftValue => {
    const rawValue = values[fieldKey];

    if (isRecord(rawValue)) {
      return measurementTypes.reduce<MeasurementDraftValue>((accumulator, type) => {
        const entry = rawValue[type];
        accumulator[type] = isRecord(entry)
          ? {
              value: typeof entry.value === "string" ? entry.value : "",
              unit:
                typeof entry.unit === "string" && isMeasurementUnit(entry.unit)
                  ? entry.unit
                  : getDefaultMeasurementUnit(type),
            }
          : {
              value: "",
              unit: getDefaultMeasurementUnit(type),
            };
        return accumulator;
      }, {});
    }

    return createMeasurementDraft(measurementTypes);
  };

  const getPhotoValue = (fieldKey: string): PhotoDraftValue => {
    const rawValue = values[fieldKey];
    if (!Array.isArray(rawValue)) {
      return [];
    }

    return rawValue.filter((item): item is ReportingPhotoHistoryItem => isRecord(item));
  };

  const getPhotoViewLabel = (viewType: string) => {
    const normalized = viewType.toLowerCase();
    const translationKey = `trainer.photoView.${normalized}`;
    const translated = t(translationKey);

    return translated !== translationKey ? translated : viewType;
  };

  const getMeasurementLabel = (type: MeasurementFormDtoBodyPart) => {
    const translationKey = `measurements.bodyParts.${type}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : type;
  };

  const getMeasurementUnitLabel = (unit: MeasurementFormDtoUnit) => {
    const translationKey = `measurements.units.${unit}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : unit;
  };

  const updateMeasurementField = (
    fieldKey: string,
    measurementType: MeasurementFormDtoBodyPart,
    patch: Partial<MeasurementDraftEntry>
  ) => {
    const nextMeasurementState = {
      ...getMeasurementValue(fieldKey, [measurementType]),
      [measurementType]: {
        ...getMeasurementValue(fieldKey, [measurementType])[measurementType],
        ...patch,
      },
    };

    const currentFullState = values[fieldKey];
    const currentState = isRecord(currentFullState) ? currentFullState : {};

    setFieldValue(fieldKey, {
      ...currentState,
      ...nextMeasurementState,
    });
  };

  const fillLatestMeasurements = (fieldKey: string, field: ModularReportTemplateFieldDto) => {
    const measurementTypes = getMeasurementTypes(field);
    const currentState = getMeasurementValue(fieldKey, measurementTypes);
    let hasAnyLatestValue = false;

    const nextState = measurementTypes.reduce<MeasurementDraftValue>((accumulator, type) => {
      const latestMeasurement = latestMeasurementsByType[type];

      if (!latestMeasurement || typeof latestMeasurement.value !== "number") {
        accumulator[type] = currentState[type];
        return accumulator;
      }

      hasAnyLatestValue = true;
      accumulator[type] = {
        value: latestMeasurement.value.toString(),
        unit:
          typeof latestMeasurement.unit?.name === "string" &&
          isMeasurementUnit(latestMeasurement.unit.name)
            ? latestMeasurement.unit.name
            : currentState[type]?.unit ?? getDefaultMeasurementUnit(type),
      };

      return accumulator;
    }, {});

    if (!hasAnyLatestValue) {
      toastService.showError(
        t("trainer.noLatestMeasurements", "Nie masz jeszcze zapisanych pomiarów do wczytania")
      );
      return;
    }

    setFieldValue(fieldKey, nextState);
  };

  const setPhotoUploadingState = (fieldKey: string, viewType: string, isUploading: boolean) => {
    const uploadKey = `${fieldKey}:${viewType}`;

    setUploadingPhotoKeys((currentState) => {
      if (!isUploading) {
        const nextState = { ...currentState };
        delete nextState[uploadKey];
        return nextState;
      }

      return {
        ...currentState,
        [uploadKey]: true,
      };
    });
  };

  const isPhotoUploading = (fieldKey: string, viewType: string) => {
    return Boolean(uploadingPhotoKeys[`${fieldKey}:${viewType}`]);
  };

  const replacePhotoForView = (
    fieldKey: string,
    viewType: string,
    nextPhoto: ReportingPhotoHistoryItem
  ) => {
    const existingPhotos = getPhotoValue(fieldKey);
    const filteredPhotos = existingPhotos.filter(
      (photo) => (photo.viewType ?? "").toLowerCase() !== viewType.toLowerCase()
    );

    setFieldValue(fieldKey, [...filteredPhotos, nextPhoto]);
  };

  const removePhotoForView = (fieldKey: string, viewType: string) => {
    const existingPhotos = getPhotoValue(fieldKey);
    setFieldValue(
      fieldKey,
      existingPhotos.filter(
        (photo) => (photo.viewType ?? "").toLowerCase() !== viewType.toLowerCase()
      )
    );
  };

  const handlePhotoSelection = async (fieldKey: string, viewType: string) => {
    if (!request?._id) {
      toastService.showError(t("common.tryAgain"));
      return;
    }

    setPhotoUploadingState(fieldKey, viewType, true);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        toastService.showError(
          t(
            "trainer.photoPermissionDenied",
            "Aplikacja potrzebuje dostępu do zdjęć, aby dodać fotografię do raportu"
          )
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.85,
      });

      if (pickerResult.canceled || !pickerResult.assets.length) {
        return;
      }

      const selectedAsset = pickerResult.assets[0];
      const mimeType = selectedAsset.mimeType || "image/jpeg";
      const initialSize = typeof selectedAsset.fileSize === "number" ? selectedAsset.fileSize : 0;

      const uploadInitResponse = await initiateTraineeReportingPhotoUpload({
        reportRequestId: request._id,
        viewType,
        mimeType,
        sizeBytes: initialSize,
      });

      if (
        uploadInitResponse.status !== 200 ||
        !uploadInitResponse.data?.uploadUrl ||
        !uploadInitResponse.data?.storageKey
      ) {
        throw new Error("Unable to initialize photo upload");
      }

      const uploadedSize = await uploadPhotoToSignedUrl(
        uploadInitResponse.data.uploadUrl,
        selectedAsset.uri,
        mimeType
      );

      const completeResponse = await completeTraineeReportingPhotoUpload({
        storageKey: uploadInitResponse.data.storageKey,
        mimeType,
        sizeBytes: uploadedSize,
        reportRequestId: request._id,
        viewType,
      });

      if (completeResponse.status !== 200) {
        throw new Error("Unable to complete photo upload");
      }

      const historyResponse = await getTraineeReportingPhotoHistory(request._id);
      const uploadedPhotoFromHistory =
        historyResponse.status === 200 && Array.isArray(historyResponse.data?.photos)
          ? historyResponse.data.photos.find(
              (photo) =>
                photo._id === completeResponse.data?.photoId ||
                (photo.storageKey ?? "") === uploadInitResponse.data?.storageKey
            )
          : undefined;

      replacePhotoForView(fieldKey, viewType, {
        _id: completeResponse.data?.photoId ?? uploadedPhotoFromHistory?._id ?? null,
        storageKey:
          uploadedPhotoFromHistory?.storageKey ?? uploadInitResponse.data.storageKey ?? null,
        viewType,
        sizeBytes: uploadedPhotoFromHistory?.sizeBytes ?? uploadedSize,
        thumbnailUrl: uploadedPhotoFromHistory?.thumbnailUrl ?? null,
        readUrl: uploadedPhotoFromHistory?.readUrl ?? null,
        reportRequestId: request._id,
        uploadedAt: completeResponse.data?.uploadedAt ?? uploadedPhotoFromHistory?.uploadedAt,
      });
    } catch (error) {
      toastService.showError(
        t("trainer.photoUploadFailed", "Nie udało się dodać zdjęcia do raportu")
      );
    } finally {
      setPhotoUploadingState(fieldKey, viewType, false);
    }
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

      if (fieldType === "Measurements") {
        const measurementTypes = getMeasurementTypes(field);
        const measurementDraft = getMeasurementValue(fieldKey, measurementTypes);
        const builtMeasurements: Record<string, { value: number; unit: MeasurementFormDtoUnit }> = {};
        const missingRequiredMeasurements: string[] = [];

        measurementTypes.forEach((measurementType) => {
          const currentEntry = measurementDraft[measurementType];
          const normalizedValue = currentEntry?.value.replace(/,/g, ".").trim() ?? "";

          if (!normalizedValue) {
            if (field.isRequired) {
              missingRequiredMeasurements.push(getMeasurementLabel(measurementType));
            }
            return;
          }

          const parsedValue = Number(normalizedValue);
          if (Number.isNaN(parsedValue) || parsedValue <= 0) {
            nextErrors[fieldKey] = t(
              "trainer.invalidMeasurementValue",
              "Wpisz poprawne wartości pomiarów"
            );
            return;
          }

          builtMeasurements[measurementType] = {
            value: parsedValue,
            unit: currentEntry.unit,
          };
        });

        if (!nextErrors[fieldKey] && missingRequiredMeasurements.length > 0) {
          nextErrors[fieldKey] = t(
            "trainer.measurementModuleRequired",
            "Uzupełnij wszystkie wymagane pomiary"
          );
          return;
        }

        if (Object.keys(builtMeasurements).length > 0) {
          answers[fieldKey] = builtMeasurements;
        }

        return;
      }

      if (fieldType === "Photos") {
        const requiredViews = getRequiredPhotoViews(field);
        const selectedPhotos = getPhotoValue(fieldKey);

        if (field.isRequired) {
          if (requiredViews.length > 0) {
            const selectedViewSet = new Set(
              selectedPhotos.map((photo) => (photo.viewType ?? "").toLowerCase())
            );
            const missingViews = requiredViews.filter(
              (viewType) => !selectedViewSet.has(viewType.toLowerCase())
            );

            if (missingViews.length > 0) {
              nextErrors[fieldKey] = t(
                "trainer.photoModuleRequired",
                "Dodaj wszystkie wymagane zdjęcia"
              );
              return;
            }
          } else if (selectedPhotos.length === 0) {
            nextErrors[fieldKey] = t(
              "trainer.photoModuleRequired",
              "Dodaj wszystkie wymagane zdjęcia"
            );
            return;
          }
        }

        if (selectedPhotos.length > 0) {
          answers[fieldKey] = selectedPhotos.map((photo) => ({
            _id: photo._id ?? null,
            photoId: photo._id ?? null,
            storageKey: photo.storageKey ?? null,
            viewType: photo.viewType ?? null,
            sizeBytes: photo.sizeBytes,
            thumbnailUrl: photo.thumbnailUrl ?? null,
            readUrl: photo.readUrl ?? null,
            reportRequestId: photo.reportRequestId ?? request?._id ?? null,
            uploadedAt: photo.uploadedAt,
          }));
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

  const renderMeasurementField = (
    field: ModularReportTemplateFieldDto,
    fieldKey: string
  ) => {
    const measurementTypes = getMeasurementTypes(field);
    const measurementValue = getMeasurementValue(fieldKey, measurementTypes);
    const hasAnyLatestMeasurement = measurementTypes.some((type) => Boolean(latestMeasurementsByType[type]));

    return (
      <View style={{ gap: 12 }}>
        <Text
          className="text-textColor opacity-70 text-sm"
          style={{ fontFamily: "OpenSans_400Regular" }}
        >
          {t(
            "trainer.measurementsModuleDescription",
            "Wpisz aktualne pomiary albo wczytaj ostatnio zapisane wartości"
          )}
        </Text>

        <CustomButton
          onPress={() => fillLatestMeasurements(fieldKey, field)}
          text={t("trainer.loadLatestMeasurements", "Wczytaj ostatnie pomiary")}
          buttonStyleType={ButtonStyle.outlineBlack}
          width="w-full"
          disabled={!hasAnyLatestMeasurement}
        />

        {measurementTypes.map((measurementType) => {
          const currentEntry = measurementValue[measurementType];
          const latestMeasurement = latestMeasurementsByType[measurementType];
          const dropdownOptions: DropdownOption[] = getMeasurementUnitOptions(measurementType).map(
            (unitOption) => ({
              label: getMeasurementUnitLabel(unitOption),
              value: unitOption,
            })
          );

          return (
            <View
              key={`${fieldKey}-${measurementType}`}
              className="rounded-2xl border border-white/10 bg-[#202020] px-3 py-3"
              style={{ gap: 10 }}
            >
              <Text
                className="text-textColor text-sm"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {getMeasurementLabel(measurementType)}
              </Text>

              <CustomDropdown
                value={currentEntry.unit}
                data={dropdownOptions}
                onSelect={(item) => {
                  if (!item || !isMeasurementUnit(item.value)) {
                    return;
                  }

                  updateMeasurementField(fieldKey, measurementType, { unit: item.value });
                }}
              />

              <TextInput
                value={currentEntry.value}
                onChangeText={(text) => {
                  const normalizedText = text.replace(/,/g, ".");
                  if (!normalizedText || /^\d*(\.\d*)?$/.test(normalizedText)) {
                    updateMeasurementField(fieldKey, measurementType, { value: text });
                  }
                }}
                keyboardType="decimal-pad"
                placeholder={t("trainer.measurementValuePlaceholder", "Wpisz wartość")}
                placeholderTextColor="#7a7a7a"
                style={{
                  fontFamily: "OpenSans_400Regular",
                  backgroundColor: "#141414",
                  borderRadius: 12,
                  minHeight: 52,
                }}
                className="px-4 py-3 text-textColor"
              />

              {latestMeasurement && typeof latestMeasurement.value === "number" ? (
                <Text
                  className="text-textColor opacity-60 text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {t("trainer.latestMeasurementLabel", "Ostatni zapis")}: {latestMeasurement.value}{" "}
                  {getMeasurementUnitLabel(
                    typeof latestMeasurement.unit?.name === "string" &&
                      isMeasurementUnit(latestMeasurement.unit.name)
                      ? latestMeasurement.unit.name
                      : getDefaultMeasurementUnit(measurementType)
                  )}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  };

  const renderPhotosField = (field: ModularReportTemplateFieldDto, fieldKey: string) => {
    const requiredViews = getRequiredPhotoViews(field);
    const photoSlots = requiredViews.length > 0 ? requiredViews : ["General"];
    const selectedPhotos = getPhotoValue(fieldKey);

    return (
      <View style={{ gap: 12 }}>
        <Text
          className="text-textColor opacity-70 text-sm"
          style={{ fontFamily: "OpenSans_400Regular" }}
        >
          {t(
            "trainer.photosModuleDescription",
            "Dodaj wymagane zdjęcia z galerii telefonu"
          )}
        </Text>

        {photoSlots.map((viewType) => {
          const selectedPhoto = selectedPhotos.find(
            (photo) => (photo.viewType ?? "").toLowerCase() === viewType.toLowerCase()
          );
          const uploadInProgress = isPhotoUploading(fieldKey, viewType);

          return (
            <View
              key={`${fieldKey}-${viewType}`}
              className="rounded-2xl border border-white/10 bg-[#202020] px-3 py-3"
              style={{ gap: 10 }}
            >
              <Text
                className="text-textColor text-sm"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {getPhotoViewLabel(viewType)}
              </Text>

              {selectedPhoto?.thumbnailUrl || selectedPhoto?.readUrl ? (
                <Image
                  source={{ uri: selectedPhoto.thumbnailUrl || selectedPhoto.readUrl || undefined }}
                  style={{ width: "100%", height: 180, borderRadius: 14 }}
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center rounded-2xl bg-[#141414] py-10">
                  <Text
                    className="text-textColor opacity-55 text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("trainer.noSelectedPhoto", "Nie dodano jeszcze zdjęcia")}
                  </Text>
                </View>
              )}

              <View className="flex-row" style={{ gap: 10 }}>
                <CustomButton
                  onPress={() => {
                    void handlePhotoSelection(fieldKey, viewType);
                  }}
                  text={
                    uploadInProgress
                      ? t("trainer.uploadingPhoto", "Wysyłanie zdjęcia...")
                      : selectedPhoto
                        ? t("trainer.replacePhoto", "Zmień zdjęcie")
                        : t("trainer.addPhoto", "Dodaj zdjęcie")
                  }
                  buttonStyleType={ButtonStyle.success}
                  width="flex-1"
                  disabled={uploadInProgress || isSubmitting}
                />

                {selectedPhoto ? (
                  <CustomButton
                    onPress={() => removePhotoForView(fieldKey, viewType)}
                    text={t("trainer.removePhoto", "Usuń")}
                    buttonStyleType={ButtonStyle.cancel}
                    width="flex-1"
                    disabled={uploadInProgress || isSubmitting}
                  />
                ) : null}
              </View>

              {uploadInProgress ? <ActivityIndicator color="#22c55e" /> : null}
            </View>
          );
        })}
      </View>
    );
  };

  const renderFieldControl = (field: ModularReportTemplateFieldDto, fieldKey: string) => {
    const fieldType = resolveFieldType(field);

    if (fieldType === "Boolean") {
      return (
        <Pressable
          onPress={() => setFieldValue(fieldKey, values[fieldKey] === true ? false : true)}
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
      );
    }

    if (fieldType === "Measurements") {
      return renderMeasurementField(field, fieldKey);
    }

    if (fieldType === "Photos") {
      return renderPhotosField(field, fieldKey);
    }

    return (
      <TextInput
        value={getStringValue(fieldKey)}
        onChangeText={(text) => setFieldValue(fieldKey, text)}
        keyboardType={fieldType === "Number" ? "numeric" : "default"}
        placeholder={
          fieldType === "Date" ? t("trainer.dateFieldPlaceholder") : t("trainer.answerPlaceholder")
        }
        placeholderTextColor="#7a7a7a"
        multiline={fieldType === "Text"}
        numberOfLines={fieldType === "Text" ? 4 : 1}
        textAlignVertical={fieldType === "Text" ? "top" : "center"}
        style={{
          fontFamily: "OpenSans_400Regular",
          backgroundColor: "#202020",
          borderRadius: 12,
          minHeight: fieldType === "Text" ? 110 : 52,
        }}
        className="px-4 py-3 text-textColor"
      />
    );
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

                      {renderFieldControl(field, fieldKey)}

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

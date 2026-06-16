import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import CustomDropdown from "../../elements/Dropdown";
import CustomButton, { ButtonSize, ButtonStyle } from "../../elements/CustomButton";
import ViewLoading from "../../elements/ViewLoading";
import { FontWeights } from "../../../../enums/FontsProperties";
import { useHomeContext } from "../HomeContext";
import MeasurementsPopUp from "./MeasurementsPopUp";
import { DropdownItem } from "../../../../interfaces/Dropdown";
import {
  useGetApiMeasurementsIdGetHistory,
  useGetApiMeasurementsIdList,
  useGetApiMeasurementsIdTrend,
  useGetApiMeasurementsIdTrends,
} from "../../../../api/generated/measurements/measurements";
import {
  MeasurementFormDtoBodyPart,
  MeasurementFormDtoUnit,
  type MeasurementResponseDto,
  type MeasurementTrendDto,
} from "../../../../api/generated/model";

type BodyPartFilter = MeasurementFormDtoBodyPart | "ALL";

type MeasurementTypeOption = {
  value: BodyPartFilter;
  labelKey: string;
};

type UnitOption = {
  value: MeasurementFormDtoUnit;
  labelKey: string;
};

const MEASUREMENT_TYPE_OPTIONS: MeasurementTypeOption[] = [
  { value: "ALL", labelKey: "measurements.filters.allBodyParts" },
  { value: MeasurementFormDtoBodyPart.BodyWeight, labelKey: "measurements.bodyParts.BodyWeight" },
  { value: MeasurementFormDtoBodyPart.Neck, labelKey: "measurements.bodyParts.Neck" },
  { value: MeasurementFormDtoBodyPart.Chest, labelKey: "measurements.bodyParts.Chest" },
  { value: MeasurementFormDtoBodyPart.Waist, labelKey: "measurements.bodyParts.Waist" },
  { value: MeasurementFormDtoBodyPart.Abs, labelKey: "measurements.bodyParts.Abs" },
  { value: MeasurementFormDtoBodyPart.Hips, labelKey: "measurements.bodyParts.Hips" },
  { value: MeasurementFormDtoBodyPart.Thigh, labelKey: "measurements.bodyParts.Thigh" },
  { value: MeasurementFormDtoBodyPart.Calves, labelKey: "measurements.bodyParts.Calves" },
  { value: MeasurementFormDtoBodyPart.Biceps, labelKey: "measurements.bodyParts.Biceps" },
  { value: MeasurementFormDtoBodyPart.BodyFat, labelKey: "measurements.bodyParts.BodyFat" },
  { value: MeasurementFormDtoBodyPart.Bmi, labelKey: "measurements.bodyParts.Bmi" },
  { value: MeasurementFormDtoBodyPart.Shoulders, labelKey: "measurements.bodyParts.Shoulders" },
];

const UNIT_OPTIONS_BY_TYPE: Record<Exclude<BodyPartFilter, "ALL">, UnitOption[]> = {
  [MeasurementFormDtoBodyPart.Unknown]: [],
  [MeasurementFormDtoBodyPart.BodyWeight]: [
    { value: MeasurementFormDtoUnit.Kilograms, labelKey: "measurements.units.Kilograms" },
    { value: MeasurementFormDtoUnit.Pounds, labelKey: "measurements.units.Pounds" },
  ],
  [MeasurementFormDtoBodyPart.BodyFat]: [
    { value: MeasurementFormDtoUnit.Percent, labelKey: "measurements.units.Percent" },
  ],
  [MeasurementFormDtoBodyPart.Bmi]: [
    { value: MeasurementFormDtoUnit.Bmi, labelKey: "measurements.units.Bmi" },
  ],
  [MeasurementFormDtoBodyPart.Neck]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Chest]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Waist]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Abs]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Hips]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Thigh]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Calves]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Biceps]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Shoulders]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Back]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Triceps]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Forearms]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Quads]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Hamstrings]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
  [MeasurementFormDtoBodyPart.Glutes]: [
    { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
    { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
    { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
  ],
};

const formatDate = (date: string | null | undefined, locale: string): string => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatNumber = (value: number | null | undefined, locale: string): string => {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const toDayKey = (date: string | null | undefined): string => {
  if (!date) {
    return "unknown";
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "unknown";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getSuccessfulMeasurements = (
  response:
    | { status: 200; data?: { measurements?: MeasurementResponseDto[] | null } }
    | { status?: number; data?: unknown }
    | undefined
): MeasurementResponseDto[] => {
  if (response?.status !== 200) {
    return [];
  }

  const payload = response.data as { measurements?: MeasurementResponseDto[] | null } | undefined;
  return Array.isArray(payload?.measurements) ? payload.measurements : [];
};

const getSuccessfulTrends = (
  response:
    | { status: 200; data?: { trends?: MeasurementTrendDto[] | null } }
    | { status?: number; data?: unknown }
    | undefined
): MeasurementTrendDto[] => {
  if (response?.status !== 200) {
    return [];
  }

  const payload = response.data as { trends?: MeasurementTrendDto[] | null } | undefined;
  return Array.isArray(payload?.trends) ? payload.trends : [];
};

const Measurements: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userId } = useHomeContext();
  const isFocused = useIsFocused();
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartFilter>("ALL");
  const [selectedUnit, setSelectedUnit] = useState<MeasurementFormDtoUnit>(MeasurementFormDtoUnit.Centimeters);
  const [activeTab, setActiveTab] = useState<"TREND" | "LATEST" | "HISTORY">("TREND");

  const bodyPartDropdownOptions = useMemo<DropdownItem[]>(
    () =>
      MEASUREMENT_TYPE_OPTIONS.map((option) => ({
        label: t(option.labelKey),
        value: option.value,
      })),
    [t]
  );

  const availableUnits = useMemo(() => {
    if (selectedBodyPart === "ALL") {
      return [] as UnitOption[];
    }

    return UNIT_OPTIONS_BY_TYPE[selectedBodyPart] || [];
  }, [selectedBodyPart]);

  useEffect(() => {
    if (selectedBodyPart === "ALL") {
      return;
    }

    const isCurrentUnitAllowed = availableUnits.some((option) => option.value === selectedUnit);
    if (!isCurrentUnitAllowed && availableUnits.length > 0) {
      setSelectedUnit(availableUnits[0].value);
    }
  }, [availableUnits, selectedBodyPart, selectedUnit]);

  const listParams = useMemo(
    () =>
      selectedBodyPart === "ALL"
        ? undefined
        : {
            BodyPart: selectedBodyPart,
            Unit: selectedUnit,
          },
    [selectedBodyPart, selectedUnit]
  );

  const {
    data: measurementsListData,
    isLoading: isMeasurementsListLoading,
    refetch: refetchMeasurementsList,
  } = useGetApiMeasurementsIdList(userId, listParams, {
    query: { enabled: !!userId, refetchOnMount: "always" },
  });

  const {
    data: measurementsHistoryData,
    isLoading: isMeasurementsHistoryLoading,
    refetch: refetchMeasurementsHistory,
  } = useGetApiMeasurementsIdGetHistory(userId, listParams, {
    query: { enabled: !!userId, refetchOnMount: "always" },
  });

  const {
    data: measurementTrendData,
    isLoading: isMeasurementTrendLoading,
    refetch: refetchMeasurementTrend,
  } = useGetApiMeasurementsIdTrend(
    userId,
    selectedBodyPart === "ALL"
      ? undefined
      : {
          BodyPart: selectedBodyPart,
          Unit: selectedUnit,
        },
    {
      query: {
        enabled: !!userId && selectedBodyPart !== "ALL",
        refetchOnMount: "always",
      },
    }
  );

  const {
    data: measurementTrendsData,
    isLoading: isMeasurementTrendsLoading,
    refetch: refetchMeasurementTrends,
  } = useGetApiMeasurementsIdTrends(userId, {
    query: { enabled: !!userId, refetchOnMount: "always" },
  });

  useEffect(() => {
    if (!isFocused || !userId) {
      return;
    }

    const refresh = async () => {
      await Promise.all([
        refetchMeasurementsList(),
        refetchMeasurementsHistory(),
        refetchMeasurementTrends(),
        ...(selectedBodyPart !== "ALL" ? [refetchMeasurementTrend()] : []),
      ]);
    };

    void refresh();
  }, [
    isFocused,
    refetchMeasurementTrend,
    refetchMeasurementTrends,
    refetchMeasurementsHistory,
    refetchMeasurementsList,
    selectedBodyPart,
    userId,
  ]);

  const measurementsList = useMemo(() => getSuccessfulMeasurements(measurementsListData), [measurementsListData]);
  const measurementsHistory = useMemo(() => getSuccessfulMeasurements(measurementsHistoryData), [measurementsHistoryData]);
  const trendSummaries = useMemo(() => getSuccessfulTrends(measurementTrendsData), [measurementTrendsData]);

  const selectedTrend = useMemo(() => {
    if (selectedBodyPart === "ALL" || measurementTrendData?.status !== 200) {
      return undefined;
    }

    return measurementTrendData.data;
  }, [measurementTrendData, selectedBodyPart]);

  const visibleTrendCards = useMemo(() => {
    if (selectedBodyPart === "ALL") {
      return trendSummaries;
    }

    return selectedTrend ? [selectedTrend] : [];
  }, [selectedBodyPart, selectedTrend, trendSummaries]);

  const groupedMeasurementsHistory = useMemo(() => {
    const groups = new Map<string, MeasurementResponseDto[]>();

    for (const measurement of measurementsHistory) {
      const key = toDayKey(measurement.createdAt);
      const currentGroup = groups.get(key) || [];
      currentGroup.push(measurement);
      groups.set(key, currentGroup);
    }

    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      label: key === "unknown" ? t("common.unknown") : formatDate(items[0]?.createdAt, i18n.language),
      items,
    }));
  }, [i18n.language, measurementsHistory, t]);

  const renderMeasurementCard = (measurement: MeasurementResponseDto, index: number) => {
    const bodyPartLabel = measurement.bodyPart?.displayName || measurement.bodyPart?.name || t("common.unknown");
    const unitLabel = measurement.unit?.displayName || measurement.unit?.name || t("common.unknown");

    return (
      <View
        key={`${measurement.createdAt || "measurement"}-${bodyPartLabel}-${index}`}
        className="bg-cardColor rounded-2xl p-4"
        style={{ gap: 10 }}
      >
        <View className="flex-row justify-between items-start" style={{ gap: 12 }}>
          <View className="flex-1" style={{ gap: 2 }}>
            <Text className="text-textColor text-lg" style={{ fontFamily: "OpenSans_700Bold" }}>
              {bodyPartLabel}
            </Text>
            <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
              {formatDate(measurement.createdAt, i18n.language)}
            </Text>
          </View>
          <View className="bg-secondaryColor rounded-xl px-3 py-2">
            <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
              {formatNumber(measurement.value, i18n.language)} {unitLabel}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTrendSummaryText = (trend: MeasurementTrendDto): string => {
    const differenceText = `${formatNumber(trend.difference, i18n.language)} ${trend.unit?.displayName || trend.unit?.name || ""}`.trim();

    switch (trend.direction) {
      case "up":
        return t("measurements.trend.up", { value: differenceText });
      case "down":
        return t("measurements.trend.down", { value: differenceText });
      case "same":
        return t("measurements.trend.same");
      default:
        return t("measurements.trend.insufficientData");
    }
  };

  const renderTrendCard = (trend: MeasurementTrendDto, index: number) => {
    const bodyPartLabel = trend.bodyPart?.displayName || trend.bodyPart?.name || t("common.unknown");
    const unitLabel = trend.unit?.displayName || trend.unit?.name || t("common.unknown");
    const hasEnoughData = trend.direction !== "insufficient_data";

    return (
      <View
        key={`${trend.bodyPart?.name || bodyPartLabel}-${index}`}
        className="bg-cardColor rounded-2xl p-4"
        style={{ gap: 10 }}
      >
        <Text className="text-textColor text-lg" style={{ fontFamily: "OpenSans_700Bold" }}>
          {bodyPartLabel}
        </Text>
        {hasEnoughData ? (
          <>
            <Text className="text-primaryColor text-xl" style={{ fontFamily: "OpenSans_700Bold" }}>
              {renderTrendSummaryText(trend)}
            </Text>
            <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
              {t("measurements.trend.range", {
                firstValue: formatNumber(trend.firstMeasurementValue, i18n.language),
                firstDate: formatDate(trend.firstMeasurementDate, i18n.language),
                lastValue: formatNumber(trend.lastMeasurementValue, i18n.language),
                lastDate: formatDate(trend.lastMeasurementDate, i18n.language),
                unit: unitLabel,
              })}
            </Text>
          </>
        ) : (
          <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
            {t("measurements.trend.insufficientData")}
          </Text>
        )}
      </View>
    );
  };

  const tabs = useMemo(
    () => [
      { key: "TREND" as const, label: t("measurements.tabs.trend") },
      { key: "LATEST" as const, label: t("measurements.tabs.latest") },
      { key: "HISTORY" as const, label: t("measurements.tabs.history") },
    ],
    [t]
  );

  return (
    <BackgroundMainSection>
      <View className="flex-1 px-4 py-4" style={{ gap: 16 }}>
        <View className="flex-row justify-between items-center" style={{ gap: 12 }}>
          <View className="flex-1" style={{ gap: 4 }}>
            <Text className="text-textColor text-2xl" style={{ fontFamily: "OpenSans_700Bold" }}>
              {t("measurements.title")}
            </Text>
            <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
              {t("measurements.subtitle")}
            </Text>
          </View>
          <CustomButton
            text={t("measurements.addCta")}
            onPress={() => setIsAddDialogVisible(true)}
            buttonStyleType={ButtonStyle.success}
            textWeight={FontWeights.bold}
            buttonStyleSize={ButtonSize.long}
          />
        </View>

        <View style={{ gap: 10 }}>
          <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
            {t("measurements.filters.bodyPartLabel")}
          </Text>
          <CustomDropdown
            value={selectedBodyPart}
            data={bodyPartDropdownOptions}
            onSelect={(item) => setSelectedBodyPart((item?.value as BodyPartFilter | undefined) || "ALL")}
          />
        </View>

        {selectedBodyPart !== "ALL" && availableUnits.length > 0 && (
          <View style={{ gap: 10 }}>
            <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
              {t("measurements.filters.unitLabel")}
            </Text>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {availableUnits.map((option) => {
                const isSelected = option.value === selectedUnit;

                return (
                  <View
                    key={option.value}
                    className={`rounded-full px-4 py-2 ${isSelected ? "bg-primaryColor" : "bg-cardColor"}`}
                  >
                    <Text
                      onPress={() => setSelectedUnit(option.value)}
                      className={isSelected ? "text-black" : "text-textColor"}
                      style={{ fontFamily: "OpenSans_400Regular" }}
                    >
                      {t(option.labelKey)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View className="bg-cardColor rounded-2xl p-2">
          <View className="flex-row" style={{ gap: 8 }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-xl px-3 py-3 ${isActive ? "bg-primaryColor" : "bg-secondaryColor"}`}
                >
                  <Text
                    className={`text-center text-sm ${isActive ? "text-black" : "text-textColor"}`}
                    style={{ fontFamily: isActive ? "OpenSans_700Bold" : "OpenSans_400Regular" }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 28 }}>
          {activeTab === "TREND" && (
            <View style={{ gap: 12 }}>
              <Text className="text-textColor text-lg" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t("measurements.trend.title")}
              </Text>
              {selectedBodyPart === "ALL" ? (
                isMeasurementTrendsLoading ? (
                  <ViewLoading />
                ) : visibleTrendCards.length ? (
                  <View style={{ gap: 10 }}>{visibleTrendCards.map(renderTrendCard)}</View>
                ) : (
                  <View className="bg-cardColor rounded-2xl p-4">
                    <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
                      {t("measurements.trend.empty")}
                    </Text>
                  </View>
                )
              ) : isMeasurementTrendLoading ? (
                <ViewLoading />
              ) : visibleTrendCards.length ? (
                <View style={{ gap: 10 }}>{visibleTrendCards.map(renderTrendCard)}</View>
              ) : (
                <View className="bg-cardColor rounded-2xl p-4">
                  <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
                    {t("measurements.trend.empty")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === "LATEST" && (
            <View style={{ gap: 12 }}>
              <Text className="text-textColor text-lg" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t("measurements.latestTitle")}
              </Text>
              {isMeasurementsListLoading ? (
                <ViewLoading />
              ) : measurementsList.length ? (
                <View style={{ gap: 10 }}>{measurementsList.map(renderMeasurementCard)}</View>
              ) : (
                <View className="bg-cardColor rounded-2xl p-4">
                  <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
                    {t("measurements.noMeasurementsYet")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === "HISTORY" && (
            <View style={{ gap: 12 }}>
              <Text className="text-textColor text-lg" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t("measurements.historyTitle")}
              </Text>
              {isMeasurementsHistoryLoading ? (
                <ViewLoading />
              ) : groupedMeasurementsHistory.length ? (
                <View style={{ gap: 14 }}>
                  {groupedMeasurementsHistory.map((group) => (
                    <View key={group.key} style={{ gap: 10 }}>
                      <View className="px-1">
                        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                          {group.label}
                        </Text>
                      </View>
                      <View style={{ gap: 10 }}>{group.items.map(renderMeasurementCard)}</View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="bg-cardColor rounded-2xl p-4">
                  <Text className="text-fifthColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
                    {t("measurements.noHistoryYet")}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      {isAddDialogVisible && <MeasurementsPopUp offPopUp={() => setIsAddDialogVisible(false)} />}
    </BackgroundMainSection>
  );
};

export default Measurements;

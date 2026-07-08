import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import ViewLoading from "../elements/ViewLoading";
import { useCurrentDietPlans } from "../../services/dietPlans/dietPlanService";

const CurrentDietSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useCurrentDietPlans();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plans = useMemo(() => {
    return [...(data?.data ?? [])].sort((left, right) => {
      if (Boolean(left.isActive) !== Boolean(right.isActive)) {
        return left.isActive ? -1 : 1;
      }

      const leftUpdated = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
      const rightUpdated = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
      return rightUpdated - leftUpdated;
    });
  }, [data?.data]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan._id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );

  const formatValue = (value?: number | null) => (value != null ? String(value) : "—");
  const formatDate = (value?: string | null) => {
    if (!value) {
      return t("trainer.noEndDate", "No end date");
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
  };

  const mealColumns = [
    { key: "estimatedCalories", label: t("trainer.dietCalories", "Calories") },
    { key: "proteinGrams", label: t("trainer.dietProtein", "Protein") },
    { key: "carbsGrams", label: t("trainer.dietCarbs", "Carbs") },
    { key: "fatGrams", label: t("trainer.dietFat", "Fat") },
  ] as const;

  const getPlanPreview = (notes?: string | null) => {
    const normalized = notes?.trim();
    if (normalized) {
      return normalized;
    }

    return null;
  };

  const closePlanPreview = () => setSelectedPlanId(null);

  if (isLoading) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <ViewLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.currentDiets", "Current Diets")}
        </Text>
        <Text className="text-red-500 text-center">
          {t("trainer.currentDietError", "Failed to load diet")}
        </Text>
        <Text onPress={() => refetch()} className="text-primaryColor text-center">
          {t("common.retry", "Retry")}
        </Text>
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.currentDiets", "Current Diets")}
        </Text>
        <Text className="text-textColor opacity-60 text-center">
          {t("trainer.noDietAssigned", "No active diet assigned yet")}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.currentDiets", "Current Diets")}
        </Text>

        <View className="flex-row flex-wrap justify-between" style={{ rowGap: 14 }}>
          {plans.map((plan, planIndex) => {
            const meals = [...(plan.meals ?? [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

            return (
              <Pressable
                key={plan._id || `${plan.name}-${planIndex}`}
                onPress={() => setSelectedPlanId(plan._id || null)}
                className="rounded-[28px] border border-thirdColor bg-mainColor p-4"
                style={{ width: "48%", minHeight: 220, gap: 12 }}
              >
                <View className="flex-row items-start justify-between" style={{ gap: 8 }}>
                  <Text
                    className="text-textColor text-base flex-1"
                    numberOfLines={2}
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    {plan.name || t("trainer.unnamedDiet", "Unnamed Diet")}
                  </Text>
                  <View className={`rounded-full px-3 py-1 ${plan.isActive ? "bg-primaryColor/20" : "bg-[#2A2A2A]"}`}>
                    <Text
                      className={`text-[10px] uppercase ${plan.isActive ? "text-primaryColor" : "text-textColor opacity-70"}`}
                      style={{ fontFamily: "OpenSans_700Bold" }}
                    >
                      {plan.isActive ? t("trainer.activePlan", "Active") : t("trainer.currentDiet", "Current Diet")}
                    </Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                  <View className="rounded-xl bg-[#222222] px-3 py-3 min-w-[47%] flex-1">
                    <Text className="text-textColor opacity-60 text-[11px] uppercase">
                      {t("trainer.dietCalories", "Calories")}
                    </Text>
                    <Text className="text-textColor mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>
                      {formatValue(plan.estimatedCalories)}
                    </Text>
                  </View>
                  <View className="rounded-xl bg-[#222222] px-3 py-3 min-w-[47%] flex-1">
                    <Text className="text-textColor opacity-60 text-[11px] uppercase">
                      {t("trainer.dietMealsCount", "Meals")}
                    </Text>
                    <Text className="text-textColor mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>
                      {meals.length}
                    </Text>
                  </View>
                </View>

                {getPlanPreview(plan.notes) ? (
                  <Text
                    className="text-textColor opacity-85 leading-7 flex-1"
                    numberOfLines={5}
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {getPlanPreview(plan.notes)}
                  </Text>
                ) : (
                  <View className="flex-1" />
                )}

                <Text className="text-textColor opacity-40 text-xs" style={{ fontFamily: "OpenSans_400Regular" }}>
                  {formatDate(plan.startDate)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Modal visible={Boolean(selectedPlan)} transparent animationType="fade" onRequestClose={closePlanPreview}>
        <View className="flex-1 justify-end bg-black/80 px-4 py-6">
          <View className="max-h-[88%] rounded-[32px] border border-thirdColor bg-secondaryColor px-5 py-5">
            <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
              <View className="flex-1" style={{ gap: 8 }}>
                <Text className="text-primaryColor text-xs uppercase tracking-[3px]" style={{ fontFamily: "OpenSans_700Bold" }}>
                  {t("trainer.currentDiets", "Current Diets")}
                </Text>
                <Text className="text-textColor text-2xl" style={{ fontFamily: "OpenSans_700Bold" }}>
                  {selectedPlan?.name || t("trainer.unnamedDiet", "Unnamed Diet")}
                </Text>
                <Text className="text-textColor opacity-55 text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
                  {formatDate(selectedPlan?.startDate)} — {formatDate(selectedPlan?.endDate)}
                </Text>
              </View>

              <Pressable onPress={closePlanPreview} className="h-10 w-10 items-center justify-center rounded-full bg-mainColor">
                <Text className="text-textColor text-xl" style={{ fontFamily: "OpenSans_700Bold" }}>×</Text>
              </Pressable>
            </View>

            <ScrollView className="mt-5" showsVerticalScrollIndicator={false}>
              <View style={{ gap: 16 }}>
                <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                  {mealColumns.map((column) => (
                    <View key={column.key} className="rounded-xl bg-[#222222] px-3 py-3 min-w-[47%] flex-1">
                      <Text className="text-textColor opacity-60 text-[11px] uppercase">{column.label}</Text>
                      <Text className="text-textColor text-lg mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>
                        {formatValue(selectedPlan?.[column.key])}
                      </Text>
                    </View>
                  ))}
                </View>

                {selectedPlan?.notes ? (
                  <View className="rounded-2xl bg-[#222222] p-4" style={{ gap: 4 }}>
                    <Text className="text-primaryColor text-xs" style={{ fontFamily: "OpenSans_700Bold" }}>
                      {t("trainer.dietNotes", "Trainer notes")}
                    </Text>
                    <Text className="text-textColor opacity-85 leading-7" style={{ fontFamily: "OpenSans_400Regular" }}>
                      {selectedPlan.notes}
                    </Text>
                  </View>
                ) : null}

                <View style={{ gap: 10 }}>
                  <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                    {t("trainer.dietMeals", "Meals")}
                  </Text>

                  {[...(selectedPlan?.meals ?? [])]
                    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
                    .map((meal, index) => (
                      <View
                        key={meal._id || `${meal.name}-${index}`}
                        className="bg-[#222222] rounded-xl border border-white/8 p-3"
                        style={{ gap: 10 }}
                      >
                        <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
                          <View className="flex-1">
                            <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                              {index + 1}. {meal.name || t("trainer.unnamedMeal", "Meal")}
                            </Text>
                            {meal.description ? (
                              <Text className="text-textColor opacity-70 text-xs mt-1 leading-5" style={{ fontFamily: "OpenSans_400Regular" }}>
                                {meal.description}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                          {mealColumns.map((column) => (
                            <View key={column.key} className="bg-[#181818] rounded-lg px-3 py-3 min-w-[47%] flex-1">
                              <Text className="text-textColor opacity-60 text-[11px] uppercase" style={{ fontFamily: "OpenSans_600SemiBold" }}>
                                {column.label}
                              </Text>
                              <Text className="text-textColor text-base mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>
                                {formatValue(meal[column.key])}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CurrentDietSection;

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import ViewLoading from "../elements/ViewLoading";
import { useCurrentDietPlans } from "../../services/dietPlans/dietPlanService";

const CurrentDietSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useCurrentDietPlans();

  const plans = [...(data?.data ?? [])].sort((left, right) => {
    const leftUpdated = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
    const rightUpdated = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
    return rightUpdated - leftUpdated;
  });

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
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.currentDiet", "Current Diet")}
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

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 14 }}>
      <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
        {t("trainer.currentDiets", "Current Diets")}
      </Text>

      {plans.map((plan, planIndex) => {
        const meals = [...(plan.meals ?? [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
        const hasMeals = meals.length > 0;

        return (
          <View key={plan._id || `${plan.name}-${planIndex}`} className="bg-[#181818] rounded-2xl border border-white/10 p-4" style={{ gap: 14 }}>
            <View style={{ gap: 10 }}>
              <Text className="text-textColor text-xl flex-1" style={{ fontFamily: "OpenSans_700Bold" }}>
                {plan.name || t("trainer.unnamedDiet", "Unnamed Diet")}
              </Text>

              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                <View className="bg-[#222222] px-3 py-3 rounded-xl min-w-[30%] flex-1">
                  <Text className="text-textColor opacity-60 text-[11px] uppercase">{t("trainer.dietStartDate", "Start")}</Text>
                  <Text className="text-textColor mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>{formatDate(plan.startDate)}</Text>
                </View>
                <View className="bg-[#222222] px-3 py-3 rounded-xl min-w-[30%] flex-1">
                  <Text className="text-textColor opacity-60 text-[11px] uppercase">{t("trainer.dietEndDate", "End")}</Text>
                  <Text className="text-textColor mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>{formatDate(plan.endDate)}</Text>
                </View>
                <View className="bg-[#222222] px-3 py-3 rounded-xl min-w-[30%] flex-1">
                  <Text className="text-textColor opacity-60 text-[11px] uppercase">{t("trainer.dietMealsCount", "Meals")}</Text>
                  <Text className="text-textColor mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>{meals.length}</Text>
                </View>
              </View>
              {plan.notes ? (
                <View className="bg-[#222222] rounded-xl p-3" style={{ gap: 4 }}>
                  <Text className="text-primaryColor text-xs" style={{ fontFamily: "OpenSans_700Bold" }}>
                    {t("trainer.dietNotes", "Trainer notes")}
                  </Text>
                  <Text className="text-textColor opacity-80" style={{ fontFamily: "OpenSans_400Regular" }}>
                    {plan.notes}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={{ gap: 10 }}>
              <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t("trainer.dietSummary", "Diet summary")}
              </Text>
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                <View className="bg-[#222222] rounded-xl p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietCalories", "Calories")}</Text>
                  <Text className="text-textColor text-lg mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.estimatedCalories)}</Text>
                </View>
                <View className="bg-[#222222] rounded-xl p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietProtein", "Protein")}</Text>
                  <Text className="text-textColor text-lg mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.proteinGrams)}</Text>
                </View>
                <View className="bg-[#222222] rounded-xl p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietCarbs", "Carbs")}</Text>
                  <Text className="text-textColor text-lg mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.carbsGrams)}</Text>
                </View>
                <View className="bg-[#222222] rounded-xl p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietFat", "Fat")}</Text>
                  <Text className="text-textColor text-lg mt-1" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.fatGrams)}</Text>
                </View>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t("trainer.dietMeals", "Meals")}
              </Text>

              {!hasMeals ? (
                <View className="bg-[#222222] rounded-xl p-3">
                  <Text className="text-textColor opacity-60 text-center">
                    {t("trainer.noDietMeals", "No meals assigned")}
                  </Text>
                </View>
              ) : (
                <ScrollView
                  className="max-h-[320px]"
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  <View style={{ gap: 10 }}>
                    {meals.map((meal, index) => (
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
                          <View className="bg-primaryColor/15 px-2 py-1 rounded-full">
                            <Text className="text-primaryColor text-[11px]" style={{ fontFamily: "OpenSans_700Bold" }}>
                              #{(meal.order ?? index) + 1}
                            </Text>
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
                </ScrollView>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CurrentDietSection;

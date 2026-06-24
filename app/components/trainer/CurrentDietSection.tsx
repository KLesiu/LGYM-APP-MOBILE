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
    { key: "estimatedCalories", label: t("trainer.dietCalories", "Calories"), width: 92 },
    { key: "proteinGrams", label: t("trainer.dietProtein", "Protein"), width: 88 },
    { key: "carbsGrams", label: t("trainer.dietCarbs", "Carbs"), width: 88 },
    { key: "fatGrams", label: t("trainer.dietFat", "Fat"), width: 88 },
  ] as const;

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
      <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
        {t("trainer.currentDiets", "Current Diets")}
      </Text>

      {plans.map((plan, planIndex) => {
        const meals = [...(plan.meals ?? [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
        const hasMeals = meals.length > 0;

        return (
          <View key={plan._id || `${plan.name}-${planIndex}`} className="bg-mainColor rounded-xl p-4" style={{ gap: 12 }}>
            <View style={{ gap: 8 }}>
              <Text className="text-textColor text-lg" style={{ fontFamily: "OpenSans_700Bold" }}>
                {plan.name || t("trainer.unnamedDiet", "Unnamed Diet")}
              </Text>
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                <View className="bg-secondaryColor px-3 py-2 rounded-lg">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietStartDate", "Start")}</Text>
                  <Text className="text-textColor" style={{ fontFamily: "OpenSans_600SemiBold" }}>{formatDate(plan.startDate)}</Text>
                </View>
                <View className="bg-secondaryColor px-3 py-2 rounded-lg">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietEndDate", "End")}</Text>
                  <Text className="text-textColor" style={{ fontFamily: "OpenSans_600SemiBold" }}>{formatDate(plan.endDate)}</Text>
                </View>
                <View className="bg-secondaryColor px-3 py-2 rounded-lg">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietMealsCount", "Meals")}</Text>
                  <Text className="text-textColor" style={{ fontFamily: "OpenSans_600SemiBold" }}>{meals.length}</Text>
                </View>
              </View>
              {plan.notes ? (
                <View className="bg-secondaryColor rounded-lg p-3" style={{ gap: 4 }}>
                  <Text className="text-primaryColor text-xs" style={{ fontFamily: "OpenSans_700Bold" }}>
                    {t("trainer.dietNotes", "Trainer notes")}
                  </Text>
                  <Text className="text-textColor opacity-80" style={{ fontFamily: "OpenSans_400Regular" }}>
                    {plan.notes}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={{ gap: 8 }}>
              <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t("trainer.dietSummary", "Diet summary")}
              </Text>
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                <View className="bg-secondaryColor rounded-lg p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietCalories", "Calories")}</Text>
                  <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.estimatedCalories)}</Text>
                </View>
                <View className="bg-secondaryColor rounded-lg p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietProtein", "Protein")}</Text>
                  <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.proteinGrams)}</Text>
                </View>
                <View className="bg-secondaryColor rounded-lg p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietCarbs", "Carbs")}</Text>
                  <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.carbsGrams)}</Text>
                </View>
                <View className="bg-secondaryColor rounded-lg p-3 min-w-[44%] flex-1">
                  <Text className="text-textColor opacity-60 text-xs">{t("trainer.dietFat", "Fat")}</Text>
                  <Text className="text-textColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>{formatValue(plan.fatGrams)}</Text>
                </View>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t("trainer.dietMeals", "Meals")}
              </Text>

              {!hasMeals ? (
                <View className="bg-secondaryColor rounded-lg p-3">
                  <Text className="text-textColor opacity-60 text-center">
                    {t("trainer.noDietMeals", "No meals assigned")}
                  </Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="bg-secondaryColor rounded-lg overflow-hidden" style={{ minWidth: 560 }}>
                    <View className="flex-row items-center border-b border-white/10 px-3 py-3">
                      <Text className="text-primaryColor text-xs uppercase" style={{ fontFamily: "OpenSans_700Bold", width: 200 }}>
                        {t("trainer.dietMealColumn", "Meal")}
                      </Text>
                      {mealColumns.map((column) => (
                        <Text
                          key={column.key}
                          className="text-primaryColor text-xs uppercase text-right"
                          style={{ fontFamily: "OpenSans_700Bold", width: column.width }}
                        >
                          {column.label}
                        </Text>
                      ))}
                    </View>

                    {meals.map((meal, index) => (
                      <View
                        key={meal._id || `${meal.name}-${index}`}
                        className="border-b border-white/5 px-3 py-3"
                      >
                        <View className="flex-row items-center">
                          <View style={{ width: 200, paddingRight: 12 }}>
                            <Text className="text-textColor" style={{ fontFamily: "OpenSans_700Bold" }}>
                              {index + 1}. {meal.name || t("trainer.unnamedMeal", "Meal")}
                            </Text>
                            {meal.description ? (
                              <Text className="text-textColor opacity-70 text-xs mt-1" style={{ fontFamily: "OpenSans_400Regular" }}>
                                {meal.description}
                              </Text>
                            ) : null}
                          </View>

                          {mealColumns.map((column) => (
                            <Text
                              key={column.key}
                              className="text-textColor text-right"
                              style={{ fontFamily: "OpenSans_600SemiBold", width: column.width }}
                            >
                              {formatValue(meal[column.key])}
                            </Text>
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

import { View, Text, ScrollView } from "react-native";
import PlanNameIcon from "./../../../../../img/icons/planIcon.svg";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ExerciseList from "./exerciseList/ExerciseList";
import { usePlanDay } from "./CreatePlanDayContext";
import { ExerciseForPlanDay } from "../../../../../interfaces/Exercise";
import React from "react";

interface CreatePlanDaySummaryProps {
  saveCurrentPlan: (
    planName: string,
    exercisesArg: ExerciseForPlanDay[]
  ) => Promise<void>;
  isPreview?: boolean;
}

const CreatePlanDaySummary: React.FC<CreatePlanDaySummaryProps> = (props) => {
  const { exercisesList, goBack, planDayName, closeForm } = usePlanDay();

  const savePlan = async () => {
    await props.saveCurrentPlan(planDayName, exercisesList);
  };

  return (
    <View className="w-full h-full">
      <View className="px-5 py-2">
        <Text
          className="text-3xl smallPhone:text-xl  text-textColor"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Summary
        </Text>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <PlanNameIcon />
          <Text
            className="text-xl smallPhone:text-base text-textColor"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {planDayName}
          </Text>
        </View>
      </View>
      <ScrollView>
        <ExerciseList exerciseList={exercisesList} />
      </ScrollView>

      <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={props.isPreview ? closeForm : goBack}
          text={props.isPreview ? "Close" : "Back"}
          width="flex-1"
        />

        {!props.isPreview && (
          <CustomButton
            buttonStyleType={ButtonStyle.success}
            onPress={savePlan}
            text="Save"
            width="flex-1"
          />
        )}
      </View>
    </View>
  );
};

export default CreatePlanDaySummary;

import { View, Text } from "react-native";
import PlanNameIcon from "./../../../../../img/icons/planIcon.svg";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ExerciseList from "./exerciseList/ExerciseList";
import { usePlanDay } from "./CreatePlanDayContext";

interface CreatePlanDaySummaryProps {
  saveCurrentPlan: () => Promise<void>;
  isPreview?: boolean;
}

const CreatePlanDaySummary: React.FC<CreatePlanDaySummaryProps> = (props) => {
  const { exercisesList, goBack,planDayName,closeForm} =
    usePlanDay();
  return (
    <View className="w-full h-full">
      <View className="px-5 py-2">
        <Text
          className="text-3xl text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Summary
        </Text>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <PlanNameIcon />
          <Text
            className="text-xl text-white"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {planDayName}
          </Text>
        </View>
      </View>
      <ExerciseList exerciseList={exercisesList} />
      <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
        {props.isPreview && closeForm ? (
          <CustomButton
            buttonStyleType={ButtonStyle.outlineBlack}
            onPress={closeForm}
            text="Close"
            width="flex-1"
          />
        ) : (
          <CustomButton
            buttonStyleType={ButtonStyle.outlineBlack}
            onPress={goBack}
            text="Back"
            width="flex-1"
          />
        )}

        <CustomButton
          buttonStyleType={ButtonStyle.success}
          onPress={() => props.saveCurrentPlan()}
          text="Save"
          width="flex-1"
        />
      </View>
    </View>
  );
};

export default CreatePlanDaySummary;

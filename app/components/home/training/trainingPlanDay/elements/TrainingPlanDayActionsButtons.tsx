import React, { useState } from "react";
import { View } from "react-native";
import PlanIcon from "./../../../../../../img/icons/planIcon.svg";
import GymIcon from "./../../../../../../img/icons/gymIcon.svg";
import SwitchIcon from "./../../../../../../img/icons/switchIcon.svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoveIcon from "./../../../../../../img/icons/deleteIcon.svg";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import { PlanDayExercisesFormVm } from "../../../../../../interfaces/PlanDay";
import { BodyParts } from "../../../../../../enums/BodyParts";

enum ActionButtonsEnum {
  PLAN = "PLAN",
  GYM = "GYM",
  SWITCH = "SWITCH",
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  REMOVE = "REMOVE",
}

interface TrainingPlanDayActionsButtonsProps {
  getExerciseToAddFromForm: (
    exerciseId: string,
    series: number,
    reps: string,
    isIncrementDecrement?: boolean
  ) => Promise<void>;
  deleteExerciseFromPlan: (
    exerciseId: string | undefined
  ) => Promise<
    | {
        exercises: PlanDayExercisesFormVm[];
        _id: string;
        name: string;
      }
    | undefined
  >;
  showExerciseFormByBodyPart: (
    bodyPart: BodyParts,
    exerciseToSwitchId: string
  ) => void;
  togglePlanShow: () => void;
}

const TrainingPlanDayActionsButtons: React.FC<
  TrainingPlanDayActionsButtonsProps
> = ({
  getExerciseToAddFromForm,
  deleteExerciseFromPlan,
  showExerciseFormByBodyPart,
  togglePlanShow,
}) => {
  const { toggleGymFilter, currentExercise } = useTrainingPlanDay();

  const [buttons, setButtons] = useState([
    {
      icon: <PlanIcon width={24} height={24} />,
      actionId: ActionButtonsEnum.PLAN,
      isActive: false,
    },
    {
      icon: <GymIcon width={24} height={24} />,
      actionId: ActionButtonsEnum.GYM,
      isActive: true,
    },
    {
      icon: <SwitchIcon width={24} height={24} />,
      actionId: ActionButtonsEnum.SWITCH,
      isActive: false,
    },
    {
      icon: <Icon name="plus" size={24} color={"#ffff"} />,
      actionId: ActionButtonsEnum.INCREMENT,
      isActive: false,
    },
    {
      icon: <Icon name="minus" size={24} color={"#ffff"} />,
      actionId: ActionButtonsEnum.DECREMENT,
      isActive: false,
    },
    {
      icon: <RemoveIcon width={24} height={24} />,
      actionId: ActionButtonsEnum.REMOVE,
      isActive: false,
    },
  ]);

  const toggleButtonActive = (id: ActionButtonsEnum) => {
    setButtons((prev) =>
      prev.map((b) =>
        b.actionId === id ? { ...b, isActive: !b.isActive } : b
      )
    );
  };

  const handleButtonPress = async (id: ActionButtonsEnum) => {
    switch (id) {
      case ActionButtonsEnum.PLAN:
        togglePlanShow();
        break;
      case ActionButtonsEnum.GYM:
        toggleGymFilter();
        toggleButtonActive(ActionButtonsEnum.GYM);
        break;
      case ActionButtonsEnum.SWITCH:
        if (currentExercise)
          showExerciseFormByBodyPart(
            currentExercise.exercise.bodyPart,
            currentExercise.exercise._id!
          );
        break;
      case ActionButtonsEnum.INCREMENT:
        if (currentExercise)
          await getExerciseToAddFromForm(
            currentExercise.exercise._id!,
            currentExercise.series + 1,
            currentExercise.reps,
            true
          );
        break;
      case ActionButtonsEnum.DECREMENT:
        if (currentExercise)
          await getExerciseToAddFromForm(
            currentExercise.exercise._id!,
            currentExercise.series - 1,
            currentExercise.reps,
            true
          );
        break;
      case ActionButtonsEnum.REMOVE:
        await deleteExerciseFromPlan(currentExercise?.exercise._id);
        break;
    }
  };

  return (
    <View
      className="flex flex-row justify-between px-5 w-full"
      style={{ gap: 6 }}
    >
      {buttons.map((button, index) => (
        <CustomButton
          key={index}
          buttonStyleSize={ButtonSize.square}
          buttonStyleType={
            button.isActive ? ButtonStyle.outline : ButtonStyle.grey
          }
          onPress={() => handleButtonPress(button.actionId)}
          customSlots={[button.icon]}
        />
      ))}
    </View>
  );
};

export default TrainingPlanDayActionsButtons;

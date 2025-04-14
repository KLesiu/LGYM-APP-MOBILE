import { View } from "react-native";
import PlanIcon from "./../../../../../../img/icons/planIcon.svg";
import GymIcon from "./../../../../../../img/icons/gymIcon.svg";
import RecordsIcon from "./../../../../../../img/icons/recordsIcon.svg";
import SwitchIcon from "./../../../../../../img/icons/switchIcon.svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoveIcon from "./../../../../../../img/icons/deleteIcon.svg";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import { PlanDayExercisesFormVm } from "../../../../../../interfaces/PlanDay";

interface TrainingPlanDayActionsButtonsProps {
  getExerciseToAddFromForm: (
    exerciseId: string,
    series: number,
    reps: string,
    isIncrementDecrement?: boolean
  ) => Promise<void>;
  deleteExerciseFromPlan: (exerciseId: string | undefined) => Promise<
    | {
        exercises: PlanDayExercisesFormVm[];
        gym: string;
        _id: string;
        name: string;
      }
    | undefined
  >;
}

const TrainingPlanDayActionsButtons: React.FC<
  TrainingPlanDayActionsButtonsProps
> = ({ getExerciseToAddFromForm,deleteExerciseFromPlan }) => {
  const buttons = [
    {
      icon: <PlanIcon width={24} height={24} />,
      action: () => {},
      isActive: false,
    },
    {
      icon: <RecordsIcon width={24} height={24} color={"#ffff"} />,
      action: () => {},
      isActive: false,
    },
    {
      icon: <GymIcon width={24} height={24} />,
      action: () => {},
      isActive: false,
    },
    {
      icon: <SwitchIcon width={24} height={24} />,
      action: () => {},
      isActive: false,
    },
    {
      icon: <Icon name="plus" size={24} color={"#ffff"} />,
      action: ()=> incrementSeriesNumber(`${currentExercise?.exercise._id}`,currentExercise?.series!, currentExercise?.reps!),
      isActive: false,
    },
    {
      icon: <Icon name="minus" size={24} color={"#ffff"} />,
      action: () => decrementSeriesNumber(`${currentExercise?.exercise._id}`,currentExercise?.series!, currentExercise?.reps!),
      isActive: false,
    },
    {
      icon: <RemoveIcon width={24} height={24} />,
      action: () => deleteExerciseFromPlan(currentExercise?.exercise._id),
      isActive: false,
    },
  ];

  const {currentExercise} = useTrainingPlanDay()

  /// Increment the series number of an current exercise
  const incrementSeriesNumber = async (
    exercise: string,
    series: number,
    reps: string
  ) => {
    await getExerciseToAddFromForm(exercise, series + 1, reps, true);
  };

  /// Decrement the series number of an current exercise
  const decrementSeriesNumber = async (
    exercise: string,
    series: number,
    reps: string
  ) => {
    await getExerciseToAddFromForm(exercise, series - 1, reps, true);
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
          buttonStyleType={ButtonStyle.grey}
          onPress={button.action}
          customSlots={[button.icon]}
        />
      ))}
    </View>
  );
};

export default TrainingPlanDayActionsButtons;

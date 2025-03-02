import { View, Text, Pressable } from "react-native";
import CustomButton, { ButtonSize } from "../../elements/CustomButton";
import { PlanDayBaseInfoVm } from "./../../../../interfaces/PlanDay";
import EditIcon from "./../../../../img/icons/editIcon.svg";
import DeleteIcon from "./../../../../img/icons/deleteIcon.svg";
import Card from "../../elements/Card";

interface TrainingPlanItemProps {
  item: PlanDayBaseInfoVm;
  showPlanDayForm: (item: PlanDayBaseInfoVm, isPreview?: boolean) => void;
  deletePlanDayVisible: (visible: boolean, item: PlanDayBaseInfoVm) => void;
}
const TrainingPlanItem: React.FC<TrainingPlanItemProps> = ({
  item,
  showPlanDayForm,
  deletePlanDayVisible,
}) => {
  return (
    <View key={item._id} className="w-full" style={{ gap: 10 }}>
      <Text
        style={{ fontFamily: "OpenSans_400Regular" }}
        className="text-base text-white"
      >
        Last training:{" "}
        {item.lastTrainingDate
          ? new Date(item.lastTrainingDate).toLocaleDateString()
          : "No training yet"}
      </Text>
      <Card onPress={() => showPlanDayForm(item, true)}>
        <View className="flex flex-col" style={{ gap: 4 }}>
          <Text
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
            className="text-xl font-bold text-white"
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
            className="text-base  text-fifthColor"
          >
            Exercises: {item.totalNumberOfExercises}
          </Text>
          <View className="flex flex-row w-full " style={{ gap: 16 }}>
            <Text
              style={{
                fontFamily: "OpenSans_400Regular",
              }}
              className="text-base  text-fifthColor"
            >
              Total series: {item.totalNumberOfSeries}
            </Text>
          </View>
        </View>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <View className="flex justify-center items-center w-12 h-12 bg-secondaryColor70 rounded-lg ">
            <CustomButton
              buttonStyleSize={ButtonSize.small}
              onPress={() => showPlanDayForm(item, undefined)}
              customSlots={[<EditIcon fill={"white"} />]}
            />
          </View>
          <View className="flex justify-center items-center w-12 h-12 bg-secondaryColor70 rounded-lg ">
            <CustomButton
              buttonStyleSize={ButtonSize.small}
              onPress={() => deletePlanDayVisible(true, item)}
              customSlots={[<DeleteIcon />]}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default TrainingPlanItem;

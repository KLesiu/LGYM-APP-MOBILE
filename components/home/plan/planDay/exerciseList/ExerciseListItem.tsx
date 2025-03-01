import { View, Text, Pressable } from "react-native";
import { ExerciseForPlanDay } from "./../../../../../interfaces/Exercise";
import CustomButton, { ButtonSize } from "./../../../../elements/CustomButton";
import IconDelete from "./../../../../../img/icons/deleteIcon.svg"
interface ExerciseListItemProps {
  exerciseListItem: ExerciseForPlanDay;
  removeExerciseFromList: (item: ExerciseForPlanDay) => void;
  editExerciseFromList : (item: ExerciseForPlanDay) => void
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exerciseListItem,
  removeExerciseFromList,
  editExerciseFromList
}) => {
  return (
    <Pressable
      className="w-full bg-fourthColor flex flex-row p-2 rounded-lg justify-between items-center"
      style={{ gap: 20 }}
      onPress={() => editExerciseFromList(exerciseListItem)}
    >
      <View className="flex flex-col" style={{ gap: 4 }}>
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
          }}
          className="text-xl  text-white"
        >
          {exerciseListItem.exercise.label}
        </Text>
        <View className="flex flex-row" style={{ gap: 4 }}>
          <Text
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
            className="text-sm  text-fifthColor"
          >
            Series: {exerciseListItem.series}
          </Text>
          <View className="flex flex-row" style={{ gap: 16 }}>
            <Text
              style={{
                fontFamily: "OpenSans_400Regular",
              }}
              className="text-sm  text-fifthColor"
            >
              Reps: {exerciseListItem.reps}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex justify-center items-center w-12 h-12 bg-secondaryColor70 rounded-lg ">
        <CustomButton
          buttonStyleSize={ButtonSize.small}
          onPress={()=>removeExerciseFromList(exerciseListItem)}
          customSlots={[<IconDelete/>]}
        />
      </View>
    </Pressable>
  );
};

export default ExerciseListItem;

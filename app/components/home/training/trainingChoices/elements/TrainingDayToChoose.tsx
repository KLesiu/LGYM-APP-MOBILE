import { PlanDayChoose } from "../../../../../../interfaces/PlanDay";
import Card from "../../../../elements/Card";
import { View, Text, Pressable } from "react-native";

interface TrainingDayToChooseProps {
  trainingType: PlanDayChoose;
}

const TrainingDayToChoose: React.FC<TrainingDayToChooseProps> = ({
  trainingType,
}) => {
  return (
    <Card>
      <View className="flex flex-col">
        <View className="flex flex-row justify-between w-full">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-xl font-bold text-white"
          >
            {trainingType.name}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default TrainingDayToChoose;

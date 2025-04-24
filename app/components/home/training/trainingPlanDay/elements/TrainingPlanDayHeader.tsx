import { View, Text, Pressable } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import GymIcon from "./../../../../../../img/icons/gymIcon.svg";
import BackIcon from "./../../../../../../img/icons/backIcon.svg"
import Header from "../../../../layout/Header";

interface TrainingPlanDayHeaderProps {
  hideDaySection: () => void;
}

const TrainingPlanDayHeader: React.FC<TrainingPlanDayHeaderProps> = ({
  hideDaySection,
}) => {
  const { gym, planDayName } = useTrainingPlanDay();
  return (
    <Header customClasses="justify-between">
      <Pressable onPress={hideDaySection}  style={{ borderRadius: 10000 }}
        className="flex items-center justify-center w-8 h-8  bg-secondaryColor ">
        <BackIcon />
      </Pressable>
      <View className="flex flex-col items-center " style={{ gap: 4 }}>
        <Text
          className="text-base text-white  font-bold "
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
        >
          {planDayName}
        </Text>
        <View className="flex flex-row items-center" style={{ gap: 4 }}>
          <GymIcon width={14} height={14} />
          <Text
            className="text-[12px] text-white"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {gym?.name}
          </Text>
        </View>
      </View>
    
    </Header>
  );
};
export default TrainingPlanDayHeader;

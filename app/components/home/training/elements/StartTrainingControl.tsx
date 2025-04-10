import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../../elements/CustomButton";

interface StartTrainingControlProps {
  isAddTrainingActive: boolean;
  getCurrentPlanDayTraining: () => void;
  getInformationAboutGyms: () => void;
}

const StartTrainingControl: React.FC<StartTrainingControlProps> = ({
  isAddTrainingActive,
  getCurrentPlanDayTraining,
  getInformationAboutGyms,
}) => {
  return (
    <>
      {isAddTrainingActive ? (
        <CustomButton
          onPress={getCurrentPlanDayTraining}
          customSlots={[
            <Icon
              style={{ fontSize: 140, color: "#20BC2D" }}
              name="play-circle"
            />,
          ]}
        />
      ) : (
        <Pressable onPress={getInformationAboutGyms}>
          <Icon
            style={{ fontSize: 140, color: "#20BC2D" }}
            name="plus-circle"
          />
        </Pressable>
      )}
    </>
  );
};

export default StartTrainingControl;

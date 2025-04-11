import { View } from "react-native";
import PlanIcon from "./../../../../../../img/icons/planIcon.svg";
import GymIcon from "./../../../../../../img/icons/gymIcon.svg";
import RecordsIcon from "./../../../../../../img/icons/recordsIcon.svg";
import SwitchIcon from "./../../../../../../img/icons/switchIcon.svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoveIcon from "./../../../../../../img/icons/deleteIcon.svg";
import TrainingPlanDayActionsButton from "./TrainingPlanDayActionsButton";

interface TrainingPlanDayActionsButtonsProps {}

const TrainingPlanDayActionsButtons: React.FC<
  TrainingPlanDayActionsButtonsProps
> = () => {
  const buttons = [
    {
      icon: <PlanIcon width={24} height={24} />,
      action: () => {},
      isActive: false,
    },
    {
      icon: <RecordsIcon width={24} height={24} color={'#ffff'} />,
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
      icon: <Icon name="plus" size={24} color={'#ffff'} />,
      action: () => {},
      isActive: false,
    },
    {
      icon: <Icon name="minus" size={24}  color={'#ffff'}/>,
      action: () => {},
      isActive: false,
    },
    {
      icon: <RemoveIcon width={24} height={24} />,
      action: () => {},
      isActive: false,
    },
  ];
  return (
    <View className="flex flex-row justify-between px-5" style={{gap:6}}>
      {buttons.map((button, index) => <TrainingPlanDayActionsButton button={button} key={index} />)}
    </View>
  );
};

export default TrainingPlanDayActionsButtons;

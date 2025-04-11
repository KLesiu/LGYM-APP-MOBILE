import { View } from "react-native"

interface TrainingPlanDayActionsButtonProps {
    button:{icon:JSX.Element,action:()=>void,isActive:boolean},
    key:number
}

const TrainingPlanDayActionsButton:React.FC<TrainingPlanDayActionsButtonProps> = ({button,key}) => {
    return(
        <View key={key} className="bg-secondaryColor w-12 h-12 flex justify-center items-center rounded-lg">
            {button.icon}
        </View>
    )
}

export default TrainingPlanDayActionsButton;
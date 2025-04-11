import React, { useState } from "react"
import { View, Pressable ,Text,  Switch as SwitchComp,} from "react-native"
import { useTrainingPlanDay } from "../TrainingPlanDayContext";

interface TrainingPlanDayFooterButtonsProps {
    hideAndDeleteTrainingSession: () => void;
    sendTraining: (trainingSessionScores: any) => void;
}

const TrainingPlanDayFooterButtons:React.FC<TrainingPlanDayFooterButtonsProps> = ({hideAndDeleteTrainingSession,sendTraining}) => {
    const {trainingSessionScores} = useTrainingPlanDay()
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
    
    return(
        <View className="w-full flex flex-row justify-between">
        <Pressable
          onPress={hideAndDeleteTrainingSession}
          disabled={!isEnabled}
          style={{ borderRadius: 8 }}
          className={`flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f] ${
            !isEnabled ? "opacity-50" : "opacity-100"
          }`}
        >
          <Text
            className="text-center text-base text-white"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            Delete
          </Text>
        </Pressable>

        <SwitchComp onValueChange={toggleSwitch} value={isEnabled} />

        <Pressable
          onPress={() => sendTraining(trainingSessionScores)}
          disabled={!isEnabled}
          style={{ borderRadius: 8 }}
          className={` flex flex-row justify-center items-center w-28 h-14 bg-primaryColor ${
            !isEnabled ? "opacity-50" : "opacity-100"
          }`}
        >
          <Text
            className="text-base"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Add
          </Text>
        </Pressable>
      </View>
    )
}

export default TrainingPlanDayFooterButtons
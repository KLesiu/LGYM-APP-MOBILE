import { PlanDayChoose } from "../../../../../interfaces/PlanDay";
import Dialog from "../../../elements/Dialog";
import { Text, TouchableOpacity, View } from "react-native";
import TrainingDayToChoose from "./elements/TrainingDayToChoose";
import CustomButton, { ButtonSize } from "../../../elements/CustomButton";
import { useEffect, useState } from "react";
import { useHomeContext } from "../../HomeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../../../../AppContext";
interface TrainingDayChooseProps {
  showDaySection: (day: string) => Promise<void>;
}

const TrainingDayChoose: React.FC<TrainingDayChooseProps> = ({
  showDaySection,
}) => {
  const { userId } = useHomeContext();
  const {getAPI} = useAppContext()
  const [trainingTypes, setTrainingTypes] = useState<PlanDayChoose[]>([]);

  useEffect(() => {
    init();
  },[])

  const init = async () => {
    await getInformationsAboutPlanDays();
  }

  const getInformationsAboutPlanDays =
    async (): Promise<void> => {
      await getAPI(`/planDay/${userId}/getPlanDaysTypes`, (response: PlanDayChoose[])=>setTrainingTypes(response),undefined,false)
    };
  return (
    <Dialog>
      <View
        className="flex flex-col justify-center w-full p-4"
        style={{ gap: 16 }}
      >
        <Text
          className="text-[28px] text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Choose training day!
        </Text>
        <View className="flex flex-col">
          {trainingTypes.map((ele: PlanDayChoose, index: number) => (
            <CustomButton
              key={index}
              buttonStyleSize={ButtonSize.none}
              onPress={() => showDaySection(ele._id)}
            >
              <TrainingDayToChoose trainingType={ele} />
            </CustomButton>
          ))}
        </View>
      </View>
    </Dialog>
  );
};

export default TrainingDayChoose;

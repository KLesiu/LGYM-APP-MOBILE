import { PlanDayChoose } from "../../../../../interfaces/PlanDay";
import Dialog from "../../../elements/Dialog";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import TrainingDayToChoose from "./elements/TrainingDayToChoose";
import CustomButton, { ButtonSize } from "../../../elements/CustomButton";
import { useEffect, useState } from "react";
import { useHomeContext } from "../../HomeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../../../../AppContext";
import ViewLoading from "../../../elements/ViewLoading";
import React from "react";
interface TrainingDayChooseProps {
  showDaySection: (day: string) => Promise<void>;
}

const TrainingDayChoose: React.FC<TrainingDayChooseProps> = ({
  showDaySection,
}) => {
  const { userId } = useHomeContext();
  const { getAPI } = useAppContext();
  const [trainingTypes, setTrainingTypes] = useState<PlanDayChoose[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getInformationsAboutPlanDays();
    setViewLoading(false);
  };

  const getInformationsAboutPlanDays = async (): Promise<void> => {
    await getAPI(
      `/planDay/${userId}/getPlanDaysTypes`,
      (response: PlanDayChoose[]) => setTrainingTypes(response),
      undefined,
      false
    );
  };

  if (viewLoading) {
    return (
      <Dialog>
        <ViewLoading />
      </Dialog>
    );
  }

  return (
    <Dialog>
      <View
        className="flex flex-col justify-center w-full p-4"
        style={{ gap: 8 }}
      >
        <Text
          className="text-lg text-textColor"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Choose training day!
        </Text>
        <ScrollView className="w-full">
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
        </ScrollView>
      </View>
    </Dialog>
  );
};

export default TrainingDayChoose;

import { PlanDayChooseDto } from "../../../../../api/generated/model";
import Dialog from "../../../elements/Dialog";
import { ScrollView, Text, View } from "react-native";
import TrainingDayToChoose from "./elements/TrainingDayToChoose";
import CustomButton, { ButtonSize } from "../../../elements/CustomButton";
import { useMemo } from "react";
import { useHomeContext } from "../../HomeContext";
import ViewLoading from "../../../elements/ViewLoading";
import React from "react";
import { useGetApiPlanDayIdGetPlanDaysTypes } from "../../../../../api/generated/plan-day/plan-day";
import NoTrainingDaysInfo from "./elements/NoTrainingDaysInfo";
import { useAppContext } from "../../../../AppContext";

interface TrainingDayChooseProps {
  showDaySection: (day: string) => Promise<void>;
  goBack: () => void;
}

const TrainingDayChoose: React.FC<TrainingDayChooseProps> = ({
  showDaySection,
  goBack,
}) => {
  const { userId } = useHomeContext();
  const { errors } = useAppContext();

  const { data, isLoading } = useGetApiPlanDayIdGetPlanDaysTypes(userId, {
    query: { enabled: !!userId },
  });

  const trainingTypes = useMemo(() => {
    if (data?.data) {
      return data.data as unknown as PlanDayChooseDto[];
    }
    return [];
  }, [data]);

  if (isLoading) {
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
        {errors.length || !trainingTypes.length ? (
          <NoTrainingDaysInfo goBack={goBack} />
        ) : (
          <ScrollView className="w-full">
            <View className="flex flex-col">
              {trainingTypes.map((ele: PlanDayChooseDto, index: number) => (
                <CustomButton
                  key={index}
                  buttonStyleSize={ButtonSize.none}
                  onPress={() => ele._id && showDaySection(ele._id)}
                >
                  <TrainingDayToChoose trainingType={ele as any} />
                </CustomButton>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </Dialog>
  );
};

export default TrainingDayChoose;

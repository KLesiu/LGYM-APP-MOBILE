import { View, Text, Pressable } from "react-native";
import CustomButton, { ButtonSize } from "../../elements/CustomButton";
import { PlanDayBaseInfoVm } from "./../../../../interfaces/PlanDay";
import EditIcon from "./../../../../img/icons/editIcon.svg";
import DeleteIcon from "./../../../../img/icons/deleteIcon.svg";
import Card from "../../elements/Card";
import React from "react";
import { useTranslation } from "react-i18next";

interface TrainingPlanItemProps {
  item: PlanDayBaseInfoVm;
  showPlanDayForm: (item: PlanDayBaseInfoVm, isPreview?: boolean) => void;
  deletePlanDayVisible: (visible: boolean, item: PlanDayBaseInfoVm) => void;
}
const TrainingPlanItem: React.FC<TrainingPlanItemProps> = ({
  item,
  showPlanDayForm,
  deletePlanDayVisible,
}) => {
  const { t } = useTranslation();
  return (
    <View key={item._id} className="w-full" style={{ gap: 10 }}>
      <Text
        style={{ fontFamily: "OpenSans_400Regular" }}
        className="text-base smallPhone:text-sm text-textColor"
      >
        {t('plans.lastTraining', {
          date: item.lastTrainingDate ? new Date(item.lastTrainingDate).toLocaleDateString() : t('plans.noTrainingYet')
        })}
      </Text>
      <Card onPress={() => showPlanDayForm(item, true)}>
        <View className="flex flex-col" style={{ gap: 4 }}>
          <Text
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
            className="text-xl smallPhone:text-lg font-bold text-textColor"
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
            className=" text-base smallPhone:text-sm  text-fifthColor"
          >
            {t('plans.exercisesCount', { count: item.totalNumberOfExercises })}
          </Text>
          <View className="flex flex-row w-full " style={{ gap: 16 }}>
            <Text
              style={{
                fontFamily: "OpenSans_400Regular",
              }}
              className=" text-base smallPhone:text-sm  text-fifthColor"
            >
              {t('plans.totalSeries', { count: item.totalNumberOfSeries })}
            </Text>
          </View>
        </View>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
            <CustomButton
              buttonStyleSize={ButtonSize.small}
              onPress={() => showPlanDayForm(item, undefined)}
              customSlots={[<EditIcon fill={"white"} />]}
            />
          </View>
          <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
            <CustomButton
              buttonStyleSize={ButtonSize.small}
              onPress={() => deletePlanDayVisible(true, item)}
              customSlots={[<DeleteIcon />]}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default TrainingPlanItem;

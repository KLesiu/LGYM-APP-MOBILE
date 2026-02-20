import React from "react";
import { View, Text } from "react-native";
import ExerciseSeriesInTrainingElement from "./ExerciseSeriesInTrainingElement";
import { ExerciseTrainingHistoryItemDto } from "../../../../api/generated/model";
import { useTranslation } from "react-i18next";

interface ExerciseSeriesInTrainigsListProps {
  listOfExerciseSeriesInTrainigs: ExerciseTrainingHistoryItemDto[];
}

const ExerciseSeriesInTrainigsList: React.FC<
  ExerciseSeriesInTrainigsListProps
> = ({ listOfExerciseSeriesInTrainigs }) => {
  const { t } = useTranslation();

  return (
    <View className="flex flex-col pt-2" style={{ gap: 4 }}>
      <Text
        className="font-normal text-base text-textColor"
        style={{ fontFamily: "OpenSans_400Regular" }}
      >
        {t("exercises.history")}
      </Text>
      <View className="flex flex-col" style={{ gap: 16 }}>
        {listOfExerciseSeriesInTrainigs &&
          listOfExerciseSeriesInTrainigs.length ?
          listOfExerciseSeriesInTrainigs.map((x) => (
            <ExerciseSeriesInTrainingElement
              key={x._id}
              exerciseSeriesInTraining={x}
            />
          )) : <Text className="text-textColor text-xs" style={{fontFamily: "OpenSans_300Light", }}>{t("exercises.noHistoryAvailable")}</Text>}
      </View>
    </View>
  );
};

export default ExerciseSeriesInTrainigsList;

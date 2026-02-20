import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import BodyPartImage from "../../elements/BodyPartImage";
import {
  ExerciseForm,
  ExerciseTrainingHistoryItem,
} from "../../../../interfaces/Exercise";

import BackIcon from "./../../../../img/icons/backIcon.svg";
import ViewLoading from "../../elements/ViewLoading";
import ExerciseSeriesInTrainigsList from "./ExerciseSeriesInTrainigsList";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import { useHomeContext } from "../HomeContext";
import { PossibleRecordForExercise } from "../../../../interfaces/MainRecords";
import RecordIcon from "./../../../../img/icons/recordsIcon.svg";
import RecordsPopUp from "../records/RecordsPopUp";
import { usePostApiExerciseGetExerciseScoresFromTrainingByExercise } from "../../../../api/generated/exercise/exercise";
import { usePostApiMainRecordsGetRecordOrPossibleRecordInExercise } from "../../../../api/generated/main-records/main-records";
import {
  ExerciseTrainingHistoryItemDto,
  PossibleRecordForExerciseDto,
} from "../../../../api/generated/model";
import { BodyParts } from "../../../../enums/BodyParts";

interface ExerciseDetailsProps {
  exercise: ExerciseForm;
  goBack: () => void;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  exercise,
  goBack,
}) => {
  const { t } = useTranslation();
  const [exerciseSeriesDetails, setExerciseSeriesDetails] = useState<
    ExerciseTrainingHistoryItemDto[]
  >([]);
  const [exerciseRecord, setExerciseRecord] =
    useState<PossibleRecordForExerciseDto>();

  const [isRecordDialogShown, setIsRecordDialogShown] =
    useState<boolean>(false);
  const { toggleMenuButton } = useHomeContext();

  const {
    mutate: getScores,
    isPending: isScoresLoading,
  } = usePostApiExerciseGetExerciseScoresFromTrainingByExercise();

  const {
    mutate: getRecord,
  } = usePostApiMainRecordsGetRecordOrPossibleRecordInExercise();

  useEffect(() => {
    getPossibleOrExerciseRecord();
    getExerciseSeriesDetails();
    toggleMenuButton(true);
  }, []);

  const getExerciseSeriesDetails = () => {
    if (!exercise._id) return;
    getScores(
      { data: { exerciseId: exercise._id } },
      {
        onSuccess: (response) => {
          if (response && response.data) {
            const data = response.data as ExerciseTrainingHistoryItemDto[];
            setExerciseSeriesDetails(data);
          }
        },
      }
    );
  };

  const getPossibleOrExerciseRecord = () => {
    if (!exercise._id) return;
    getRecord(
      { data: { exerciseId: exercise._id } },
      {
        onSuccess: (response) => {
          if (response && response.data) {
            const data = response.data as PossibleRecordForExerciseDto;
            setExerciseRecord(data);
          }
        },
      }
    );
  };

  const toggleRecordDialog = async () => {
    setIsRecordDialogShown(!isRecordDialogShown);
    if (isRecordDialogShown) {
      getPossibleOrExerciseRecord();
    }
  };

  if (isRecordDialogShown) {
    return (
      <RecordsPopUp offPopUp={toggleRecordDialog} exerciseId={exercise._id || ""} />
    );
  }

  return (
    <View className="flex flex-col px-2 pt-4 flex-1 " style={{ gap: 16 }}>
      <View className="flex flex-row items-center justify-between">
        <Pressable
          style={{ borderRadius: 10000 }}
          onPress={goBack}
          className="flex items-center justify-center w-8 h-8  bg-secondaryColor "
        >
          <BackIcon />
        </Pressable>
        <View className="flex flex-row items-center" style={{ gap: 8 }}>
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="font-bold text-primaryColor text-xl"
          >
            {exercise.bodyPart?.displayName}
          </Text>
        </View>
        <View></View>
      </View>
      <View
        className="flex flex-col bg-cardColor px-4 py-2 rounded-lg flex-1"
        style={{ gap: 16 }}
      >
        <ScrollView>
          <View className="flex flex-col">
            <View className="flex flex-row justify-center">
              <BodyPartImage bodyPart={exercise.bodyPart?.name as BodyParts} showBig={true} />
            </View>
            <View className="flex flex-col w-full" style={{ gap: 8 }}>
              <View className="flex flex-row justify-between flex-wrap">
                <Text
                  className="text-2xl font-bold text-textColor"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {exercise.name}
                </Text>
                {exerciseRecord && (
                  <View
                    className="flex flex-row items-center"
                    style={{ gap: 4 }}
                  >
                    <RecordIcon />
                    <Text
                      className="font-bold text-base text-primaryColor"
                      style={{ fontFamily: "OpenSans_700Bold" }}
                    >
                      {exerciseRecord.reps}x{exerciseRecord.weight}
                      {exerciseRecord.unit?.displayName}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                className="text-xs font-light text-textColor"
                style={{ fontFamily: "OpenSans_300Light" }}
              >
                {exercise.description}
              </Text>
            </View>
            {isScoresLoading ? (
              <ViewLoading />
            ) : (
              <ExerciseSeriesInTrainigsList
                listOfExerciseSeriesInTrainigs={exerciseSeriesDetails}
              />
            )}
          </View>
        </ScrollView>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <CustomButton
            onPress={toggleRecordDialog}
            buttonStyleSize={ButtonSize.regular}
            buttonStyleType={ButtonStyle.success}
            text={t("common.addRecord")}
            customClasses="flex-1"
          ></CustomButton>
        </View>
      </View>
    </View>
  );
};

export default ExerciseDetails;

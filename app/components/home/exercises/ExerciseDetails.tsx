import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Switch, ScrollView } from "react-native";
import BodyPartImage from "../../elements/BodyPartImage";
import {
  ExerciseForm,
  ExerciseTrainingHistoryItem,
} from "../../../../interfaces/Exercise";

import BackIcon from "./../../../../img/icons/backIcon.svg";
import { useAppContext } from "../../../AppContext";
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

interface ExerciseDetailsProps {
  exercise: ExerciseForm;
  goBack: () => void;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  exercise,
  goBack,
}) => {
  const [exerciseSeriesDetails, setExerciseSeriesDetails] = useState<
    ExerciseTrainingHistoryItem[]
  >([]);
  const [exerciseRecord, setExerciseRecord] =
    useState<PossibleRecordForExercise>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecordDialogShown, setIsRecordDialogShown] =
    useState<boolean>(false);
  const { postAPI } = useAppContext();
  const { toggleMenuButton } = useHomeContext();

  useEffect(() => {
    getPossibleOrExerciseRecord();
    getExerciseSeriesDetails();
    toggleMenuButton(true);
  }, []);

  const getExerciseSeriesDetails = async () => {
    setIsLoading(true);
    await postAPI(
      `/exercise/getExerciseScoresFromTrainingByExercise`,
      (response: ExerciseTrainingHistoryItem[]) => {
        setExerciseSeriesDetails(response);
      },
      { exerciseId: exercise._id }
    );
    setIsLoading(false);
  };

  const getPossibleOrExerciseRecord = async () => {
    await postAPI(
      `/mainRecords/getRecordOrPossibleRecordInExercise`,
      (response: PossibleRecordForExercise) => {
        setExerciseRecord(response);
      },
      { exerciseId: exercise._id }
    );
  };

  const toggleRecordDialog = async () => {
    setIsRecordDialogShown(!isRecordDialogShown);
    if (isRecordDialogShown) {
      await getPossibleOrExerciseRecord();
    }
  };

  if (isRecordDialogShown) {
    return (
      <RecordsPopUp offPopUp={toggleRecordDialog} exerciseId={exercise._id} />
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
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-textColor text-base"
          >
            Body part:
          </Text>
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="font-bold text-primaryColor text-xl"
          >
            {exercise.bodyPart}
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
              <BodyPartImage bodyPart={exercise.bodyPart} showBig={true} />
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
                      {exerciseRecord.unit}
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
            {isLoading ? (
              <ViewLoading />
            ) : (
              <ExerciseSeriesInTrainigsList
                listOfExerciseSeriesInTrainigs={exerciseSeriesDetails}
              />
            )}
          </View>
        </ScrollView>
        <View className="flex flex-row" style={{ gap: 8 }}>
          {/* <CustomButton
            onPress={() => {}}
            buttonStyleSize={ButtonSize.regular}
            buttonStyleType={ButtonStyle.grey}
            text="Add to training day"
            customClasses="flex-1"
          ></CustomButton> */}

          <CustomButton
            onPress={toggleRecordDialog}
            buttonStyleSize={ButtonSize.regular}
            buttonStyleType={ButtonStyle.success}
            text="Add record"
            customClasses="flex-1"
          ></CustomButton>
        </View>
      </View>
    </View>
  );
};

export default ExerciseDetails;

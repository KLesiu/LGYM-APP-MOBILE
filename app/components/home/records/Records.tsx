import { Text, View, ScrollView, Pressable, Image } from "react-native";
import { useCallback, useEffect, useState } from "react";
import RecordsPopUp from "./RecordsPopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "../../elements/ViewLoading";
import { MainRecordsLast } from "./../../../../interfaces/MainRecords";

import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import React from "react";
import ConfirmDialog from "../../elements/ConfirmDialog";
import { useAppContext } from "../../../AppContext";
import { useHomeContext } from "../HomeContext";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import RecordsItem from "./RecordsItem";

interface RecordsProps {}

const Records: React.FC<RecordsProps> = () => {
  const [popUp, setPopUp] = useState<boolean>(false);
  const [records, setRecords] = useState<MainRecordsLast[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(true);
  const [exercise, setExercise] = useState<string | undefined>();
  const [choosenRecord, setChoosenRecord] = useState<
    MainRecordsLast | undefined
  >();
  const [
    isDeleteRecordConfirmationDialogVisible,
    setIsDeleteRecordConfirmationDialogVisible,
  ] = useState<boolean>(false);
  const { userId } = useHomeContext();
  const { getAPI, setErrors } = useAppContext();

  useEffect(() => {
    getRecords();
  }, []);

  const changePopUpValue: VoidFunction = useCallback((): void => {
    setPopUp(false);
    getRecords();
  }, []);

  const showPopUp = useCallback(() => {
    setPopUp(true);
  }, []);

  const updateSettedExerciseRecord = useCallback(
    (exerciseId: string | undefined): void => {
      if (!exerciseId) return;
      setExercise(exerciseId);
      showPopUp();
    },
    []
  );

  const getRecords = async () => {
    try {
      await getAPI(
        `/mainRecords/${userId}/getLastMainRecords`,
        (response: MainRecordsLast[]) => setRecords(response),
        undefined,
        false
      );
    } finally {
      setViewLoading(false);
    }
  };

  const deleteRecord = async () => {
    if (!choosenRecord) return;
    setViewLoading(true);
    try {
      await getAPI(
        `/mainRecords/${choosenRecord._id}/deleteMainRecord`,
        async () => await getRecords()
      );
    } finally {
      deleteDialogVisible(false);
      setViewLoading(false);
    }
  };

  const deleteDialogVisible = useCallback(
    (visible: boolean, record?: MainRecordsLast) => {
      if (visible) setChoosenRecord(record);
      else setChoosenRecord(undefined);
      setIsDeleteRecordConfirmationDialogVisible(visible);
    },
    []
  );

  return (
    <BackgroundMainSection>
      <View className="flex flex-col h-full w-full" style={{ gap: 8 }}>
        {viewLoading ? (
          <ViewLoading />
        ) : (
          <View className="flex flex-col p-4" style={{ gap: 16 }}>
            <View className="flex flex-row justify-between items-center">
              <Text
                className="text-textColor  text-base "
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                Your records:
              </Text>
              <CustomButton
                text="Add new records"
                onPress={() => {
                  setExercise(undefined);
                  showPopUp();
                }}
                textSize="text-sm"
                buttonStyleType={ButtonStyle.success}
                buttonStyleSize={ButtonSize.long}
              />
            </View>
            <ScrollView
              className="w-full h-full"
              contentContainerStyle={{ padding: 8 }}
            >
              {records && records.length ? (
                <View className="flex flex-col w-full" style={{ gap: 8 }}>
                  {records.map((record) => <RecordsItem key={record._id}  record={record} updateSettedExerciseRecord={updateSettedExerciseRecord} deleteDialogVisible={deleteDialogVisible} />)}
                </View>
              ) : (
                <></>
              )}
            </ScrollView>
          </View>
        )}

        <ConfirmDialog
          visible={isDeleteRecordConfirmationDialogVisible}
          title={`Delete: ${
            choosenRecord ? choosenRecord.exerciseDetails.name : ""
          }`}
          message={`Are you sure you want to delete?`}
          onConfirm={deleteRecord}
          onCancel={() => deleteDialogVisible(false)}
        />
      </View>
      {popUp && (
        <RecordsPopUp offPopUp={changePopUpValue} exerciseId={exercise} />
      )}
    </BackgroundMainSection>
  );
};

export default Records;

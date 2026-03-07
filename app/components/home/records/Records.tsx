import { Text, View, ScrollView } from "react-native";
import { useCallback, useEffect, useState } from "react";
import RecordsPopUp from "./RecordsPopUp";
import ViewLoading from "../../elements/ViewLoading";

import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import React from "react";
import ConfirmDialog from "../../elements/ConfirmDialog";
import { useHomeContext } from "../HomeContext";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import RecordsItem from "./RecordsItem";
import { FontWeights } from "../../../../enums/FontsProperties";
import {
  useGetApiMainRecordsIdGetLastMainRecords,
  getApiMainRecordsIdDeleteMainRecord,
  getGetApiMainRecordsIdGetLastMainRecordsQueryKey,
  getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey,
} from "../../../../api/generated/main-records/main-records";
import { MainRecordsLastDto } from "../../../../api/generated/model";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

interface RecordsProps {}

const Records: React.FC<RecordsProps> = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [popUp, setPopUp] = useState<boolean>(false);
  const [exercise, setExercise] = useState<string | undefined>();
  const [choosenRecord, setChoosenRecord] = useState<
    MainRecordsLastDto | undefined
  >();
  const [
    isDeleteRecordConfirmationDialogVisible,
    setIsDeleteRecordConfirmationDialogVisible,
  ] = useState<boolean>(false);
  const { userId } = useHomeContext();

  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    refetch: refetchRecords,
  } = useGetApiMainRecordsIdGetLastMainRecords(userId, {
    query: {
      enabled: !!userId,
      refetchOnMount: "always",
    },
  });

  const refreshRecords = useCallback(async (): Promise<void> => {
    if (!userId) return;

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetApiMainRecordsIdGetLastMainRecordsQueryKey(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey(userId),
      }),
    ]);

    await refetchRecords();
  }, [queryClient, refetchRecords, userId]);

  useEffect(() => {
    if (!userId) return;
    void refreshRecords();
  }, [refreshRecords, userId]);

  const changePopUpValue: VoidFunction = useCallback((): void => {
    setPopUp(false);
    void refreshRecords();
  }, [refreshRecords]);

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

  const deleteRecord = async () => {
    if (!choosenRecord || !choosenRecord._id) return;
    try {
      await getApiMainRecordsIdDeleteMainRecord(choosenRecord._id);
      await refreshRecords();
    } finally {
      deleteDialogVisible(false);
    }
  };

  const deleteDialogVisible = useCallback(
    (visible: boolean, record?: MainRecordsLastDto) => {
      if (visible) setChoosenRecord(record);
      else setChoosenRecord(undefined);
      setIsDeleteRecordConfirmationDialogVisible(visible);
    },
    []
  );

  return (
    <BackgroundMainSection>
      <View className="flex flex-col h-full w-full" style={{ gap: 8 }}>
        {isRecordsLoading ? (
          <ViewLoading />
        ) : (
          <View className="flex flex-col p-4" style={{ gap: 16 }}>
            <View className="flex flex-row justify-between items-center">
              <Text
                className="text-textColor  text-base "
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t('records.yourRecords')}
              </Text>
              <CustomButton
                text={t('records.addNewRecords')}
                onPress={() => {
                  setExercise(undefined);
                  showPopUp();
                }}
                buttonStyleType={ButtonStyle.success}
                textWeight={FontWeights.bold}
                buttonStyleSize={ButtonSize.long}
              />
            </View>
            <ScrollView
              className="w-full h-full"
              contentContainerStyle={{ padding: 8 }}
            >
              {recordsData && recordsData.data && Array.isArray(recordsData.data) ? (
                <View className="flex flex-col w-full" style={{ gap: 8 }}>
                  {recordsData.data.map((record) => (
                    <RecordsItem
                      key={record._id}
                      record={record}
                      updateSettedExerciseRecord={updateSettedExerciseRecord}
                      deleteDialogVisible={deleteDialogVisible}
                    />
                  ))}
                </View>
              ) : (
                <></>
              )}
            </ScrollView>
          </View>
        )}

        <ConfirmDialog
          visible={isDeleteRecordConfirmationDialogVisible}
          title={t('records.deleteConfirmTitle', {
            name: choosenRecord?.exerciseDetails?.name || ''
          })}
          message={t('records.deleteConfirmMessage')}
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

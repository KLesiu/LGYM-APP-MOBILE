import { Text, View, ScrollView, Pressable, Image } from "react-native";
import { useCallback, useEffect, useState } from "react";
import RecordsPopUp from "./RecordsPopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "../../elements/ViewLoading";
import { MainRecordsLast } from "./../../../../interfaces/MainRecords";
import RemoveIcon from "./../../../../img/icons/deleteIcon.svg";
import ProgressIcon from "./../../../../img/icons/progressIcon.svg";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import React from "react";
import ConfirmDialog from "../../elements/ConfirmDialog";
import { useAppContext } from "../../../AppContext";
import { useHomeContext } from "../HomeContext";

interface RecordsProps {
  toggleMenuButton: (hide: boolean) => void;
}

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
  const {userId} = useHomeContext();
  const {getAPI,setErrors} = useAppContext();

  useEffect(() => {
    getRecords();
  }, []);

  const chagePopUpValue: VoidFunction = useCallback((): void => {
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
    try{
      await getAPI(`/mainRecords/${userId}/getLastMainRecords`,(response:MainRecordsLast[])=>setRecords(response),undefined,false);
    }finally{
      setViewLoading(false);
    }
  };

  const deleteRecord = async () => {
    if (!choosenRecord) return;
    setViewLoading(true);
    try{
      await getAPI(`/mainRecords/${choosenRecord._id}/deleteMainRecord`,async()=>await getRecords())
    }finally{
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

  return popUp ? (
    <RecordsPopUp offPopUp={chagePopUpValue} exerciseId={exercise} />
  ) : (
    <View
      style={{ gap: 16 }}
      className="flex flex-col items-center w-full h-full"
    >
      {viewLoading ? (
        <ViewLoading />
      ) : (
        <ScrollView
          className="w-full h-full"
          contentContainerStyle={{ padding: 10 }}
        >
          {records && records.length ? (
            <View className="flex flex-col w-full" style={{ gap: 8 }}>
              {records.map((record) => (
                <View
                  style={{ borderRadius: 8 }}
                  key={record._id}
                  className="w-full bg-[#282828] p-4 smallPhone:p-3 "
                >
                  <View className="flex flex-row justify-between">
                    <Text
                      style={{
                        fontFamily: "OpenSans_700Bold",
                      }}
                      className="text-xl smallPhone:text-base font-bold text-primaryColor"
                    >
                      {record.exerciseDetails.name}
                    </Text>
                    <View style={{ gap: 16 }} className="flex flex-row">
                      <CustomButton
                        buttonStyleSize={ButtonSize.none}
                        onPress={() =>
                          updateSettedExerciseRecord(record.exerciseDetails._id)
                        }
                        customSlots={[<ProgressIcon />]}
                      />
                      <CustomButton
                        buttonStyleSize={ButtonSize.none}
                        onPress={() => deleteDialogVisible(true, record)}
                        customSlots={[<RemoveIcon />]}
                      />
                    </View>
                  </View>

                  <Text
                    style={{ fontFamily: "OpenSans_400Regular" }}
                    className="text-base smallPhone:text-sm text-white"
                  >
                    Weight: {record.weight} {record.unit}
                  </Text>
                  <Text
                    style={{ fontFamily: "OpenSans_400Regular" }}
                    className="text-base smallPhone:text-sm text-white"
                  >
                    Date: {new Date(record.date).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <></>
          )}
        </ScrollView>
      )}
      <CustomButton
        text="Add new records"
        onPress={() => {
          setExercise(undefined);
          showPopUp();
        }}
        width="w-full"
        buttonStyleType={ButtonStyle.success}
      />
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
  );
};

export default Records;

import { Text, View, ScrollView, Pressable, Image } from "react-native";
import { useEffect, useState } from "react";
import RecordsPopUp from "./RecordsPopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "../../elements/ViewLoading";
import { MainRecordsLast } from "../../../interfaces/MainRecords";
import RemoveIcon from "./../../../img/icons/remove.png";
import ProgressIcon from "./../../../img/icons/progress.png";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";

interface RecordsProps {
  toggleMenuButton: (hide: boolean) => void;
}

const Records: React.FC<RecordsProps> = () => {
  const [popUp, setPopUp] = useState<boolean>(false);
  const [records, setRecords] = useState<MainRecordsLast[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(true);
  const [exercise, setExercise] = useState<string | undefined>();

  useEffect(() => {
    getRecords();
  }, []);

  const chagePopUpValue: VoidFunction = (): void => {
    setPopUp(false);
    getRecords();
  };
  const showPopUp = () => {
    setPopUp(true);
  };
  const updateSettedExerciseRecord = (exerciseId: string | undefined): void => {
    if (!exerciseId) return;
    setExercise(exerciseId);
    showPopUp();
  };
  const getRecords = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/mainRecords/${id}/getLastMainRecords`
    );
    const result = await response.json();
    setRecords(result);
    setViewLoading(false);
  };
  const deleteRecord = async (recordId: string | undefined) => {
    if (!recordId) return;
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/mainRecords/${recordId}/deleteMainRecord`
    )
    await response.json();
    await getRecords();
  };
  return (
    <View className="flex  flex-1 relative w-full  bg-[#121212]">
      {popUp ? (
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
                      className="w-full bg-[#282828]  p-4 "
                    >
                      <View className="flex flex-row justify-between">
                        <Text
                          style={{
                            fontFamily: "OpenSans_700Bold",
                          }}
                          className="text-xl font-bold text-[#94e798]"
                        >
                          {record.exerciseDetails.name}
                        </Text>
                        <View style={{ gap: 16 }} className="flex flex-row">
                          <CustomButton
                            buttonStyleSize={ButtonSize.none}
                            onPress={() =>
                              updateSettedExerciseRecord(
                                record.exerciseDetails._id
                              )
                            }
                            customSlots={[
                              <Image
                                className="w-6 h-6"
                                source={ProgressIcon}
                              />,
                            ]}
                          />
                          <CustomButton
                            buttonStyleSize={ButtonSize.none}
                            onPress={() => deleteRecord(record._id)}
                            customSlots={[
                              <Image className="w-6 h-6" source={RemoveIcon} />,
                            ]}
                          />
                        </View>
                      </View>

                      <Text
                        style={{ fontFamily: "OpenSans_400Regular" }}
                        className="text-base text-white"
                      >
                        Weight: {record.weight} {record.unit}
                      </Text>
                      <Text
                        style={{ fontFamily: "OpenSans_400Regular" }}
                        className="text-base text-white"
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
        </View>
      )}
    </View>
  );
};

export default Records;

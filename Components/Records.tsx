import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import RecordsPopUp from "./RecordsPopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "./ViewLoading";

const Records: React.FC = () => {
  const [deadLift, setDeadLift] = useState<number>();
  const [squat, setSquat] = useState<number>();
  const [benchPress, setBenchPress] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [popUp, setPopUp] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(true);
  useEffect(() => {
    getDataFromStorage();
  }, [popUp]);

  const chagePopUpValue: VoidFunction = (): void => {
    setPopUp(false);
  };
  const getDataFromStorage = async (): Promise<void> => {
    const dl = await AsyncStorage.getItem("dl");
    const sq = await AsyncStorage.getItem("sq");
    const bp = await AsyncStorage.getItem("bp");
    setDeadLift(dl ? parseFloat(dl!) : 0);
    setBenchPress(bp ? parseFloat(bp!) : 0);
    setSquat(sq ? parseFloat(sq!) : 0);
    setTotal(parseFloat(dl!) + parseFloat(sq!) + parseFloat(bp!));
    setViewLoading(false);
  };
  return (
    <View className="bg-[#131313] relative">
      {popUp ? (
        <RecordsPopUp offPopUp={chagePopUpValue} />
      ) : (
        <View className="flex flex-col  px-1">
          <ScrollView className="w-full smh:h-24 xsmh:h-48 mdh:h-72">
            <View className="flex flex-row py-2 pl-6 justify-between items-center m-0">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light leading-4 text-sm"
              >
                Dead Lift
              </Text>
              <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
                <Text
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className="text-gray-200/80 font-base leading-4 text-md"
                >
                  {deadLift || 0} kg
                </Text>
              </View>
            </View>
            <View className="flex flex-row py-2 pl-6 justify-between items-center m-0">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light leading-4 text-sm"
              >
                Squat
              </Text>
              <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
                <Text
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className="text-gray-200/80 font-base leading-4 text-md"
                >
                  {squat || 0} kg
                </Text>
              </View>
            </View>
            <View className="flex flex-row py-2 pl-6 justify-between items-center m-0">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light leading-4 text-sm"
              >
                Bench Press
              </Text>
              <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
                <Text
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className="text-gray-200/80 font-base leading-4 text-md"
                >
                  {benchPress || 0} kg
                </Text>
              </View>
            </View>
          </ScrollView>
          <View className="flex flex-row py-2 pl-6 justify-between items-center m-0">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-white font-bold text-lg"
            >
              Summary
            </Text>
            <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
              <Text
                style={{ fontFamily: "OpenSans_700Bold" }}
                className="text-[#4CD964] font-bold text-lg"
              >
                {total || 0} kg
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setPopUp(true)}
            className="w-full h-12 rounded-lg py-2 px-3  m-0  bg-[#4CD964] flex justify-center items-center"
          >
            <Text
              className="text-lg text-black"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Update Records
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default Records;

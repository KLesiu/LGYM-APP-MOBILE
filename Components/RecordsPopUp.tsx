import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import RecordsPopUpProps from "./props/RecordsPopUpProps";
import ErrorMsg from "./types/ErrorMsg";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const RecordsPopUp: React.FC<RecordsPopUpProps> = (props) => {
  const [error, setError] = useState<ErrorMsg>();
  const [benchPressValue, setBenchPressValue] = useState<string>();
  const [deadLiftValue, setDeadLiftValue] = useState<string>();
  const [squatValue, setSquatValue] = useState<string>();
  const setRecords = async (): Promise<void> => {
    const dlValue = parseFloat(deadLiftValue!);
    const sqValue = parseFloat(squatValue!);
    const bpValue = parseFloat(benchPressValue!);
    const id = await AsyncStorage.getItem("id");
    const response: string = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/userRecords`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          sq: sqValue || 0,
          dl: dlValue || 0,
          bp: bpValue || 0,
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res.msg);
    if (response === "Updated") {
      await AsyncStorage.setItem("dl", `${dlValue}`);
      await AsyncStorage.setItem("sq", `${sqValue}`);
      await AsyncStorage.setItem("bp", `${bpValue}`);
      props.offPopUp();
    }
  };
  return (
    <View className="w-full  flex flex-col items-center justify-center bg-[#000000f4] ">
      <View className="flex flex-row py-2 pl-6 justify-between items-center m-0 w-full px-2">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-gray-200/80 font-light leading-4 text-sm"
        >
          DeadLift:
        </Text>
        <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
          <TextInput
            onChangeText={(text: string | "") => setDeadLiftValue(text)}
            className="text-gray-200/80 font-base h-full w-full px-4  leading-4 text-md "
          />
        </View>
      </View >
      <View  className="flex flex-row py-2 pl-6 justify-between items-center m-0 w-full px-2">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-gray-200/80 font-light leading-4 text-sm"
        >
          Squat:
        </Text>
        <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
          <TextInput
            onChangeText={(text: string | "") => setSquatValue(text)}
            className="text-gray-200/80 font-base h-full px-4 w-full leading-4 text-md"
          />
        </View>
      </View>
      <View  className="flex flex-row py-2 pl-6 justify-between items-center m-0 w-full px-2">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-gray-200/80 font-light leading-4 text-sm"
        >
          BenchPress:
        </Text>
        <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
          <TextInput
            onChangeText={(text: string | "") => setBenchPressValue(text)}
            className="  text-gray-200/80 h-full w-full px-4 font-base leading-4 text-md "
          />
        </View>
      </View>

      <Pressable
        onPress={setRecords}
        className="h-20 w-80 rounded-lg py-4  px-2 m-0  bg-[#4CD964] flex justify-center items-center mt-4" 
      >
        <Text className="text-xs w-full text-center text-white"
              style={{ fontFamily: "OpenSans_700Bold" }}>
          Update!
        </Text>
      </Pressable>
      <Text style={{ fontFamily: "OpenSans_700Bold" }}>
        {error ? error.msg : ""}
      </Text>
    </View>
  );
};
export default RecordsPopUp;

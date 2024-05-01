import { Text, View, TouchableOpacity, TextInput } from "react-native";
import RecordsPopUpProps from "./props/RecordsPopUpProps";
import ErrorMsg from "./types/ErrorMsg";
import { useState} from "react";
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
      `${process.env.REACT_APP_BACKEND}/api/userRecords`,
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
    <View className="absolute w-full h-full top-0 flex flex-col items-center justify-center bg-[#000000f4] ">
      <Text className="text-3xl text-white" style={{ fontFamily: "OpenSans_700Bold"}}>
        Set Your Records!
      </Text>
      <Text style={{ fontFamily: "OpenSans_700Bold"}} className="text-xl mt-4 text-white">
        DeadLift:
      </Text>
      <TextInput
        
        onChangeText={(text: string | "") => setDeadLiftValue(text)}
        className="rounded-xl h-[6%] text-base w-4/5 border-[#3c3c3c] text-white border-2 mt-1 pl-4"
      />
      <Text style={{ fontFamily: "OpenSans_700Bold"}} className="text-xl mt-4 text-white">
        Squat:
      </Text>
      <TextInput
        
        onChangeText={(text: string | "") => setSquatValue(text)}
        className="rounded-xl h-[6%] text-base w-4/5 border-[#3c3c3c] text-white border-2 mt-1 pl-4"
      />
      <Text style={{ fontFamily: "OpenSans_700Bold"}} className="text-xl mt-4 text-white">
        BenchPress:
      </Text>
      <TextInput
        
        onChangeText={(text: string | "") => setBenchPressValue(text)}
        className="rounded-xl h-[6%] text-base w-4/5 border-[#3c3c3c] text-white border-2 mt-1 pl-4"
      />
      <TouchableOpacity
        onPress={setRecords}
        className="w-1/2 h-[10%] rounded-xl bg-[#aab4bd] flex justify-center items-center mt-[5%]"
        
      >
        <Text style={{ fontFamily: "OpenSans_700Bold", fontSize: 30 }}>
          Update!
        </Text>
      </TouchableOpacity>
      <Text style={{ fontFamily: "OpenSans_700Bold" }}>
        {error ? error.msg : ""}
      </Text>
    </View>
  );
};
export default RecordsPopUp;

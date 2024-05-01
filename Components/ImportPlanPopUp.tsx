import { TextInput, TouchableOpacity, View, Text } from "react-native";
import ImportPlanPopUpProps from "./props/ImportPlanPopUpProps";
import { useState } from "react";
const ImportPlanPopUp: React.FC<ImportPlanPopUpProps> = (props) => {
  const [userId, setUserId] = useState<string>();
  const importPlan = (): void => {
    props.setImportPlan(userId as string);
  };
  return (
    <View className="absolute w-full h-full top-0 flex flex-col items-center justify-center bg-[#000000f4] p-6 z-50">
      <Text className="text-white text-[20px] text-center" style={{ fontFamily: "Teko_700Bold"}}>
        If you want to copy someone plan you need to have a userId!
      </Text>
      <TextInput
        className="rounded-xl h-[6%] text-[15px] w-4/5 border-[#3c3c3c] border-[2px] mt-[5px] pl-[15px] text-white"
        placeholder="Username"
        onChangeText={(text: string | "") => setUserId(text)}
      ></TextInput>
      <TouchableOpacity
      className="w-1/2 h-[10%] rounded-xl bg-[#aab4bd] flex justify-center items-center mt-[5%]"

        onPress={() => importPlan()}
      >
        <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>COPY!</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ImportPlanPopUp;

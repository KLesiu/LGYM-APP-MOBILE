import { TextInput, TouchableOpacity, View, Text, Pressable } from "react-native";
import ImportPlanPopUpProps from "./props/ImportPlanPopUpProps";
import { useState } from "react";
const ImportPlanPopUp: React.FC<ImportPlanPopUpProps> = (props) => {
  const [userId, setUserId] = useState<string>();
  const importPlan = (): void => {
    props.setImportPlan(userId as string);
  };
  return (
    <View className="absolute w-full h-full top-0 flex flex-col items-center justify-center bg-[#000000f4] p-6 z-50">
      <Text className="text-white text-[20px] text-center" style={{ fontFamily: "OpenSans_700Bold"}}>
        If you want to copy someone plan you need to have a username!
      </Text>
      <TextInput
        className="rounded-xl h-12 text-[15px] w-4/5 border-[#3c3c3c] border-[2px] mt-[5px] pl-[15px] text-white"
        placeholder="Username"
        onChangeText={(text: string | "") => setUserId(text)}
      ></TextInput>
      <Pressable
      className="w-40 h-12 rounded-xl bg-green-500 flex justify-center items-center mt-[5%]"

        onPress={() => importPlan()}
      >
        <Text className="text-white text-2xl" style={{ fontFamily: "OpenSans_700Bold"}}>COPY!</Text>
      </Pressable>
    </View>
  );
};
export default ImportPlanPopUp;

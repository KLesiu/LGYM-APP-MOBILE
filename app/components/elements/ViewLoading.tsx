import { Text, View } from "react-native";
import React from "react";
const ViewLoading: React.FC = () => {

  return (
    <View className=" w-full h-full bg-[#ffff] absolute top-0  flex flex-row justify-center items-center z-50">
      <Text
        className="text-xl text-[#121212]"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Loading...
      </Text>
    </View>
  );
};
export default ViewLoading;
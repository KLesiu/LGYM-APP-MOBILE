import { Text, View } from "react-native";
import React from "react";
const ViewLoading: React.FC = () => {

  return (
    <View className=" w-full h-full bg-[#28292a] absolute top-0  flex flex-row justify-center items-center z-[5]">
      <Text
        className="text-xl text-white"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Loading...
      </Text>
    </View>
  );
};
export default ViewLoading;
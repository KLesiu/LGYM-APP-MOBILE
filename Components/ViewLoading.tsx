import { Text, View } from "react-native";
import React, { useEffect } from "react";
const ViewLoading: React.FC = () => {

  return (
    <View className=" w-full h-full bg-[#28292a] absolute top-0 right-[-16px] flex flex-row justify-center items-center">
      <Text
        className="text-[30] text-white"
        style={{ fontFamily: "Teko_700Bold" }}
      >
        Loading...
      </Text>
    </View>
  );
};
export default ViewLoading;
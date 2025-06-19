import { View, ActivityIndicator, Text } from "react-native";
import React from "react";

const ViewLoading: React.FC = () => {
  return (
    <View className="w-full top-0 flex flex-row justify-center items-center z-[5] py-4 space-x-2">
      <ActivityIndicator size="small" color="#ffffff" />
      <Text
        className="text-white text-base"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Loading...
      </Text>
    </View>
  );
};

export default ViewLoading;

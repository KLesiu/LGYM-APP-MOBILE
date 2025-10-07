import { Text, View } from "react-native";
import React from "react";
import { useAppContext } from "../../AppContext";

const MiniLoading: React.FC = () => {
  const { isLoading } = useAppContext();
  return isLoading ? (
    <View className="w-full flex flex-row items-center justify-center mt-5">
      <Text
        className="text-xl text-textColor"
        style={{ fontFamily: "Teko_700Bold" }}
      >
        Loading...
      </Text>
    </View>
  ) : (
    <></>
  );
};
export default MiniLoading;

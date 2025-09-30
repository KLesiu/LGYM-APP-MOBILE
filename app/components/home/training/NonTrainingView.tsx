import React from "react";
import { View,Text } from "react-native";


const NonTrainingView: React.FC = () => {
  return (
    <View className="w-full h-full flex flex-row justify-center text-center text-2xl items-center p-4">
      <Text
        className="text-white text-xl text-center"
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        You cant add training, because you dont have plan!
      </Text>
    </View>
  );
};


export default NonTrainingView;

import React from "react";
import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import { AppConfigInfo } from "../../../interfaces/AppConfigInfo";
import CustomButton, { ButtonSize, ButtonStyle } from "./CustomButton";
import logoLGYM from "./../../../assets/logoLGYMNew.png";

interface UpdateDialogProps {
  config: AppConfigInfo;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ config }) => {
  const handleUpdatePress = () => {
    Linking.openURL(config.updateUrl).catch(() =>
      alert("Could not open the update link.")
    );
  };

  return (
    <View className="flex-1  items-center justify-center  bg-bgColor rounded-lg shadow-lg px-4 py-4" style={{ gap: 32 }}>
      <View className="w-72 h-72 flex items-center justify-center">
        <Image source={logoLGYM} className="w-full h-full" />
      </View>
      <View className="flex flex-col items-center justify-center">
        <Text
          className="text-textColor text-xl"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Update Required
        </Text>

        <Text
          className="text-textColor text-base text-center"
          style={{ fontFamily: "OpenSans_300Light" }}
        >
          A new version ({config.latestVersion}) is available and required to
          continue using the app.
        </Text>
      </View>

      {config.releaseNotes && (
        <View className="flex flex-col border border-white p-4 rounded-lg ">
          <Text
            className="text-textColor text-base text-center"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            What's new:
          </Text>
          <Text
            className="text-textColor text-sm text-center"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            {config.releaseNotes}
          </Text>
        </View>
      )}
      <CustomButton
        onPress={handleUpdatePress}
        buttonStyleSize={ButtonSize.long}
        buttonStyleType={ButtonStyle.success}
        text="Update now"
      ></CustomButton>
    </View>
  );
};

export default UpdateDialog;

import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { PlanForm } from "../../../../interfaces/Plan";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { useAppContext } from "../../../AppContext";
import Ionicons from "react-native-vector-icons/Ionicons";

import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { toastConfig } from "../../../../helpers/toastConfig";

interface PlanShareDialogProps {
  visible: boolean;
  onCancel: () => void;
  plan: PlanForm;
}

const PlanShareDialog: React.FC<PlanShareDialogProps> = ({
  visible,
  onCancel,
  plan,
}) => {
  const { postAPI } = useAppContext();
  const [currentShareCode, setCurrentShareCode] = useState<string | null>(
    plan.shareCode ?? null
  );

  const copyToClipboard = async () => { 
    if (!currentShareCode) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No code available to copy.'
        });
        return;
    }

    await Clipboard.setStringAsync(currentShareCode);
    
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: 'Code copied to clipboard'
    });
  };

  const generateShareCode = async () => {
    await postAPI(
      "/generateShareCode",
      (result: string) => {
        setCurrentShareCode(result);
      },
      { planId: plan._id }
    );
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex flex-1  bg-black/50 items-center justify-center">
        <View
          className="flex flex-col bg-cardColor rounded-lg  w-full p-4 items-center"
          style={{ gap: 16 }}
        >
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-2xl font-bold text-primaryColor"
          >
            Share your plan!
          </Text>
          <View
            className="flex justify-center items-center p-4 bg-secondaryColor rounded-lg flex-row"
            style={{ gap: 8 }}
          >
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-xl font-bold text-white"
            >
              {currentShareCode ?? "No share code available"}
            </Text>
            {currentShareCode &&<Pressable onPress={copyToClipboard} hitSlop={8}>
              <Ionicons name="copy-outline" size={24} color="white" />
            </Pressable>}
          </View>
          <View className="flex-row w-full" style={{ gap: 8 }}>
            <CustomButton
              text="Cancel"
              onPress={onCancel}
              buttonStyleType={ButtonStyle.cancel}
              width="flex-1"
            />
            <CustomButton
              text="Generate new code"
              buttonStyleType={ButtonStyle.success}
              onPress={generateShareCode}
              width="flex-1"
            />
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};
export default PlanShareDialog;
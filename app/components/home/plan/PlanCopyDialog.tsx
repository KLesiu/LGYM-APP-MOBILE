import React, { useState } from "react";
import { Modal, View, Pressable, Text, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "../../../../helpers/toastConfig";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";

interface PlanCopyDialogProps {
  visible: boolean;
  onCancel: () => void;
  copyPlan: (code: string) => Promise<void>;
}

const PlanCopyDialog: React.FC<PlanCopyDialogProps> = ({
  visible,
  onCancel,
  copyPlan,
}) => {
  const [code, setCode] = useState<string>("");
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
            Copy plan!
          </Text>

          <View style={{ gap: 4 }} className="flex w-full flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="  text-textColor  text-base smallPhone:text-sm"
              >
                Code:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-textColor  "
              onChangeText={(text: string) => setCode(text)}
              value={code}
            />
          </View>
          <View className="flex-row w-full" style={{ gap: 8 }}>
            <CustomButton
              text="Cancel"
              onPress={onCancel}
              buttonStyleType={ButtonStyle.cancel}
              width="flex-1"
            />
            <CustomButton
              text="Copy plan"
              buttonStyleType={ButtonStyle.success}
              onPress={()=> copyPlan(code)}
              width="flex-1"
            />
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};

export default PlanCopyDialog;

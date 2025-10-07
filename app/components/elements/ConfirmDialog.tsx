import React from "react";
import { Modal, View, Text} from "react-native";
import CustomButton, { ButtonStyle } from "./CustomButton";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (
  props: ConfirmDialogProps
) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={props.visible}
      onRequestClose={props.onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-72 p-4 bg-[#282828] rounded-lg items-center" style={{ gap: 16 }}>
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-2xl font-bold text-primaryColor"
          >
            {props.title}
          </Text>
          <Text
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="text-lg text-textColor"
          >
            {props.message}
          </Text>
          <View className="flex-row justify-between w-full" style={{ gap: 8 }}>
            <CustomButton
              width="flex-1"
              onPress={props.onCancel}
              buttonStyleType={ButtonStyle.cancel}
              text="Cancel"
            />
            <CustomButton
              width="flex-1"
              onPress={props.onConfirm}
              buttonStyleType={ButtonStyle.success}
              text="Confirm"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDialog;

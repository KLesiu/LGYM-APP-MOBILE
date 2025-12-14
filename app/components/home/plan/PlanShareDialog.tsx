import React, { useState } from "react";
import { Modal, Text, View } from "react-native";
import { PlanForm } from "../../../../interfaces/Plan";
import CustomButton from "../../elements/CustomButton";
import { useAppContext } from "../../../AppContext";

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
  const [currentShareCode, setCurrentShareCode] = useState<string | null>(plan.shareCode ?? null);

  const generateShareCode = async () => {
    await postAPI("/generateShareCode",(result:string)=>{
        setCurrentShareCode(result);
    },{planId: plan._id});
  };
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex flex-col">
        <Text
          style={{ fontFamily: "OpenSans_700Bold" }}
          className="text-2xl font-bold text-primaryColor"
        >
          Share your plan!
        </Text>

        <Text>{currentShareCode ?? "No share code available"}</Text>

        <CustomButton text="Generate code" onPress={generateShareCode} />
      </View>
    </Modal>
  );
};
export default PlanShareDialog;

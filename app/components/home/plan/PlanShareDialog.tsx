import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { PlanForm } from "../../../../interfaces/Plan";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";

import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { toastConfig } from "../../../../helpers/toastConfig";
import { usePostApiIdShare } from "../../../../api/generated/plan/plan";
import { ShareCodeResponseDto } from "../../../../api/generated/model";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [currentShareCode, setCurrentShareCode] = useState<string | null>(
    plan.shareCode ?? null
  );

  const { mutate: generateShareCode, isPending } = usePostApiIdShare();

  const copyToClipboard = async () => { 
    if (!currentShareCode) {
        Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: t('plans.noCodeToCopy')
        });
        return;
    }

    await Clipboard.setStringAsync(currentShareCode);
    
    Toast.show({
      type: 'success',
      text1: t('plans.copiedTitle'),
      text2: t('plans.codeCopied')
    });
  };

  const handleGenerateShareCode = () => {
    if(!plan._id) return;
    
    generateShareCode(
        { id: plan._id },
        {
            onSuccess: (response) => {
                const data = response.data as ShareCodeResponseDto;
                if(data && data.shareCode) {
                    setCurrentShareCode(data.shareCode);
                }
            },
            onError: (error) => {
                console.error("Failed to generate share code", error);
                Toast.show({
                    type: 'error',
                    text1: t('common.error'),
                    text2: t('plans.shareCodeGenerateFailed')
                });
            }
        }
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
            {t('plans.shareTitle')}
          </Text>
          <View
            className="flex justify-center items-center p-4 bg-secondaryColor rounded-lg flex-row"
            style={{ gap: 8 }}
          >
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-xl font-bold text-white"
            >
              {currentShareCode ?? t('plans.noShareCode')}
            </Text>
            {currentShareCode &&<Pressable onPress={copyToClipboard} hitSlop={8}>
              <Ionicons name="copy-outline" size={24} color="white" />
            </Pressable>}
          </View>
          <View className="flex-row w-full" style={{ gap: 8 }}>
            <CustomButton
              text={t('common.cancel')}
              onPress={onCancel}
              buttonStyleType={ButtonStyle.cancel}
              width="flex-1"
            />
            <CustomButton
              text={t('plans.generateNewCode')}
              buttonStyleType={ButtonStyle.success}
              onPress={handleGenerateShareCode}
              width="flex-1"
              isLoading={isPending}
            />
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};
export default PlanShareDialog;

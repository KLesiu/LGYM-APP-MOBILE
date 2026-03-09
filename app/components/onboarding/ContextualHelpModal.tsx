import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton, { ButtonStyle } from "../elements/CustomButton";
import type { ContextualHelpContent } from "../../onboarding/tutorialStepsConfig";

export type ContextualHelpMode = "TUTORIAL" | "INFO";

interface ContextualHelpModalProps {
  visible: boolean;
  mode: ContextualHelpMode;
  content: ContextualHelpContent | null;
  onClose: () => void;
  onNext: () => void;
}

const ContextualHelpModal: React.FC<ContextualHelpModalProps> = ({
  visible,
  mode,
  content,
  onClose,
  onNext,
}) => {
  if (!content) {
    return null;
  }

  const buttonText =
    mode === "INFO"
      ? (content.primaryActionLabel ?? "Zamknij")
      : (content.primaryActionLabel ?? "Dalej");

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/75 px-5">
        <View
          className="w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#141414]"
          style={{ elevation: 16 }}
        >
          <LinearGradient
            colors={["#273127", "#141414", "#101010"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="px-5 pb-5 pt-4" style={{ gap: 18 }}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4" style={{ gap: 6 }}>
                  <Text
                    className="text-xs uppercase tracking-[1.4px] text-fifthColor"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    {content.accentLabel ?? (mode === "TUTORIAL" ? "Samouczek" : "Pomoc")}
                  </Text>
                  <Text
                    className="text-2xl text-textColor"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    {content.title}
                  </Text>
                </View>

                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                  <Icon name="close" size={20} color="#F4F4F5" />
                </Pressable>
              </View>

              <View
                className="rounded-2xl border border-white/5 bg-[#1B1B1B] px-4 py-5"
                style={{ gap: 14 }}
              >
                <View
                  className="h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "rgba(32,188,45,0.15)" }}
                >
                  <Icon name={content.iconName} size={30} color="#20BC2D" />
                </View>

                <Text
                  className="text-base leading-6 text-textColor"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {content.description}
                </Text>
              </View>

              <CustomButton
                onPress={onNext}
                buttonStyleType={
                  mode === "TUTORIAL" ? ButtonStyle.success : ButtonStyle.outlineBlack
                }
                text={buttonText}
                width="w-full"
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default ContextualHelpModal;

import React from "react";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

interface DialogProps {
  children: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      className="absolute top-0 left-0 w-full h-full bg-bgColor"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex flex-col w-full h-full items-center" style={{ gap: 16 }}>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Dialog;

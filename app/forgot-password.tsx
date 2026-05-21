import React, { useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect, Stack } from "expo-router";
import { useAppContext } from "./AppContext";
import { useTranslation } from "react-i18next";
import toastService from "./services/toastService";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { setErrors: setAppErrors } = useAppContext();

  useFocusEffect(
    useCallback(() => {
      setAppErrors([]);
      toastService.hide();

      return () => {
        toastService.hide();
      };
    }, [setAppErrors])
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Forgot Password",
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={{ gap: 16, flexGrow: 1 }}
            className="flex items-center flex-col justify-center bg-bgColor p-4"
          >
            <Text
              className="text-textColor text-2xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Forgot Password
            </Text>
            <Text
              className="text-fifthColor text-base text-center"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              This screen will allow users to reset their password by entering their email address.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ForgotPassword;

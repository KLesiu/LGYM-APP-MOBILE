import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter, useFocusEffect, Stack } from "expo-router";
import { useAppContext } from "./AppContext";
import { useTranslation } from "react-i18next";
import toastService from "./services/toastService";
import { usePostApiForgotPassword } from "../api/generated/user/user";
import { getErrorMessage } from "../utils/errorHandler";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import MiniLoading from "./components/elements/MiniLoading";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { setErrors: setAppErrors } = useAppContext();
  const [email, setEmail] = useState<string>("");
  const { mutate, isPending } = usePostApiForgotPassword();

  useFocusEffect(
    useCallback(() => {
      setAppErrors([]);
      toastService.hide();

      return () => {
        toastService.hide();
      };
    }, [setAppErrors])
  );

  const validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toastService.showValidationError(t("auth.emailRequired"));
      return false;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toastService.showValidationError(t("auth.invalidEmail"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateEmail()) return;

    mutate(
      {
        data: {
          email: email.trim(),
        },
      },
      {
        onSuccess: () => {
          router.push("/Login");
        },
        onError: (error: any) => {
          console.error("Forgot password error:", error);
          const errorMessage = getErrorMessage(
            error,
            t("auth.forgotPasswordFailed") || "Failed to process request"
          );
          toastService.showError(errorMessage, t("auth.forgotPasswordFailed"));
        },
      }
    );
  };

  const goToLogin = () => {
    router.push("/Login");
  };

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
              {t("auth.forgotPassword") || "Forgot Password"}
            </Text>
            <Text
              className="text-fifthColor text-base text-center"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("auth.forgotPasswordDescription") ||
                "Enter your email address and we'll send you instructions to reset your password."}
            </Text>

            <View
              className="w-full flex flex-col items-center justify-start"
              style={{ gap: 8 }}
            >
              <View className="flex flex-col w-full" style={{ gap: 8 }}>
                <View className="flex flex-row gap-1">
                  <Text
                    className="text-textColor text-base"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {t("auth.email")}
                  </Text>
                  <Text className="text-redColor">*</Text>
                </View>

                <TextInput
                  onChangeText={(text: string) => setEmail(text)}
                  value={email}
                  style={{
                    fontFamily: "OpenSans_400Regular",
                  }}
                  className="w-full px-2 py-4 bg-secondaryColor rounded-lg text-textColor"
                  autoComplete="email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isPending}
                />
              </View>
            </View>

            <CustomButton
              width="w-full"
              onPress={handleSubmit}
              disabled={isPending}
              buttonStyleType={ButtonStyle.success}
              text={t("auth.sendResetLink") || "Send Reset Link"}
              buttonStyleSize={ButtonSize.xl}
            />

            <View className="flex flex-row items-center justify-center" style={{ gap: 6 }}>
              <Text
                className="text-sm text-fifthColor"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {t("auth.rememberPassword") || "Remember your password?"}
              </Text>
              <Pressable onPress={goToLogin}>
                <Text
                  className="text-sm text-primaryColor"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {t("auth.login")}
                </Text>
              </Pressable>
            </View>

            <MiniLoading />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ForgotPassword;

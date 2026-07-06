import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect, Stack, useLocalSearchParams } from "expo-router";
import { useAppContext } from "./AppContext";
import { useTranslation } from "react-i18next";
import toastService from "./services/toastService";
import { usePostApiResetPassword } from "../api/generated/user/user";
import { getErrorMessage } from "../utils/errorHandler";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import MiniLoading from "./components/elements/MiniLoading";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { setErrors: setAppErrors } = useAppContext();
  const params = useLocalSearchParams();
  const token = typeof params.token === "string" ? params.token : "";

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { mutate, isPending } = usePostApiResetPassword();

  useFocusEffect(
    useCallback(() => {
      setAppErrors([]);
      toastService.hide();

      return () => {
        toastService.hide();
      };
    }, [setAppErrors])
  );

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!token) {
      newErrors.push(t("auth.invalidResetToken"));
    }

    if (!newPassword) {
      newErrors.push(t("auth.passwordRequired"));
    } else if (newPassword.length < 6) {
      newErrors.push(t("auth.passwordLength"));
    }

    if (newPassword !== confirmPassword) {
      newErrors.push(t("auth.passwordsMismatch"));
    }

    if (newErrors.length > 0) {
      toastService.showValidationError(newErrors);
    }

    return newErrors.length === 0;
  };

  const resetPassword = async (): Promise<void> => {
    if (!validate()) return;

    mutate(
      {
        data: {
          token: token,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
      },
      {
        onSuccess: () => {
          toastService.showSuccess(t("auth.passwordResetSuccess"));
          setIsSuccess(true);
        },
        onError: (error: any) => {
          console.error("Reset password error:", error);
          const errorMessage = getErrorMessage(error, t("auth.resetPasswordFailed"));
          toastService.showError(errorMessage, t("auth.resetPasswordFailed"));
        },
      }
    );
  };

  const goToLogin = () => {
    router.push("/Login");
  };

  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword && !!token;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reset Password",
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
              {t("auth.resetPassword")}
            </Text>
            <Text
              className="text-fifthColor text-base text-center"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {isSuccess ? t("auth.youCanNowLogin") : t("auth.resetPasswordDescription")}
            </Text>

            {!token && !isSuccess && (
              <View className="w-full bg-redColor/10 rounded-lg p-4 mt-4">
                <Text className="text-redColor text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
                  {t("auth.invalidResetToken")}
                </Text>
              </View>
            )}

            {!isSuccess ? (
              <>
                <View className="flex flex-col w-full" style={{ gap: 8 }}>
                  <View className="flex flex-row gap-1">
                    <Text
                      className="text-textColor text-base smallPhone:text-sm"
                      style={{ fontFamily: "OpenSans_300Light" }}
                    >
                      {t("auth.newPassword")}
                    </Text>
                    <Text className="text-redColor">*</Text>
                  </View>
                  <TextInput
                    secureTextEntry={true}
                    onChangeText={(text) => setNewPassword(text)}
                    value={newPassword}
                    style={{ fontFamily: "OpenSans_400Regular" }}
                    className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor"
                    editable={!!token}
                  />
                </View>

                <View className="flex flex-col w-full" style={{ gap: 8 }}>
                  <View className="flex flex-row gap-1">
                    <Text
                      className="text-textColor text-base smallPhone:text-sm"
                      style={{ fontFamily: "OpenSans_300Light" }}
                    >
                      {t("auth.confirmPassword")}
                    </Text>
                    <Text className="text-redColor">*</Text>
                  </View>
                  <TextInput
                    secureTextEntry={true}
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    style={{ fontFamily: "OpenSans_400Regular" }}
                    className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor"
                    editable={!!token}
                  />
                </View>

                <CustomButton
                  text={t("auth.resetPassword")}
                  onPress={resetPassword}
                  width="w-full"
                  buttonStyleType={ButtonStyle.success}
                  buttonStyleSize={ButtonSize.xl}
                  disabled={!isFormValid || isPending}
                />
              </>
            ) : (
              <>
                <View className="w-full bg-green-500/10 rounded-lg p-4">
                  <Text
                    className="text-textColor text-center"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("auth.passwordResetSuccess")}
                  </Text>
                </View>
                <CustomButton
                  text={t("auth.backToLogin")}
                  onPress={goToLogin}
                  width="w-full"
                  buttonStyleType={ButtonStyle.success}
                  buttonStyleSize={ButtonSize.xl}
                />
              </>
            )}
            <MiniLoading />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ResetPassword;

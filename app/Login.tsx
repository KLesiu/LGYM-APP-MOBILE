import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MiniLoading from "./components/elements/MiniLoading";
import ShowIcon from "./../img/icons/showIcon.svg";
import HideIcon from "./../img/icons/hideIcon.svg";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import { useRouter, useFocusEffect } from "expo-router";
import { useAppContext } from "./AppContext";
import { usePostApiLogin, postApiLoginResponse } from "../api/generated/user/user";
import { useAuthStore } from "../stores/useAuthStore";
import { getErrorMessage } from "../utils/errorHandler";
import { useTranslation } from "react-i18next";
import type { LoginResponseDto, UserInfoDto } from "../api/generated/model";
import { useOnboarding } from "./onboarding/OnboardingContext";
import toastService from "./services/toastService";
import BrandMark from "./components/branding/BrandMark";

const Login: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

  const { setErrors: setAppErrors, setUserInfo } = useAppContext();
  const { syncTutorialState } = useOnboarding();
  const { mutate, isPending } = usePostApiLogin({
    request: {
      skipAuthRedirect: true,
      headers: {
        "X-Skip-Auth": "true",
      },
    },
  });
  const { setToken, setUser } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      setAppErrors([]);
      toastService.hide();

      return () => {
        toastService.hide();
      };
    }, [setAppErrors])
  );

  const completeLoginSession = useCallback(
    async (loginResponse: LoginResponseDto, title: string): Promise<boolean> => {
      if (!loginResponse.token || !loginResponse.req) {
        toastService.showError(t("auth.invalidResponse"), title);
        return false;
      }

      try {
        const userInfo: UserInfoDto = {
          ...loginResponse.req,
          permissionClaims:
            loginResponse.permissionClaims ??
            loginResponse.req.permissionClaims,
        };

        await AsyncStorage.setItem("token", loginResponse.token);
        await AsyncStorage.setItem("username", userInfo.name || "");
        await AsyncStorage.setItem("id", userInfo._id || "");
        if (userInfo.email) {
          await AsyncStorage.setItem("email", userInfo.email);
        }

        setToken(loginResponse.token);
        setUser(userInfo);
        setUserInfo(userInfo);
        setAppErrors([]);
        await syncTutorialState(Boolean(userInfo.hasActiveTutorials));
        router.push("/Start");
        return true;
      } catch (error) {
        console.error("Error storing credentials:", error);
        toastService.showError(
          t("auth.failedToStoreCredentials"),
          title
        );
        return false;
      }
    },
    [router, setAppErrors, setToken, setUser, setUserInfo, syncTutorialState, t]
  );

  const login = async (): Promise<void> => {
    const normalizedUsername = username?.trim();

    if (!normalizedUsername || !password) {
      toastService.showValidationError(t("auth.usernameAndPasswordRequired"));
      return;
    }

    mutate(
      {
        data: {
          name: normalizedUsername,
          password: password,
        },
      },
      {
        onSuccess: async (response: postApiLoginResponse) => {
          await completeLoginSession(response.data, t("auth.loginFailed"));
        },
        onError: (error: any) => {
          console.error("Login error:", error);
          const errorMessage = getErrorMessage(error, t("auth.loginFailed"));
          toastService.showError(errorMessage, t("auth.loginFailed"));
        },
      }
    );
  };

  const goToPreload = () => {
    router.push("/");
  };

  const goToRegister = () => {
    router.push("/Register");
  };

  const goToForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 overflow-hidden bg-bgColor px-5 pb-8 pt-12">
          <View className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primaryColor opacity-10" />
          <View className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500 opacity-10" />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Powrót"
            onPress={goToPreload}
            className="items-center"
          >
            <BrandMark
              size={82}
              layout="vertical"
              subtitle="System ewidencji treningowej"
            />
          </Pressable>

          <View className="mt-8 rounded-2xl border border-secondaryColor bg-cardColor p-5" style={{ gap: 18 }}>
            <View style={{ gap: 4 }}>
              <Text
                className="text-2xl text-textColor"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t("auth.login")}
              </Text>
              <Text
                className="text-sm leading-5 text-fifthColor"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Wprowadź dane konta, aby przejść do dziennika treningowego.
              </Text>
            </View>

            <View style={{ gap: 14 }}>
              <View style={{ gap: 7 }}>
                <View className="flex-row gap-1">
                  <Text
                    className="text-sm text-textColor"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("auth.username")}
                  </Text>
                  <Text className="text-redColor">*</Text>
                </View>
                <TextInput
                  value={username}
                  onChangeText={(text: string) => setUsername(text)}
                  autoCapitalize="none"
                  autoComplete="username"
                  placeholder={t("auth.username")}
                  placeholderTextColor="#64748B"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className="w-full rounded-xl border border-secondaryColor bg-secondaryColor px-4 py-4 text-textColor"
                />
              </View>

              <View className="relative" style={{ gap: 7 }}>
                <View className="flex-row gap-1">
                  <Text
                    className="text-sm text-textColor"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {t("auth.password")}
                  </Text>
                  <Text className="text-redColor">*</Text>
                </View>
                <TextInput
                  value={password}
                  onChangeText={(text: string) => setPassword(text)}
                  autoComplete="password"
                  placeholder={t("auth.password")}
                  placeholderTextColor="#64748B"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className="w-full rounded-xl border border-secondaryColor bg-secondaryColor px-4 py-4 pr-14 text-textColor"
                  secureTextEntry={secureTextEntry}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Pokaż lub ukryj hasło"
                  className="absolute bottom-1 right-1 h-12 w-12 items-center justify-center"
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  {secureTextEntry ? (
                    <ShowIcon stroke="#F8FAFC" />
                  ) : (
                    <HideIcon stroke="#F8FAFC" />
                  )}
                </Pressable>
              </View>

              <View className="items-end">
                <Pressable onPress={goToForgotPassword}>
                  <Text
                    className="text-sm text-primaryColor"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    {t("auth.forgotPassword")}
                  </Text>
                </Pressable>
              </View>
            </View>

            <CustomButton
              width="w-full"
              onPress={login}
              disabled={isPending}
              buttonStyleType={ButtonStyle.success}
              text={t("auth.login")}
              buttonStyleSize={ButtonSize.xl}
            />

            <View className="flex-row items-center justify-center" style={{ gap: 6 }}>
              <Text
                className="text-sm text-fifthColor"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {t("auth.noAccountQuestion")}
              </Text>
              <Pressable onPress={goToRegister}>
                <Text
                  className="text-sm text-primaryColor"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {t("auth.register")}
                </Text>
              </Pressable>
            </View>
          </View>

          <MiniLoading />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

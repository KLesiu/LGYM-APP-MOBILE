import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import logoLGYM from "./../assets/logoLGYMNewX.png";
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
import type { UserInfoDto } from "../api/generated/model";
import { useOnboarding } from "./onboarding/OnboardingContext";
import toastService from "./services/toastService";

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
          try {
            const loginResponse = response.data;

            if (!("token" in loginResponse) || !loginResponse.token) {
              toastService.showError(t("auth.invalidResponse"), t("auth.loginFailed"));
              return;
            }

            if (!("req" in loginResponse) || !loginResponse.req) {
              toastService.showError(t("auth.invalidResponse"), t("auth.loginFailed"));
              return;
            }

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
          } catch (error) {
            console.error("Error storing credentials:", error);
            toastService.showError(
              t("auth.failedToStoreCredentials"),
              t("auth.loginFailed")
            );
          }
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
        <View
          style={{ gap: 16, flexGrow: 1 }}
          className="flex items-center flex-col justify-start bg-bgColor p-4"
        >
          <Pressable onPress={goToPreload} className="w-3/5 h-[30%]  ">
            <Image className="w-full h-full" source={logoLGYM} />
          </Pressable>

      <View
        className="w-full flex flex-col items-center justify-start"
        style={{ gap: 8 }}
      >
        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <View className="flex flex-row gap-1">
            <Text
              className="text-textColor  text-base"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              {t('auth.username')}
            </Text>
            <Text className="text-redColor">*</Text>
          </View>

          <TextInput
            onChangeText={(text: string) => setUsername(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
            className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-textColor "
            autoComplete="given-name"
          />
        </View>
          <View className="flex flex-col w-full relative" style={{ gap: 8 }}>
          <View className="flex flex-row gap-1">
            <Text
              className="text-textColor text-base"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              {t('auth.password')}
            </Text>
            <Text className="text-redColor">*</Text>
          </View>
          <TextInput
            onChangeText={(text: string) => setPassword(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
            className="w-full px-2 py-4 bg-secondaryColor rounded-lg text-textColor  "
            secureTextEntry={secureTextEntry}
          />
          <Pressable
            style={{ borderRadius: 8 }}
            className="absolute top-[39%] h-[50px]   text-sm flex items-center justify-center   right-2"
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            {secureTextEntry ? (
              <ShowIcon stroke={"white"} />
            ) : (
              <HideIcon stroke={"white"} />
            )}
          </Pressable>
        </View>
        <View className="w-full flex items-end">
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
            text={t('auth.login')}
            buttonStyleSize={ButtonSize.xl}
          />
          <View className="flex flex-row items-center justify-center" style={{ gap: 6 }}>
            <Text
              className="text-sm text-fifthColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t('auth.noAccountQuestion')}
            </Text>
            <Pressable onPress={goToRegister}>
              <Text
                className="text-sm text-primaryColor"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t('auth.register')}
              </Text>
            </Pressable>
          </View>
          <MiniLoading />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Login;

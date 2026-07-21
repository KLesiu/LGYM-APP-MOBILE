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
import { useRouter, useFocusEffect } from "expo-router";
import MiniLoading from "./components/elements/MiniLoading";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import { useAppContext } from "./AppContext";
import Checkbox from "./components/elements/Checkbox";
import { usePostApiRegister, postApiRegisterResponse } from "../api/generated/user/user";
import { getErrorMessage } from "../utils/errorHandler";
import { useTranslation } from "react-i18next";
import toastService from "./services/toastService";
import BrandMark from "./components/branding/BrandMark";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rpassword, setRPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isVisibleInRanking, setIsVisibleInRanking] = useState<boolean>(true);

  const router = useRouter();
  const { setErrors: setAppErrors } = useAppContext();
  const { mutate, isPending } = usePostApiRegister();

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) newErrors.push(t("auth.usernameRequired"));
    if (!email.trim()) {
      newErrors.push(t("auth.emailRequired"));
    } else if (!emailRegex.test(email)) {
      newErrors.push(t("auth.invalidEmail"));
    }

    if (!password) {
      newErrors.push(t("auth.passwordRequired"));
    } else if (password.length < 6) {
      newErrors.push(t("auth.passwordLength"));
    }

    if (password !== rpassword) {
      newErrors.push(t("auth.passwordsMismatch"));
    }

    if (newErrors.length > 0) {
      toastService.showValidationError(newErrors);
    }

    return newErrors.length === 0;
  };

  const register = async (): Promise<void> => {
    if (!validate()) return;

    mutate(
      {
        data: {
          name: username,
          password: password,
          cpassword: rpassword,
          email: email,
          isVisibleInRanking: isVisibleInRanking,
        },
      },
      {
        onSuccess: (_response: postApiRegisterResponse) => {
          router.push("/Login");
        },
        onError: (error: any) => {
          console.error("Registration error:", error);
          const errorMessage = getErrorMessage(error, t("auth.registrationFailed"));
          toastService.showError(errorMessage, t("auth.registrationFailed"));
        },
      }
    );
  };

  const goToPreload = () => {
    router.push("/");
  };

  const fieldClassName =
    "w-full rounded-xl border border-secondaryColor bg-secondaryColor px-4 py-4 text-textColor";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 overflow-hidden bg-bgColor px-5 pb-8 pt-10">
          <View className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primaryColor opacity-10" />
          <View className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-10" />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Powrót"
            onPress={goToPreload}
            className="items-center"
          >
            <BrandMark
              size={70}
              layout="vertical"
              subtitle="System ewidencji treningowej"
            />
          </Pressable>

          <View className="mt-6 rounded-2xl border border-secondaryColor bg-cardColor p-5" style={{ gap: 16 }}>
            <View style={{ gap: 4 }}>
              <Text
                className="text-2xl text-textColor"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t("auth.register")}
              </Text>
              <Text
                className="text-sm leading-5 text-fifthColor"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Utwórz konto demonstracyjne i rozpocznij prowadzenie dziennika.
              </Text>
            </View>

            <View style={{ gap: 13 }}>
              <View style={{ gap: 7 }}>
                <View className="flex-row gap-1">
                  <Text className="text-sm text-textColor">{t("auth.username")}</Text>
                  <Text className="text-redColor">*</Text>
                </View>
                <TextInput
                  onChangeText={setUsername}
                  value={username}
                  autoCapitalize="none"
                  autoComplete="username-new"
                  placeholder={t("auth.username")}
                  placeholderTextColor="#64748B"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className={fieldClassName}
                />
              </View>

              <View style={{ gap: 7 }}>
                <View className="flex-row gap-1">
                  <Text className="text-sm text-textColor">{t("auth.email")}</Text>
                  <Text className="text-redColor">*</Text>
                </View>
                <TextInput
                  onChangeText={setEmail}
                  value={email}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder={t("auth.email")}
                  placeholderTextColor="#64748B"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className={fieldClassName}
                />
              </View>

              <View style={{ gap: 7 }}>
                <View className="flex-row gap-1">
                  <Text className="text-sm text-textColor">{t("auth.password")}</Text>
                  <Text className="text-redColor">*</Text>
                </View>
                <TextInput
                  secureTextEntry
                  onChangeText={setPassword}
                  value={password}
                  autoComplete="password-new"
                  placeholder={t("auth.password")}
                  placeholderTextColor="#64748B"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className={fieldClassName}
                />
              </View>

              <View style={{ gap: 7 }}>
                <View className="flex-row gap-1">
                  <Text className="text-sm text-textColor">{t("auth.repeatPassword")}</Text>
                  <Text className="text-redColor">*</Text>
                </View>
                <TextInput
                  secureTextEntry
                  onChangeText={setRPassword}
                  value={rpassword}
                  autoComplete="password-new"
                  placeholder={t("auth.repeatPassword")}
                  placeholderTextColor="#64748B"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                  className={fieldClassName}
                />
              </View>
            </View>

            <View
              className="flex-row items-center rounded-xl bg-fourthColor px-3 py-2"
              style={{ gap: 12 }}
            >
              <Checkbox
                value={isVisibleInRanking}
                setValue={setIsVisibleInRanking}
              />
              <Text
                className="flex-1 text-sm leading-5 text-textColor"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {t("profile.visibleInRanking")}
              </Text>
            </View>

            <CustomButton
              text={t("auth.register")}
              onPress={register}
              width="w-full"
              buttonStyleType={ButtonStyle.success}
              buttonStyleSize={ButtonSize.xl}
              disabled={isPending}
            />
          </View>

          <MiniLoading />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

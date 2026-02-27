import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Constants from "expo-constants";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import { useAppContext } from "../app/AppContext";
import { useAuthStore } from "../stores/useAuthStore";
import { Platforms } from "../api/generated/model";
import { AppConfigInfoDto } from "../api/generated/model";
import { usePostApiAppConfigGetAppVersion, postApiAppConfigGetAppVersionResponse } from "../api/generated/app-config/app-config";
import { getApiCheckToken } from "../api/generated/user/user";
import { UserInfoDto } from "../api/generated/model";

const SESSION_KEYS_TO_CLEAR = ["token", "username", "id", "email", "userInfo", "gym"] as const;

export const useAppInitialization = () => {
  const router = useRouter();
  const [appConfig, setAppConfig] = useState<AppConfigInfoDto | null>(null);
  const [canValidateToken, setCanValidateToken] = useState<boolean>(false);
  const { setErrors, setIsTokenChecked, isTokenChecked, setUserInfo, setToken, token } = useAppContext();
  
  const { mutate: checkVersion } = usePostApiAppConfigGetAppVersion({});

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (!canValidateToken) return;
    void validateTokenAndRoute();
  }, [canValidateToken, token, isTokenChecked]);

  const initializeApp = async (): Promise<void> => {
    const platform = Platform.OS === "android" ? Platforms.Android : Platforms.Ios;
    checkVersion(
      {
        data: { platform: platform },
      },
      {
        onSuccess: (response: postApiAppConfigGetAppVersionResponse) => {
          const appVersionConfig = response.data as AppConfigInfoDto;
          checkIsUpdateRequired(appVersionConfig);
        },
        onError: (error: any) => {
          console.error("Error checking app version:", error);
          setCanValidateToken(true);
        },
      }
    );
  };

  const validateTokenAndRoute = async (): Promise<void> => {
    if (isTokenChecked) return;

    const tokenToValidate = token ?? (await AsyncStorage.getItem("token"));

    if (!tokenToValidate) {
      useAuthStore.getState().logout();
      setIsTokenChecked(true);
      return;
    }

    if (!token) {
      setToken(tokenToValidate);
      useAuthStore.getState().setToken(tokenToValidate);
    }

    try {
      const response = await getApiCheckToken();
      if (response?.data && "name" in response.data) {
        const userInfo = response.data as UserInfoDto;
        await setSession(userInfo, tokenToValidate);
        return;
      }
      await resetSessionState("Authentication failed. Please log in again.");
    } catch (error) {
      console.error("Token check failed:", error);
      await resetSessionState("Session expired. Please log in again.");
    }
  };

  const checkIsUpdateRequired = async (appVersionConfig: AppConfigInfoDto) => {
    const appVersion = getAppVersion();

    if (
      !appVersionConfig.minRequiredVersion ||
      (appVersion && appVersion >= appVersionConfig.minRequiredVersion)
    ) {
      setCanValidateToken(true);
    } else {
      setAppConfig(appVersionConfig);
    }
  };

  const setSession = async (userInfo: UserInfoDto, sessionToken: string): Promise<void> => {
    await AsyncStorage.setItem("username", userInfo.name ?? "");
    await AsyncStorage.setItem("id", userInfo._id ?? "");
    if (userInfo.email) {
      await AsyncStorage.setItem("email", userInfo.email);
    }
    setErrors([]);
    setToken(sessionToken);
    useAuthStore.getState().setToken(sessionToken);
    setIsTokenChecked(true);
    setUserInfo(userInfo);
    useAuthStore.getState().setUser(userInfo);
    router.replace("/Home");
  };

  const resetSessionState = async (errorMessage?: string): Promise<void> => {
    await AsyncStorage.multiRemove([...SESSION_KEYS_TO_CLEAR]);
    setToken(undefined);
    setUserInfo(null);
    useAuthStore.getState().logout();
    setIsTokenChecked(true);

    if (errorMessage) {
      setErrors([errorMessage]);
      router.replace("/Login");
    }
  };

  const getAppVersion = () => {
    if (Constants.default.expoConfig?.version) {
      return Constants.default.expoConfig.version;
    }
    if (Updates.runtimeVersion) {
      return Updates.runtimeVersion;
    }
    return Application.nativeApplicationVersion;
  };

  return {
    appConfig,
  };
};

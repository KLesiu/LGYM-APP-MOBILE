import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Constants from "expo-constants";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import { useAppContext } from "../app/AppContext";
import { Platforms } from "../enums/Platforms";
import { AppConfigInfo } from "../interfaces/AppConfigInfo";
import { usePostApiAppConfigGetAppVersion, postApiAppConfigGetAppVersionResponse } from "../api/generated/app-config/app-config";
import { useGetApiCheckToken, getApiCheckTokenResponse } from "../api/generated/user/user";

import { UserInfoDto } from "../api/generated/model";

export const useAppInitialization = () => {
  const router = useRouter();
  const [appConfig, setAppConfig] = useState<AppConfigInfo | null>(null);
  const { setIsTokenChecked, isTokenChecked, setUserInfo, token } = useAppContext();
  const { mutate: checkVersion } = usePostApiAppConfigGetAppVersion({
  });
  const { data: checkTokenData, refetch: refetchCheckToken } = useGetApiCheckToken({
    query: { enabled: false, retry: false },
  });

  useEffect(() => {
    checkForUpdates();
  }, []);

  useEffect(() => {
    if (checkTokenData?.data) {
      const userInfo = checkTokenData.data as UserInfoDto;
      setSession(userInfo);
    }
  }, [checkTokenData]);

  const checkUserSession = async (): Promise<void> => {
    if (isTokenChecked) return;
    
    // If no token is present, we are not logged in.
    // No need to call the API which would return 401.
    if (!token) {
      setIsTokenChecked(true);
      return;
    }
    
    refetchCheckToken();
  };

  const setSession = async (userInfo: any): Promise<void> => {
    await AsyncStorage.setItem("username", userInfo.name);
    await AsyncStorage.setItem("id", userInfo._id);
    if(userInfo.email) await AsyncStorage.setItem("email", userInfo.email);
    setIsTokenChecked(true);
    setUserInfo(userInfo);
    router.push("/Home");
  };

  const checkForUpdates = async (): Promise<void> => {
    const platform = Platform.OS === "android" ? Platforms.ANDROID : Platforms.IOS;
    checkVersion(
      {
        data: { platform: platform },
      },
      {
        onSuccess: (response: postApiAppConfigGetAppVersionResponse) => {
          const appVersionConfig = response.data as AppConfigInfo;
          checkIsUpdateRequired(appVersionConfig);
        },
        onError: (error: any) => {
          console.error("Error checking app version:", error);
           checkUserSession();
        },
      }
    );
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

  const checkIsUpdateRequired = async (appVersionConfig: AppConfigInfo) => {
    const appVersion = getAppVersion();

    if (
      appVersionConfig.minRequiredVersion && appVersion &&
      appVersion >= appVersionConfig.minRequiredVersion
    ) {
      await checkUserSession();
    } else {
      setAppConfig(appVersionConfig);
    }
  };

  return {
    appConfig,
    checkUserSession
  };
};

import { Image, View, ImageBackground, Modal } from "react-native";
import logoLGYM from "./../assets/logoLGYMNew.png";
import backgroundLGYM from "./../img/backgroundLGYMApp500.png";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import { useAppContext } from "./AppContext";
import Loading from "./components/elements/Loading";
import { Platform } from "react-native";
import { Platforms } from "../enums/Platforms";
import { AppConfigInfo } from "../interfaces/AppConfigInfo";
import UpdateDialog from "./components/elements/UpdateDialog";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import React from "react";
import { usePostApiAppConfigGetAppVersion, postApiAppConfigGetAppVersionResponse } from "../api/generated/app-config/app-config";
import { useGetApiCheckToken, getApiCheckTokenResponse } from "../api/generated/user/user";
import ResponseMessage from "../interfaces/ResponseMessage";

const Preload: React.FC = () => {
  const router = useRouter();
  const [appConfig, setAppConfig] = useState<AppConfigInfo | null>(null);
  const { setIsTokenChecked, isTokenChecked, setUserInfo } =
    useAppContext();
  const { mutate: checkVersion } = usePostApiAppConfigGetAppVersion();
  const { data: checkTokenData, refetch: refetchCheckToken } = useGetApiCheckToken({
    query: { enabled: false },
  });

  useEffect(() => {
    checkForUpdates();
  }, []);

  useEffect(() => {
    if (checkTokenData?.data) {
      const response = checkTokenData as getApiCheckTokenResponse;
      const userInfo = response.data;
      setSession(userInfo);
    }
  }, [checkTokenData]);

  const checkUserSession = async (): Promise<void> => {
    if (isTokenChecked) return;
    refetchCheckToken();
  };

  const setSession = async (userInfo: any): Promise<void> => {
    await AsyncStorage.setItem("username", userInfo.name);
    await AsyncStorage.setItem("id", userInfo._id);
    await AsyncStorage.setItem("email", userInfo.email);
    setIsTokenChecked(true);
    setUserInfo(userInfo);
    router.push("/Home");
  };

  const handleLoginPress: VoidFunction = (): void => {
    router.push("/Login");
  };

  const handleRegisterPress: VoidFunction = (): void => {
    router.push("/Register");
  };

  const checkForUpdates = async (): Promise<void> => {
    const platform =
      Platform.OS === "android" ? Platforms.ANDROID : Platforms.IOS;
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
        },
      }
    );
  };

  const getAppVersion = () => {
    if (Constants.expoConfig?.version) {
      return Constants.expoConfig.version;
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

  return (
    <View className="h-full bg-bgColor">
      <ImageBackground
        resizeMode="cover"
        className="h-full w-full"
        source={backgroundLGYM}
      >
        <View className="bg-[#000000bd] h-full w-full">
          <View
            style={{ gap: 16 }}
            className="flex-1 items-center flex bg-[#1b1b1bbd] justify-center h-full p-4"
          >
            <Image source={logoLGYM} className="w-[70%] h-2/5" />
            <CustomButton
              text="SIGN IN"
              onPress={handleLoginPress}
              buttonStyleSize={ButtonSize.xl}
              buttonStyleType={ButtonStyle.success}
              width="w-full"
            />
            <CustomButton
              text="SIGN UP"
              onPress={handleRegisterPress}
              buttonStyleType={ButtonStyle.outline}
              customClasses="bg-[#1b1b1bbd] "
              width="w-full"
              buttonStyleSize={ButtonSize.xl}
            />
          </View>
        </View>
      </ImageBackground>
      <Loading />
      <Modal visible={!!appConfig} transparent animationType="fade">
          {appConfig && <UpdateDialog config={appConfig} />}
      </Modal>
    </View>
  );
};

export default Preload;

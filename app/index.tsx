import { Image, View, ImageBackground, Modal } from "react-native";
import logoLGYM from "./../assets/logoLGYMNew.png";
import backgroundLGYM from "./../img/backgroundLGYMApp500.png";
import { useCallback, useEffect, useState } from "react";
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
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Updates from "expo-updates";
import * as Application from "expo-application";

const Preload: React.FC = () => {
  const router = useRouter();
  const [appConfig, setAppConfig] = useState<AppConfigInfo | null>(null);
  const { getAPI, postAPI, setIsTokenChecked, isTokenChecked } =
    useAppContext();

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkUserSession = async (): Promise<void> => {
    if (isTokenChecked) return;
    await getAPI("/checkToken", setSession);
  };

  const setSession = async (result: any): Promise<void> => {
    if (!result || !result.isValid) return;
    await AsyncStorage.setItem("username", result.user.name);
    await AsyncStorage.setItem("id", result.user._id);
    await AsyncStorage.setItem("email", result.user.email);
    setIsTokenChecked(true);
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
    const body = { platform: platform };
    await postAPI("/appConfig/getAppVersion", checkIsUpdateRequired, body);
  };

  const getAppVersion = () => {
    if (Constants.expoConfig?.version) {
      return Constants.expoConfig.version;
    }
    if (Updates.runtimeVersion) {
      return Updates.runtimeVersion;
    }

    return Application.nativeApplicationVersion ?? "4.0.1";
  };

  const checkIsUpdateRequired = async (appVersionConfig: AppConfigInfo) => {
    const appVersion = getAppVersion();

    if (
      appVersionConfig.minRequiredVersion &&
      appVersion === appVersionConfig.minRequiredVersion
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
        <View className="bg-[#000000ec] h-full w-full">
          <View
            style={{ gap: 16 }}
            className="flex-1 items-center flex bg-[#1b1b1bde] justify-center h-full p-4"
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

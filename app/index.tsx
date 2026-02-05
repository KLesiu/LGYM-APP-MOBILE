import { Image, View, ImageBackground, Modal } from "react-native";
import logoLGYM from "./../assets/logoLGYMNew.png";
import backgroundLGYM from "./../img/backgroundLGYMApp500.png";
import { useRouter } from "expo-router";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import Loading from "./components/elements/Loading";
import UpdateDialog from "./components/elements/UpdateDialog";
import React from "react";
import { useAppInitialization } from "../hooks/useAppInitialization";

const Preload: React.FC = () => {
  const router = useRouter();
  const { appConfig } = useAppInitialization();

  const handleLoginPress: VoidFunction = (): void => {
    router.push("/Login");
  };

  const handleRegisterPress: VoidFunction = (): void => {
    router.push("/Register");
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

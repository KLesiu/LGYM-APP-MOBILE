import { Text, Image, View, ImageBackground } from "react-native";
import logoLGYM from "./../img/logoLGYM.png";
import backgroundLGYM from "./../img/backgroundLGYMApp500.png";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Loading from "./components/elements/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";

const Preload: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiURL = `${process.env.REACT_APP_BACKEND}/api/checkToken`;

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async (): Promise<void> => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token} `,
      },
    });
    const result = await response.json();
    if (!result.isValid) return;
    await AsyncStorage.setItem("username", result.user.name);
    await AsyncStorage.setItem("id", result.user._id);
    await AsyncStorage.setItem("email", result.user.email);
    router.push("/Home");
  };

  const handleLoginPress: VoidFunction = (): void => {
    router.push("/Login");
  };

  const handleRegisterPress: VoidFunction = (): void => {
    router.push("/Register");
  };

  const offLoading: VoidFunction = (): void => {
    setIsLoading(false);
  };

  return (
    <View className="h-full bg-[#F0EFF2]">
      <View
        style={{ gap: 16 }}
        className="flex-1 items-center flex  justify-center h-full p-4"
      >
        <View className="flex flex-row items-end ">
          <Text
            style={{ fontFamily: "OpenSans_700", fontSize: 120 }}
            className="text-[#20BC2D] font-extrabold"
          >
            L
          </Text>
          <Text
            style={{ fontFamily: "OpenSans_700", fontSize: 70 }}
            className="text-black font-bold"
          >
            GYM
          </Text>
        </View>

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

      {isLoading ? <Loading offLoading={offLoading} /> : <Text></Text>}
    </View>
  );
};

export default Preload;

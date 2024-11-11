import {
  Text,
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import logoLGYM from "./../../img/logoLGYM.png"
import backgroundLGYM from "./../../img/backgroundLGYMApp500.png";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootStackParamList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Loading from "../elements/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton, { ButtonSize, ButtonStyle } from "./../elements/CustomButton"

const Preload: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    checkUserSession();
  }, []);
  const checkUserSession = async (): Promise<void> => {
    const apiURL = `${process.env.REACT_APP_BACKEND}/api/checkToken`;
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token} `,
      },
    })
      .then((res) => res)
      .catch((err) => err)
      .then((res) => res.json());
    if (!response.isValid) return;
    await AsyncStorage.setItem("username", response.user.name);
    await AsyncStorage.setItem("id", response.user._id);
    await AsyncStorage.setItem("email", response.user.email);
    navigation.navigate("Home");
  };
  const handleLoginPress: VoidFunction = (): void => {
    navigation.navigate("Login");
  };
  const handleRegisterPress: VoidFunction = (): void => {
    navigation.navigate("Register");
  };
  const offLoading: VoidFunction = (): void => {
    setIsLoading(false);
  };
  return (
    <View className="h-full bg-[#282828]">
      <ImageBackground
        resizeMode="cover"
        className="h-full w-full"
        source={backgroundLGYM}
      >
        <View className="bg-[#5c5c5cb3] h-full w-full">
          <View
            style={{ gap: 16 }}
            className="flex-1 items-center flex bg-[#111111e2] justify-center h-full p-4"
          >
            <Image source={logoLGYM} className="w-[70%] h-2/5" />
            <CustomButton  text="SIGN IN" onPress={handleLoginPress} buttonStyleSize={ButtonSize.xl} buttonStyleType={ButtonStyle.success} width="w-full" />
            <CustomButton  text='SIGN UP' onPress={handleRegisterPress} buttonStyleType={ButtonStyle.outline} width="w-full" buttonStyleSize={ButtonSize.xl}/>
          </View>
        </View>
      </ImageBackground>

      {isLoading ? <Loading offLoading={offLoading} /> : <Text></Text>}
    </View>
  );
};
export default Preload;

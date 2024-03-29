import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import logoLGYM from "./img/logoLGYM.png";
import { useFonts, Teko_700Bold } from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import ErrorMsg from "./types/ErrorMsg";
import ErrorRegister from "./types/ErrorRegister";
import SuccessMsg from "./types/SuccessMsg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/RootStackParamList";
import MiniLoading from "./MiniLoading";
import ViewLoading from "./ViewLoading";

const Register: React.FC = () => {
  const [errors, setErrors] = useState<ErrorMsg[]>([]);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rpassword, setRPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const apiURL = `${process.env.REACT_APP_BACKEND}/api/register`;
  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
  });
  useEffect(() => {
    const loadAsyncResources = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Błąd ładowania zasobów:", error);
      }
    };

    loadAsyncResources();
  }, [fontsLoaded]);
  const register = async (): Promise<void> => {
    if (password !== rpassword)
      return setErrors([{ msg: "Both passwords need to be same" }]);
    if (!username || !email || !password || !rpassword)
      return setErrors([{ msg: "All fields are required" }]);
    setLoading(true);
    const response: ErrorRegister | SuccessMsg = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        password: password,
        cpassword: rpassword,
        email: email,
      }),
    })
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => {
        if (res.msg === `${process.env.REACT_APP_MSG_REGISTER_CREATE}`) {
          setErrors([]);
          return res.msg;
        } else return res;
      });
    if (typeof response === "object" && "errors" in response) {
      setLoading(false);
      return setErrors(response.errors);
    } else {
      setLoading(false);
      return navigation.navigate("Login");
    }
  };
  if (!fontsLoaded) {
    return <ViewLoading />
    
  }

  return (
    <View className="flex items-center flex-col h-full justify-start bg-[#191919]">
      <Image className="w-2/5 h-1/5 mb-[5%]" source={logoLGYM} />
      <Text style={{ fontFamily: "Teko_700Bold" }} className="text-[#b9b1a2] text-2xl mt-1">
        Username
      </Text>
      <TextInput
        onChangeText={(text) => setUsername(text)}
        className="rounded-xl h-12 text-lg w-4/5 text-white mt-1 pl-4 bg-[#3c3c3c]"
      />
      <Text style={{ fontFamily: "Teko_700Bold" }} className="text-[#b9b1a2] text-2xl mt-1">
        Email
      </Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        className="rounded-xl h-12 text-lg w-4/5 text-white mt-1 pl-4 bg-[#3c3c3c]"
      />
      <Text style={{ fontFamily: "Teko_700Bold" }} className="text-[#b9b1a2] text-2xl mt-1">
        Password
      </Text>
      <TextInput
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        className="rounded-xl h-12 text-lg w-4/5 text-white mt-1 pl-4 bg-[#3c3c3c]"
      />
      <Text style={{ fontFamily: "Teko_700Bold" }} className="text-[#b9b1a2] text-2xl mt-1">
        Repeat password
      </Text>
      <TextInput
        secureTextEntry={true}
        onChangeText={(text) => setRPassword(text)}
        className="rounded-xl h-12 text-lg w-4/5 text-white mt-1 pl-4 bg-[#3c3c3c]"
      />
      <TouchableOpacity
        onPress={register}
        className="mt-3 w-1/2 bg-[#868686] flex items-center justify-center rounded-xl h-[7%]"
      >
        <Text
          style={{
            fontFamily: "Teko_700Bold",
            
          }}
          className="text-3xl text-[#e2e2e2]"
        >
          REGISTER
        </Text>
      </TouchableOpacity>
      {loading ? <MiniLoading /> : ""}
      <View className="flex flex-col text-center w-[90%]">
        {errors
          ? errors.map((ele, index: number) => (
              <Text
                style={{
                  fontFamily: "Caveat_400Regular"
                }}
                className="text-red-500 w-full text-center mt-[2%] text-2xl"
                key={index}
              >
                {ele.msg}
              </Text>
            ))
          : ""}
      </View>
    </View>
  );
};
export default Register;

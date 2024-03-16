import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import logoLGYM from "./img/logoLGYM.png";
import { useFonts, Teko_700Bold } from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import ErrorMsg from "./types/ErrorMsg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/RootStackParamList";
import MiniLoading from "./MiniLoading";
import ViewLoading from "./ViewLoading";

const Login: React.FC = () => {
  const [errors, setErrors] = useState<ErrorMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const apiURL = `${process.env.REACT_APP_BACKEND}/api/login`;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  const login = async (): Promise<string | void> => {
    setLoading(true);
    if (!username || !password) {
      setErrors([]);
      setLoading(false);
      setErrors([{ msg: "All fields are required!" }]);
      return;
    }
    try {
      const response: "Authorized" | "Unauthorized" = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          password: password,
        }),
      })
        .then((res) => res.json())
        .catch(() => "Unauthorized")
        .then(async (res) => {
          if (res === "Unauthorized") {
            setLoading(false);
            setErrors([
              { msg: "We havent heard about you yet!  Please register" },
              {
                msg: "Maybe you typed wrong password! Please check it",
              },
            ]);

            return "Unauthorized";
          } else {
            await AsyncStorage.setItem("token", res.token);
            await AsyncStorage.setItem("username", res.req.name);
            await AsyncStorage.setItem("id", res.req._id);
            await AsyncStorage.setItem("email", res.req.email);
            await AsyncStorage.setItem("bp", `${res.req.Bp}` || "0");
            await AsyncStorage.setItem("dl", `${res.req.Dl}` || "0");
            await AsyncStorage.setItem("sq", `${res.req.Sq}` || "0");
            return "Authorized";
          }
        });

      if (response === `${process.env.REACT_APP_MSG_LOGIN_AUTH}`) {
        setErrors([]);
        setLoading(false);
        navigation.navigate("Home");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View className="flex items-center flex-col h-full justify-start bg-[rgba(25,25,25,1)]">
      <Image className="w-3/5 h-[30%}" source={logoLGYM} />
      <Text className="text-[rgb(185, 177, 162)] text-3xl m-1" style={{ fontFamily: "Teko_700Bold"}}>
        Username
      </Text>
      <TextInput
        onChangeText={(text: string) => setUsername(text)}
        className="rounded-xl h-12 text-base w-4/5 bg-[rgb(60,60,60)] text-white mt-1 pl-4"
        autoComplete="given-name"
      />
      <Text className="text-[rgb(185, 177, 162)] text-3xl m-1" style={{ fontFamily: "Teko_700Bold"}}>
        Password
      </Text>
      <TextInput
        onChangeText={(text: string) => setPassword(text)}
        className="rounded-xl h-12 text-base w-4/5 bg-[rgb(60,60,60)] text-white mt-1 pl-4"
        secureTextEntry={true}
      ></TextInput>
      <TouchableOpacity className="mt-3 w-1/2 bg-[rgb(134,134,134)] flex items-center justify-center rounded-xl h-14" onPress={login} >
        <Text
          className="text-3xl text-[rgb(226,226,226)]"
          style={{ fontFamily: "Teko_700Bold"}}
        >
          LOGIN
        </Text>
      </TouchableOpacity>
      {loading ? <MiniLoading /> : ""}
      <View className="flex flex-col text-center w-[90%]">
        {errors
          ? errors.map((ele, index: number) => (
              <Text
                className="text-red-500 w-full text-center mt-[2%] text-2xl"
                style={{
                  fontFamily: "Caveat_400Regular"
                }}
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
export default Login;

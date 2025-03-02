import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../img/logoLGYM.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MiniLoading from "./components/elements/MiniLoading";

import ShowIcon from "./../img/icons/showIcon.svg";
import HideIcon from "./../img/icons/hideIcon.svg";
import CustomButton, { ButtonSize, ButtonStyle } from "./components/elements/CustomButton";
import { Message } from "../enums/Message";
import ValidationView from "./components/elements/ValidationView";
import { useRouter } from "expo-router"; 


const Login: React.FC = () => {
  const apiURL = `${process.env.REACT_APP_BACKEND}/api/login`;
  const router = useRouter(); 

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

  const login = async (): Promise<void> => {
    setLoading(true);
    if (!username || !password) {
      setLoading(false);
      setErrors([Message.FieldRequired]);
      return;
    }
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        password: password,
      }),
    });
    if (!response.ok) {
      setLoading(false);
      setErrors([Message.DidntFind]);
      return;
    }
    const data = await response.json();

    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("username", data.req.name);
    await AsyncStorage.setItem("id", data.req._id);
    await AsyncStorage.setItem("email", data.req.email);

    setErrors([]);
    setLoading(false);
    router.navigate("/Home");
  };

  const goToPreload = () => {
    router.navigate("/");
  };
  return (
    <View
      style={{ gap: 16 }}
      className="flex items-center flex-col h-full justify-start bg-bgColor  p-4"
    >
      <Pressable onPress={goToPreload} className="w-3/5 h-[30%]  ">
        <Image className="w-full h-full" source={logoLGYM} />
      </Pressable>

      <View
        className="w-full flex flex-col items-center justify-start"
        style={{ gap: 8 }}
      >
        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-white text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Username
          </Text>
          <TextInput
            onChangeText={(text: string) => setUsername(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgb(30, 30, 30)",
              borderRadius: 8,
            }}
            className="w-full px-2 py-4  text-white "
            autoComplete="given-name"
          />
        </View>
        <View className="flex flex-col w-full relative" style={{ gap: 8 }}>
          <Text
            className="text-white text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Password
          </Text>
          <TextInput
            onChangeText={(text: string) => setPassword(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgb(30, 30, 30)",
              borderRadius: 8,
            }}
            className="w-full px-2 py-4 text-white  "
            secureTextEntry={secureTextEntry}
          />
          <Pressable
            style={{ borderRadius: 8 }}
            className="absolute top-[39%] h-[50px]   text-sm flex items-center justify-center   right-2"
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            {secureTextEntry ? <ShowIcon /> : <HideIcon />}
          </Pressable>
        </View>
      </View>
      <CustomButton
        width="w-full"
        onPress={login}
        buttonStyleType={ButtonStyle.success}
        text="Login"
        buttonStyleSize={ButtonSize.xl}
      />
      {loading ? <MiniLoading /> : <Text></Text>}
      <ValidationView errors={errors} />
    </View>
  );
};
export default Login;

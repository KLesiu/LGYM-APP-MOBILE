import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../img/logoLGYM.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MiniLoading from "./components/elements/MiniLoading";

import ShowIcon from "./../img/icons/showIcon.svg";
import HideIcon from "./../img/icons/hideIcon.svg";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
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
    router.push("/Home");
  };

  const goToPreload = () => {
    router.push("/");
  };
  return (
    <View
      style={{ gap: 16 }}
      className="flex items-center flex-col h-full justify-start bg-[#F0EFF2]  p-4"
    >
      <Pressable onPress={goToPreload}>
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
      </Pressable>

      <View
        className="w-full flex flex-col items-center justify-start"
        style={{ gap: 8 }}
      >
        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-[#141414] text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Username
          </Text>
          <TextInput
            onChangeText={(text: string) => setUsername(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
            }}
            className="w-full px-2 py-4  text-[#141414] "
            autoComplete="given-name"
          />
        </View>
        <View className="flex flex-col w-full relative" style={{ gap: 8 }}>
          <Text
            className="text-[#141414] text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Password
          </Text>
          <TextInput
            onChangeText={(text: string) => setPassword(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
            }}
            className="w-full px-2 py-4 text-[#141414]  "
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

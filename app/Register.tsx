import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../img/logoLGYM.png";
import { useRouter } from "expo-router"; 
import MiniLoading from "./components/elements/MiniLoading";
import CustomButton, { ButtonSize, ButtonStyle } from "./components/elements/CustomButton";
import ResponseMessage from "../interfaces/ResponseMessage";
import { Message } from "../enums/Message";
import ValidationView from "./components/elements/ValidationView";

const Register: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rpassword, setRPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const apiURL = `${process.env.REACT_APP_BACKEND}/api/register`;
  const router = useRouter();

  const register = async (): Promise<void> => {
    setLoading(true);
    const response = await fetch(apiURL, {
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
    const result:  ResponseMessage = await response.json();
    setLoading(false)
    if(result.msg === Message.Created){
      return router.push("Login");
    }
    setErrors([result.msg])
  };
  const goToPreload = () => {
    return router.navigate("/");
  };

  return (
    <View style={{gap:16}} className="flex items-center flex-col h-full justify-start bg-bgColor p-4">
      <Pressable onPress={goToPreload} className="w-2/5 h-1/5">
        <Image className="w-full h-full mb-[5%]" source={logoLGYM} />
      </Pressable>
      <View
        className="w-full flex flex-col items-center justify-start "
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
            onChangeText={(text) => setUsername(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              borderRadius: 8,
              backgroundColor: "rgb(30, 30, 30)",
            }}
            className="w-full px-2 py-4  text-white "
          />
        </View>
        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-white text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Email
          </Text>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgb(30, 30, 30)",
              borderRadius: 8,

            }}
            className="w-full px-2 py-4  text-white "
          />
        </View>
        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-white text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Password
          </Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgb(30, 30, 30)",
              borderRadius: 8,

            }}
            className="w-full px-2 py-4 text-white "
          />
        </View>
        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-white text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Repeat password
          </Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => setRPassword(text)}
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgb(30, 30, 30)",
              borderRadius: 8,

            }}
            className="w-full px-2 py-4  text-white "
          />
        </View>
      </View>
      <CustomButton  text="Register" onPress={register} width="w-full" buttonStyleType={ButtonStyle.success} buttonStyleSize={ButtonSize.xl} />
      {loading ? <MiniLoading /> : <Text></Text>}
      <ValidationView errors={errors} />
    </View>
  );
};
export default Register;

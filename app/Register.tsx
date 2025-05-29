import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../assets/logoLGYMNew.png";
import { usePathname, useRouter } from "expo-router";
import MiniLoading from "./components/elements/MiniLoading";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import ValidationView from "./components/elements/ValidationView";
import { useAppContext } from "./AppContext";
import { Message } from "../enums/Message";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rpassword, setRPassword] = useState<string>();
  const [email, setEmail] = useState<string>();

  const router = useRouter();

  const { postAPI, setErrors } = useAppContext();

  useEffect(() => {
    setErrors([]);
  }, [usePathname()]);

  const register = async (): Promise<void> => {
    await postAPI("/register", registerSuccessCalback, {
      name: username,
      password: password,
      cpassword: rpassword,
      email: email,
    });
  };
  const goToPreload = () => {
    return router.push("/");
  };

  const registerSuccessCalback = (response: any) => {
    if (response.msg !== Message.Created) return;
    router.push("Login");
  };

  return (
    <View
      style={{ gap: 16 }}
      className="flex items-center flex-col h-full justify-start bg-bgColor p-4"
    >
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
            }}
            className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-white "
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
            }}
            className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-white "
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
            }}
            className="w-full px-2 py-4 bg-secondaryColor rounded-lg text-white "
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
            }}
            className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-white "
          />
        </View>
      </View>
      <CustomButton
        text="Register"
        onPress={register}
        width="w-full"
        buttonStyleType={ButtonStyle.success}
        buttonStyleSize={ButtonSize.xl}
      />
      <MiniLoading />
      <ValidationView />
    </View>
  );
};
export default Register;

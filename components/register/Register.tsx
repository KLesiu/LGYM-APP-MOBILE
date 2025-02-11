import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../../img/logoLGYM.png";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../interfaces/Navigation";
import MiniLoading from "../elements/MiniLoading";
import CustomButton, { ButtonSize, ButtonStyle } from "../elements/CustomButton";
import ResponseMessage from "../../interfaces/ResponseMessage";
import { Message } from "../../enums/Message";

const Register: React.FC = () => {
  const [errors, setErrors] = useState<ResponseMessage[]>([]);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rpassword, setRPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const apiURL = `${process.env.REACT_APP_BACKEND}/api/register`;

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
      return navigation.navigate("Login");
    }
    setErrors([result])
  };
  const goToPreload = () => {
    return navigation.navigate("Preload");
  };

  return (
    <View style={{gap:16}} className="flex items-center flex-col h-full justify-start bg-[#121212] p-4">
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
              borderRadius: 8,

            }}
            className="w-full px-2 py-4  text-white "
          />
        </View>
      </View>
      <CustomButton  text="Register" onPress={register} width="w-full" buttonStyleType={ButtonStyle.success} buttonStyleSize={ButtonSize.xl} />
      {loading ? <MiniLoading /> : <Text></Text>}
      <View className="flex flex-col text-center w-[90%]">
        {errors ? (
          errors.map((ele, index: number) => (
            <Text
              style={{
                fontFamily: "Caveat_400Regular",
              }}
              className="text-red-500 w-full text-center mt-[2%] text-2xl"
              key={index}
            >
              {ele.msg}
            </Text>
          ))
        ) : (
          <Text></Text>
        )}
      </View>
    </View>
  );
};
export default Register;

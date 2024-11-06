import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../../img/logoLGYM.png";
import ErrorMsg from "../../types/ErrorMsg";
import ErrorRegister from "../../types/ErrorRegister";
import SuccessMsg from "../../types/SuccessMsg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import MiniLoading from "../elements/MiniLoading";

const Register: React.FC = () => {
  const [errors, setErrors] = useState<ErrorMsg[]>([]);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rpassword, setRPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const apiURL = `https://lgym-app-api-v2.vercel.app/api/register`;
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
        if (res.msg === `User created successfully!`) {
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
  const goToPreload = () => {
    return navigation.navigate("Preload");
  };

  return (
    <View className="flex items-center flex-col h-full justify-start bg-[#121212]">
      <Pressable onPress={goToPreload} className="w-2/5 h-1/5">
        <Image className="w-full h-full mb-[5%]" source={logoLGYM} />
      </Pressable>
      <View
        className="w-full flex flex-col items-center justify-start p-4"
        style={{ gap: 16 }}
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

      <Pressable
        onPress={register}
        style={{borderRadius:8}}
        className="w-80 h-20  py-4  px-2 m-0  bg-[#94e798] flex justify-center items-center mt-4"
      >
        <Text
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
          className="text-base w-full text-center text-black"
        >
          REGISTER
        </Text>
      </Pressable>
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

import React, {  useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./img/logoLGYM.png";
import ErrorMsg from "./types/ErrorMsg";
import ErrorRegister from "./types/ErrorRegister";
import SuccessMsg from "./types/SuccessMsg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/RootStackParamList";
import MiniLoading from "./MiniLoading";

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
  const goToPreload = ()=>{
    return navigation.navigate("Preload")
  }


  return (
    <View className="flex items-center flex-col h-full justify-start bg-[#191919]">
      <Pressable onPress={goToPreload} className="w-2/5 h-1/5">
      <Image  className="w-full h-full mb-[5%]" source={logoLGYM} />
      </Pressable>

      <Text style={{ fontFamily: "OpenSans_700Bold" }} className="text-[#4CD964] text-2xl mt-1">
        Username
      </Text>
      <TextInput
        onChangeText={(text) => setUsername(text)}
        className="rounded-xl h-12 text-lg w-80 text-black mt-1 pl-4 bg-white"
      />
      <Text style={{ fontFamily: "OpenSans_700Bold" }} className="text-[#4CD964] text-2xl mt-1">
        Email
      </Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        className="rounded-xl h-12 text-lg w-80 text-black mt-1 pl-4 bg-white"
      />
      <Text style={{ fontFamily: "OpenSans_700Bold" }} className="text-[#4CD964] text-2xl mt-1">
        Password
      </Text>
      <TextInput
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        className="rounded-xl h-12 text-lg w-80 text-black mt-1 pl-4 bg-white"
      />
      <Text style={{ fontFamily: "OpenSans_700Bold" }} className="text-[#4CD964] text-2xl mt-1">
        Repeat password
      </Text>
      <TextInput
        secureTextEntry={true}
        onChangeText={(text) => setRPassword(text)}
        className="rounded-xl h-12 text-lg w-80 text-black mt-1 pl-4 bg-white"
      />
      <Pressable
        onPress={register}
        className="w-80 h-20 rounded-lg py-4  px-2 m-0  bg-[#4CD964] flex justify-center items-center mt-4"
      >
        <Text
          style={{
            fontFamily: "OpenSans_700Bold",
            
          }}
          className="text-xs w-full text-center text-black"
        >
          REGISTER
        </Text>
      </Pressable>
      {loading ? <MiniLoading /> : <Text></Text>}
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
          : <Text></Text>}
      </View>
    </View>
  );
};
export default Register;

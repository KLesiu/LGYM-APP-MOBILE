import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image,  Pressable,  } from "react-native";
import logoLGYM from "./img/logoLGYM.png";
import ErrorMsg from "./types/ErrorMsg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/RootStackParamList";
import MiniLoading from "./MiniLoading";

const Login: React.FC = () => {
  const [errors, setErrors] = useState<ErrorMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [secureTextEntry,setSecureTextEntry]=useState<boolean>(true)
  const apiURL = `${process.env.REACT_APP_BACKEND}/api/login`;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
  const goToPreload = ()=>{
    return navigation.navigate("Preload")
  }
  return (
    <View className="flex items-center flex-col h-full justify-start bg-[#191919]">
      <Pressable onPress={goToPreload} className="w-3/5 h-[30%]">
      <Image className="w-full h-full" source={logoLGYM} />
      </Pressable>

      <View className="w-full flex flex-col items-center justify-start">
      <Text className="text-[#b9b1a2] text-3xl m-1" style={{ fontFamily: "OpenSans_700Bold"}}>
        Username
      </Text>
      <TextInput
        onChangeText={(text: string) => setUsername(text)}
        className="rounded-xl h-12 text-base w-4/5 bg-[#3c3c3c] text-white mt-1 pl-4"
        autoComplete="given-name"
      />
      <Text className="text-[#b9b1a2] text-3xl m-1" style={{ fontFamily: "OpenSans_700Bold"}}>
        Password
      </Text>
      <View className="flex w-4/5 h-12 items-center justify-center">
      <TextInput
        onChangeText={(text: string) => setPassword(text)}
        className="rounded-xl h-full  text-base  bg-[#3c3c3c] text-white  pl-4 w-full"
        secureTextEntry={secureTextEntry}
      >

      </TextInput>
      <Pressable className="absolute w-16 h-full text-sm flex items-center justify-center bg-[#6b6b6b7e] rounded-xl  right-0" onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Text className="text-white text-lg ">{secureTextEntry?'SHOW':'HIDE'}</Text>
        </Pressable>
      </View>

      </View>
      
      <Pressable className="mt-10 w-80 bg-[#868686] flex items-center justify-center rounded-xl h-14" onPress={login} >
        <Text
          className="text-2xl text-[#e2e2e2]"
          style={{ fontFamily: "OpenSans_700Bold"}}
        >
          LOGIN
        </Text>
      </Pressable>
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

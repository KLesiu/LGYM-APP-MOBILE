import React, {  useState } from "react";
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
  const apiURL = `https://lgym-app-api-v2.vercel.app/api/login`;
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

      if (response === `Authorized`) {
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
      <Pressable onPress={goToPreload} className="w-3/5 h-[30%]  ">
      <Image className="w-full h-full" source={logoLGYM} />
      </Pressable>

      <View className="w-full flex flex-col items-center justify-start">
      <Text className="text-[#4CD964] text-3xl m-1" style={{ fontFamily: "OpenSans_700Bold"}}>
        Username
      </Text>
      <TextInput
        onChangeText={(text: string) => setUsername(text)}
        className="rounded-xl h-12 text-base w-80 bg-white text-black mt-1 pl-4"
        autoComplete="given-name"
      />
      <Text className="text-[#4CD964] text-3xl m-1" style={{ fontFamily: "OpenSans_700Bold"}}>
        Password
      </Text>
      <View className="flex w-4/5 h-12 items-center justify-center">
      <TextInput
        onChangeText={(text: string) => setPassword(text)}
        className="rounded-xl h-full  text-base  bg-white text-black  pl-4 w-80"
        secureTextEntry={secureTextEntry}
      >

      </TextInput>
      <Pressable className="absolute w-16 h-full text-sm flex items-center justify-center bg-[#4CD964] rounded-xl  right-0" onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Text className="text-white text-lg ">{secureTextEntry?'SHOW':'HIDE'}</Text>
        </Pressable>
      </View>

      </View>
      
      <Pressable  className="h-20 w-80 rounded-lg py-4  px-2 m-0  bg-[#4CD964] flex justify-center items-center mt-4" onPress={login} >
        <Text
         className="text-xs w-full text-center text-white"
          style={{ fontFamily: "OpenSans_700Bold"}}
        >LOGIN
        </Text>
      </Pressable>
      {loading ? <MiniLoading /> : <Text></Text>}
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
          : <Text></Text>}
      </View>
    </View>
  );
};
export default Login;

import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../../img/logoLGYM.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../interfaces/Navigation";
import MiniLoading from "../elements/MiniLoading";
import ShowIcon from "./../../img/icons/show.png"
import HideIcon from "./../../img/icons/hide.png"
import CustomButton, { ButtonSize, ButtonStyle } from "../elements/CustomButton";
import ResponseMessage from "../../interfaces/ResponseMessage";

const Login: React.FC = () => {
  const [errors, setErrors] = useState<ResponseMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const apiURL = `${process.env.REACT_APP_BACKEND}/api/login`;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const login = async (): Promise<string | void> => {
      setLoading(true);
    
      if (!username || !password) {
        setLoading(false);
        setErrors([{ msg: "All fields are required!" }]);
        return;
      }
      try {
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
          if (response.status === 401) {
            setErrors([
              { msg: "We haven't heard about you yet! Please register." },
              { msg: "Maybe you typed the wrong password! Please check it." },
            ]);
          } else {
            setErrors([{ msg: "An error occurred. Please try again." }]);
          }
          return "Unauthorized";
        }
    
        const data = await response.json();
    
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("username", data.req.name);
        await AsyncStorage.setItem("id", data.req._id);
        await AsyncStorage.setItem("email", data.req.email);
    
        setErrors([]);
        setLoading(false);
        navigation.navigate("Home");
        return "Authorized";
        
      } catch (error) {
        setLoading(false);
        console.error("Network error or unexpected issue:", error);
        setErrors([{ msg: "An error occurred. Please try again." }]);
      }
    };
    
  const goToPreload = () => {
    return navigation.navigate("Preload");
  };
  return (
    <View style={{gap:16}} className="flex items-center flex-col h-full justify-start bg-[#121212]  p-4">
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
              borderRadius:8
            }}
            className="w-full px-2 py-4  text-white "
            autoComplete="given-name"
          />
        </View>
        <View className="flex flex-col w-full relative" style={{gap:8}}>
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
              borderRadius:8
            }}
            className="w-full px-2 py-4 text-white  "
            secureTextEntry={secureTextEntry}
          />
             <Pressable
             style={{borderRadius:8}}
            className="absolute top-[39%] h-[50px]   text-sm flex items-center justify-center   right-2"
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            {secureTextEntry ? <Image source={ShowIcon}/> : <Image source={HideIcon}/>}
  
          </Pressable>
        </View>
      </View>
      <CustomButton  width="w-full"  onPress={login} buttonStyleType={ButtonStyle.success} text="Login" buttonStyleSize={ButtonSize.xl}/>
      {loading ? <MiniLoading /> : <Text></Text>}
      <View className="flex flex-col text-center w-[90%]">
        {errors ? (
          errors.map((ele, index: number) => (
            <Text
              className="text-red-500 w-full text-center mt-[2%] text-2xl"
              style={{
                fontFamily: "Caveat_400Regular",
              }}
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
export default Login;

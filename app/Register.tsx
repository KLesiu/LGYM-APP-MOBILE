import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import logoLGYM from "./../assets/logoLGYMNew.png";
import { useRouter, useFocusEffect } from "expo-router";
import MiniLoading from "./components/elements/MiniLoading";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import ValidationView from "./components/elements/ValidationView";
import { useAppContext } from "./AppContext";
import Checkbox from "./components/elements/Checkbox";
import { usePostApiRegister, postApiRegisterResponse } from "../api/generated/user/user";
import { getErrorMessage } from "../utils/errorHandler";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rpassword, setRPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isVisibleInRanking, setIsVisibleInRanking] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);

  const router = useRouter();
  const { setErrors: setAppErrors } = useAppContext();
  const { mutate, isPending } = usePostApiRegister();

  useFocusEffect(
    useCallback(() => {
      setAppErrors([]);
      setErrors([]);
    }, [])
  );

  const validate = (): boolean => {
    const newErrors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) newErrors.push("Username is required");
    if (!email.trim()) {
      newErrors.push("Email is required");
    } else if (!emailRegex.test(email)) {
      newErrors.push("Invalid email format");
    }

    if (!password) {
      newErrors.push("Password is required");
    } else if (password.length < 6) {
      newErrors.push("Password must be at least 6 characters");
    }

    if (password !== rpassword) {
      newErrors.push("Passwords do not match");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const register = async (): Promise<void> => {
    if (!validate()) return;

    mutate(
      {
        data: {
          name: username,
          password: password,
          cpassword: rpassword,
          email: email,
          isVisibleInRanking: isVisibleInRanking,
        },
      },
      {
        onSuccess: (response: postApiRegisterResponse) => {
          router.push("Login");
        },
        onError: (error: any) => {
          console.error("Registration error:", error);
          const errorMessage = getErrorMessage(error, "Registration failed");
          setErrors([errorMessage]);
        },
      }
    );
  };

  const goToPreload = () => {
    return router.push("/");
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
          <View className="flex flex-row gap-1">
            <Text
              className="text-textColor text-base smallPhone:text-sm"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Username
            </Text>
            <Text className="text-redColor">*</Text>
          </View>
          <TextInput
            onChangeText={(text) => setUsername(text)}
            value={username}
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor"
          />
        </View>

        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <View className="flex flex-row gap-1">
            <Text
              className="text-textColor text-base smallPhone:text-sm"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Email
            </Text>
            <Text className="text-redColor">*</Text>
          </View>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <View className="flex flex-row gap-1">
            <Text
              className="text-textColor text-base smallPhone:text-sm"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Password
            </Text>
            <Text className="text-redColor">*</Text>
          </View>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor"
          />
        </View>

        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <View className="flex flex-row gap-1">
            <Text
              className="text-textColor text-base smallPhone:text-sm"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Repeat password
            </Text>
            <Text className="text-redColor">*</Text>
          </View>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => setRPassword(text)}
            value={rpassword}
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor"
          />
        </View>
      </View>

      <View className="flex flex-row w-full items-center" style={{ gap: 12 }}>
        <Checkbox
          value={isVisibleInRanking}
          setValue={setIsVisibleInRanking}
         
        />
        <Text
          className="text-textColor text-sm smallPhone:text-xs"
          style={{ fontFamily: "OpenSans_300Light" }}
        >
          Be visible in global rankings
        </Text>
      </View>

      <CustomButton
        text="Register"
        onPress={register}
        width="w-full"
        buttonStyleType={ButtonStyle.success}
        buttonStyleSize={ButtonSize.xl}
        disabled={isPending}
      />
      <MiniLoading />
      <ValidationView errors={errors} />
    </View>
  );
};

export default Register;

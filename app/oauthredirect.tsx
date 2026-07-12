import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";

const OAuthRedirect = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-bgColor">
      <ActivityIndicator color="#FFFFFF" />
    </View>
  );
};

export default OAuthRedirect;

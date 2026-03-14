import React from "react";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";
import colors from "../constants/colors";

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primaryColor,
        backgroundColor: colors.secondaryColor,
        borderLeftWidth: 6,
        width: "90%",
        minHeight: 70,
        borderRadius: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 12 }}
      text2NumberOfLines={4}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: colors.textColor,
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: "400",
        color: colors.fifthColor,
        lineHeight: 20,
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.redColor,
        backgroundColor: colors.secondaryColor,
        borderLeftWidth: 6,
        width: "90%",
        minHeight: 70,
        borderRadius: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 12 }}
      text2NumberOfLines={6}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: colors.textColor,
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: "400",
        color: colors.fifthColor,
        lineHeight: 20,
      }}
    />
  ),
};

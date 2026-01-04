import React from 'react';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

// 1. Importujemy kolory z tego samego pliku co Tailwind
// (React Native bez problemu obsłuży import z module.exports)
import colors from "../constants/colors"

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primaryColor, // Użycie z importu
        backgroundColor: colors.secondaryColor, 
        borderLeftWidth: 6, 
        width: '90%', 
        height: 70,
        borderRadius: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textColor, 
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: '400',
        color: colors.fifthColor, 
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
        width: '90%',
        height: 70,
        borderRadius: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textColor,
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: '400',
        color: colors.fifthColor,
      }}
    />
  ),
};
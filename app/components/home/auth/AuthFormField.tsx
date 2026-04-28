import React from 'react';
import { Text, View } from 'react-native';

type AuthFormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
};

const AuthFormField: React.FC<AuthFormFieldProps> = ({
  label,
  required = false,
  children,
  className = 'flex flex-col w-full',
  labelClassName = 'text-textColor text-base',
}) => (
  <View className={className} style={{ gap: 8 }}>
    <View className="flex flex-row gap-1">
      <Text className={labelClassName} style={{ fontFamily: 'OpenSans_300Light' }}>
        {label}
      </Text>
      {required && <Text className="text-redColor">*</Text>}
    </View>
    {children}
  </View>
);

export default AuthFormField;

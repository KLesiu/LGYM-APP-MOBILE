import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View, type ImageSourcePropType } from 'react-native';

type AuthScreenLayoutProps = {
  children: React.ReactNode;
  logo: ImageSourcePropType;
  logoClassName: string;
  logoPressableClassName: string;
  onLogoPress: () => void;
};

const AuthScreenLayout: React.FC<AuthScreenLayoutProps> = ({
  children,
  logo,
  logoClassName,
  logoPressableClassName,
  onLogoPress,
}) => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ gap: 16, flexGrow: 1 }} className="flex items-center flex-col justify-start bg-bgColor p-4">
        <Pressable onPress={onLogoPress} className={logoPressableClassName}>
          <Image className={logoClassName} source={logo} />
        </Pressable>
        {children}
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

export default AuthScreenLayout;

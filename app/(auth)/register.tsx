import React, { useState, useCallback } from 'react';
import { View, Text, TextInput } from 'react-native';
import logoLGYM from './../../assets/logoLGYMNewX.png';
import { useRouter, useFocusEffect } from 'expo-router';
import MiniLoading from '../components/elements/MiniLoading';
import CustomButton, { ButtonSize, ButtonStyle } from '../components/elements/CustomButton';
import { useAppContext } from '../AppContext';
import Checkbox from '../components/elements/Checkbox';
import { usePostApiRegister } from '../../api/generated/user/user';
import { getErrorMessage, sanitize } from '../../lib/domain/errorHandler';
import { useTranslation } from 'react-i18next';
import toastService from '../services/toastService';
import { useAuthStore } from '../../stores/useAuthStore';
import { ROUTES } from '../../lib/constants';
import AuthScreenLayout from '../components/auth/AuthScreenLayout';
import AuthFormField from '../components/auth/AuthFormField';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rpassword, setRPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isVisibleInRanking, setIsVisibleInRanking] = useState<boolean>(true);
  const router = useRouter();
  const { setErrors: setAppErrors } = useAppContext();
  const { mutate, isPending } = usePostApiRegister();
  const clearSession = useAuthStore((state) => state.clearSession);

  useFocusEffect(
    useCallback(() => {
      setAppErrors([]);
      toastService.hide();
      return () => {
        toastService.hide();
      };
    }, [setAppErrors]),
  );

  const validate = (): boolean => {
    const newErrors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/; // NOSONAR - safe linear regex
    if (!username.trim()) newErrors.push(t('auth.usernameRequired'));
    if (!email.trim()) newErrors.push(t('auth.emailRequired'));
    else if (!emailRegex.test(email)) newErrors.push(t('auth.invalidEmail'));
    if (!password) newErrors.push(t('auth.passwordRequired'));
    else if (password.length < 6) newErrors.push(t('auth.passwordLength'));
    if (password !== rpassword) newErrors.push(t('auth.passwordsMismatch'));
    if (newErrors.length > 0) toastService.showValidationError(newErrors);
    return newErrors.length === 0;
  };

  const register = async (): Promise<void> => {
    if (!validate()) return;
    mutate(
      { data: { name: username, password, cpassword: rpassword, email, isVisibleInRanking } },
      {
        onSuccess: () => {
          void clearSession();
          router.push(ROUTES.login);
        },
        onError: (error: unknown) => {
          const sanitizedError = sanitize(error);
          if (__DEV__ && sanitizedError.devDetails) {
            console.warn('[Register] request failed', sanitizedError.devDetails);
          }
          const errorMessage = getErrorMessage(error, t('auth.registrationFailed'));
          toastService.showError(errorMessage, t('auth.registrationFailed'));
        },
      },
    );
  };

  return (
    <AuthScreenLayout
      logo={logoLGYM}
      logoClassName="w-full h-full mb-[5%]"
      logoPressableClassName="w-2/5 h-1/5"
      onLogoPress={() => router.push(ROUTES.root)}
    >
      <View className="w-full flex flex-col items-center justify-start" style={{ gap: 8 }}>
        <AuthFormField label={t('auth.username')} required>
          <TextInput onChangeText={setUsername} value={username} style={{ fontFamily: 'OpenSans_400Regular' }} className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor" />
        </AuthFormField>
        <AuthFormField label={t('auth.email')} required>
          <TextInput onChangeText={setEmail} value={email} style={{ fontFamily: 'OpenSans_400Regular' }} className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor" autoCapitalize="none" keyboardType="email-address" />
        </AuthFormField>
        <AuthFormField label={t('auth.password')} required>
          <TextInput secureTextEntry value={password} onChangeText={setPassword} style={{ fontFamily: 'OpenSans_400Regular' }} className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor" />
        </AuthFormField>
        <AuthFormField label={t('auth.repeatPassword')} required>
          <TextInput secureTextEntry value={rpassword} onChangeText={setRPassword} style={{ fontFamily: 'OpenSans_400Regular' }} className="w-full px-2 py-4 smallPhone:px-1 smallPhone:py-2 bg-secondaryColor rounded-lg text-textColor" />
        </AuthFormField>
      </View>
      <View className="flex flex-row w-full items-center" style={{ gap: 12 }}>
        <Checkbox value={isVisibleInRanking} setValue={setIsVisibleInRanking} />
        <Text className="text-textColor text-sm smallPhone:text-xs" style={{ fontFamily: 'OpenSans_300Light' }}>{t('profile.visibleInRanking')}</Text>
      </View>
      <CustomButton text={t('auth.register')} onPress={register} width="w-full" buttonStyleType={ButtonStyle.success} buttonStyleSize={ButtonSize.xl} disabled={isPending} />
      <MiniLoading />
    </AuthScreenLayout>
  );
};

export default Register;

import * as React from 'react';
import { Slot } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_300Light,
  useFonts,
} from '@expo-google-fonts/open-sans';
import AppProvider from './AppContext';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import OnboardingProvider from './onboarding/OnboardingContext';
import { toastConfig } from '../lib/format/toastConfig';
import { useAppInitialization } from './useAppInitialization';

const AppBootstrap: React.FC = () => {
  useAppInitialization();
  return null;
};

NativeWindStyleSheet.setOutput({ default: 'native' });

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Layout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
  });

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <OnboardingProvider>
          <AppBootstrap />
          <Slot />
          <Toast config={toastConfig} />
        </OnboardingProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default Layout;

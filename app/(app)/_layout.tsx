import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import Loading from '../components/elements/Loading';
import { ROUTES } from '../../lib/constants';

const AppLayout: React.FC = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isHydrated) return <Loading />;
  if (!isAuthenticated) return <Redirect href={ROUTES.login} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        headerBackButtonMenuEnabled: false,
      }}
    />
  );
};

export default AppLayout;

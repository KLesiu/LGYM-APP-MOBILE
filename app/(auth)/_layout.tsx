import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAppContext } from '../AppContext';
import Loading from '../components/elements/Loading';
import { ROUTES } from '../../lib/constants';

const AuthLayout: React.FC = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isTokenChecked } = useAppContext();

  if (!isHydrated || !isTokenChecked) return <Loading />;
  if (isAuthenticated) return <Redirect href={ROUTES.home} />;

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

export default AuthLayout;

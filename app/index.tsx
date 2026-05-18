import React from 'react';
import { Redirect } from 'expo-router';
import Loading from './components/elements/Loading';
import { useAppContext } from './AppContext';
import { useAuthStore } from '../stores/useAuthStore';
import { getBootstrapRoute } from '../lib/authRouting';

const Preload: React.FC = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isTokenChecked } = useAppContext();
  const bootstrapRoute = getBootstrapRoute({ isHydrated, isTokenChecked, isAuthenticated });

  if (!bootstrapRoute) return <Loading />;

  return <Redirect href={bootstrapRoute} />;
};

export default Preload;

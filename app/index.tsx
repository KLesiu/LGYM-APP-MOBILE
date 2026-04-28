import React from 'react';
import { Redirect } from 'expo-router';
import Loading from './components/elements/Loading';
import { useAuthStore } from '../stores/useAuthStore';
import { getBootstrapRoute } from '../lib/authRouting';

const Preload: React.FC = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const bootstrapRoute = getBootstrapRoute({ isHydrated, isAuthenticated });

  if (!bootstrapRoute) return <Loading />;

  return <Redirect href={bootstrapRoute} />;
};

export default Preload;

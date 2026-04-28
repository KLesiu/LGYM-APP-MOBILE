import { ROUTES } from './constants';

export const AUTH_LOGIN_ROUTE = ROUTES.login;
export const AUTH_REGISTER_ROUTE = ROUTES.register;
export const APP_HOME_ROUTE = ROUTES.home;

type AuthRoutingState = {
  isHydrated: boolean;
  isAuthenticated: boolean;
};

type ErrorLike = {
  message?: unknown;
  response?: {
    status?: unknown;
    data?: {
      message?: unknown;
    };
  };
  status?: unknown;
};

const normalizeMessage = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const getStatus = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null) return undefined;
  const typedError = error as ErrorLike;
  if (typeof typedError.response?.status === 'number') return typedError.response.status;
  if (typeof typedError.status === 'number') return typedError.status;
  return undefined;
};

const getMessage = (error: unknown): string => {
  if (typeof error !== 'object' || error === null) return normalizeMessage(error);
  const typedError = error as ErrorLike;
  return normalizeMessage(typedError.response?.data?.message ?? typedError.message);
};

export const getBootstrapRoute = ({
  isHydrated,
  isAuthenticated,
}: AuthRoutingState): string | null => {
  if (!isHydrated) return null;
  return isAuthenticated ? APP_HOME_ROUTE : AUTH_LOGIN_ROUTE;
};

export const shouldResetAuthSession = (error: unknown): boolean => {
  const status = getStatus(error);
  if (status === 401) return true;

  const message = getMessage(error);
  return (
    message.includes('session expired') ||
    message.includes('expired session') ||
    message.includes('unauthorized')
  );
};

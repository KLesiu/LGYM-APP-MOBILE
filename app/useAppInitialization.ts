import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import { useAppContext } from './AppContext';
import { useOnboarding } from './onboarding/OnboardingContext';
import { useAuthStore } from '../stores/useAuthStore';
import { Platforms } from '../api/generated/model';
import type { AppConfigInfoDto, UserInfoDto } from '../api/generated/model';
import {
  usePostApiAppConfigGetAppVersion,
} from '../api/generated/app-config/app-config';
import type { postApiAppConfigGetAppVersionResponse } from '../api/generated/app-config/app-config';
import { getApiCheckToken } from '../api/generated/user/user';
import { shouldResetAuthSession } from '../lib/authRouting';

const parseVersionParts = (version?: string | null): number[] => {
  if (!version) {
    return [];
  }

  return version
    .split('.')
    .map((part) => Number.parseInt(part.replace(/[^0-9]/g, ''), 10))
    .map((part) => (Number.isNaN(part) ? 0 : part));
};

const compareVersions = (
  currentVersion?: string | null,
  requiredVersion?: string | null,
): number => {
  const currentParts = parseVersionParts(currentVersion);
  const requiredParts = parseVersionParts(requiredVersion);
  const maxLength = Math.max(currentParts.length, requiredParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const currentPart = currentParts[index] ?? 0;
    const requiredPart = requiredParts[index] ?? 0;

    if (currentPart > requiredPart) {
      return 1;
    }

    if (currentPart < requiredPart) {
      return -1;
    }
  }

  return 0;
};

const getAppVersion = () => {
  if (Constants.default.expoConfig?.version) {
    return Constants.default.expoConfig.version;
  }
  if (Updates.runtimeVersion) {
    return Updates.runtimeVersion;
  }
  return Application.nativeApplicationVersion?.trim();
};

export const useAppInitialization = () => {
  const [appConfig, setAppConfig] = useState<AppConfigInfoDto | null>(null);
  const [canValidateToken, setCanValidateToken] = useState<boolean>(false);
  const { setErrors, setIsTokenChecked, isTokenChecked } = useAppContext();
  const { syncTutorialState } = useOnboarding();
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const { mutate: checkVersion } = usePostApiAppConfigGetAppVersion({});

  const checkIsUpdateRequired = useCallback(async (appVersionConfig: AppConfigInfoDto) => {
    const appVersion = getAppVersion();

    if (
      !appVersionConfig.minRequiredVersion ||
      compareVersions(appVersion, appVersionConfig.minRequiredVersion) >= 0
    ) {
      setCanValidateToken(true);
    } else {
      setAppConfig(appVersionConfig);
    }
  }, []);

  const setSessionAndMarkValidated = useCallback(
    async (userInfo: UserInfoDto, sessionToken: string): Promise<void> => {
      await setSession(sessionToken, userInfo);
      setErrors([]);
      setIsTokenChecked(true);
      await syncTutorialState(Boolean(userInfo.hasActiveTutorials));
    },
    [setErrors, setIsTokenChecked, setSession, syncTutorialState],
  );

  const resetSessionState = useCallback(
    async (errorMessage?: string): Promise<void> => {
      await clearSession();
      setIsTokenChecked(true);

      if (errorMessage) {
        setErrors([errorMessage]);
      }
    },
    [clearSession, setErrors, setIsTokenChecked],
  );

  const validateTokenAndRoute = useCallback(async (): Promise<void> => {
    if (isTokenChecked || !isHydrated) return;

    const tokenToValidate = token;

    if (!tokenToValidate) {
      await clearSession();
      setIsTokenChecked(true);
      return;
    }

    try {
      const response = await getApiCheckToken();
      if (response?.data && 'name' in response.data) {
        const userInfo = response.data as UserInfoDto;
        await setSessionAndMarkValidated(userInfo, tokenToValidate);
        return;
      }
      await resetSessionState('Authentication failed. Please log in again.');
    } catch (error) {
      console.error('Token check failed:', error);
      await resetSessionState(
        shouldResetAuthSession(error)
          ? 'Session expired. Please log in again.'
          : 'Authentication failed. Please log in again.',
      );
    }
  }, [
    clearSession,
    isHydrated,
    isTokenChecked,
    token,
    resetSessionState,
    setIsTokenChecked,
    setSessionAndMarkValidated,
  ]);

  const initializeApp = useCallback(async (): Promise<void> => {
    const platform = Platform.OS === 'android' ? Platforms.Android : Platforms.Ios;
    checkVersion(
      {
        data: { platform: platform },
      },
      {
        onSuccess: (response: postApiAppConfigGetAppVersionResponse) => {
          const appVersionConfig = response.data as AppConfigInfoDto;
          checkIsUpdateRequired(appVersionConfig);
        },
        onError: (error: unknown) => {
          console.error('Error checking app version:', error);
          setCanValidateToken(true);
        },
      },
    );
  }, [checkIsUpdateRequired, checkVersion]);

  useEffect(() => {
    void initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    void hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!canValidateToken || !isHydrated) return;
    void validateTokenAndRoute();
  }, [canValidateToken, isHydrated, validateTokenAndRoute]);

  useEffect(() => {
    if (!isHydrated) return;

    void SplashScreen.hideAsync().catch((error) => {
      console.error('Error hiding splash screen:', error);
    });
  }, [isHydrated]);

  return {
    appConfig,
  };
};

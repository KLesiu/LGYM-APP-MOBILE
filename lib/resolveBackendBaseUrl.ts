import { Platform } from 'react-native';

const trimTrailingSlash = (value: string): string => {
  let end = value.length;

  while (end > 0 && value[end - 1] === '/') {
    end -= 1;
  }

  return value.slice(0, end);
};

const isLoopbackHost = (host: string): boolean => host === 'localhost' || host === '127.0.0.1';

const getAndroidEmulatorHost = (): string | null => {
  const configuredHost = process.env.REACT_APP_ANDROID_EMULATOR_HOST?.trim();
  return configuredHost ?? null;
};

const getMetroHostName = (hostUri?: string | null): string | null => {
  if (!hostUri) {
    return null;
  }

  const hostName = hostUri.split(':')[0]?.trim();
  if (!hostName || isLoopbackHost(hostName)) {
    return null;
  }

  return hostName;
};

export const resolveBackendBaseUrl = (
  rawUrl?: string,
  options?: { dev?: boolean; metroHostUri?: string | null },
): string | undefined => {
  if (!rawUrl) {
    return undefined;
  }

  const dev = options?.dev ?? __DEV__;
  const normalizedInput = trimTrailingSlash(rawUrl.trim());

  if (!dev && normalizedInput.startsWith('http://')) {
    throw new Error('HTTPS required in release');
  }

  try {
    const parsed = new URL(normalizedInput);

    if (!dev || !isLoopbackHost(parsed.hostname)) {
      return normalizedInput;
    }

    const metroHost = getMetroHostName(options?.metroHostUri);
    if (metroHost) {
      parsed.hostname = metroHost;
      return trimTrailingSlash(parsed.toString());
    }

    if (Platform.OS === 'android') {
      const emulatorHost = getAndroidEmulatorHost();
      if (emulatorHost) {
        parsed.hostname = emulatorHost;
        return trimTrailingSlash(parsed.toString());
      }

      if (dev) {
        console.warn(
          '[custom-instance] Android loopback detected. Set REACT_APP_ANDROID_EMULATOR_HOST or use a LAN IP in REACT_APP_BACKEND.',
        );
      }

      return normalizedInput;
    }

    return normalizedInput;
  } catch {
    return normalizedInput;
  }
};

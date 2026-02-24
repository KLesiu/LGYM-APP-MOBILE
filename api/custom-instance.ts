import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';
import i18n from '../app/i18n';

type CancelablePromise<T> = Promise<T> & { cancel: () => void };

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

const getMetroHostName = (): string | null => {
  const fromExpoConfig = Constants.expoConfig?.hostUri;
  const fromManifest2 = (
    Constants as unknown as {
      manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
    }
  ).manifest2?.extra?.expoClient?.hostUri;
  const fromManifest = (Constants as unknown as { manifest?: { debuggerHost?: string } })
    .manifest?.debuggerHost;
  const hostUri = fromExpoConfig ?? fromManifest2 ?? fromManifest;

  if (!hostUri) {
    return null;
  }

  const hostName = hostUri.split(':')[0]?.trim();
  if (!hostName || isLoopbackHost(hostName)) {
    return null;
  }

  return hostName;
};

const resolveBackendBaseUrl = (rawUrl?: string): string | undefined => {
  if (!rawUrl) {
    return undefined;
  }

  const normalizedInput = trimTrailingSlash(rawUrl.trim());

  try {
    const parsed = new URL(normalizedInput);

    if (!__DEV__ || !isLoopbackHost(parsed.hostname)) {
      return normalizedInput;
    }

    const metroHost = getMetroHostName();
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

      if (__DEV__) {
        console.warn(
          '[custom-instance] Android loopback detected. Set REACT_APP_ANDROID_EMULATOR_HOST or use a LAN IP in REACT_APP_BACKEND.'
        );
      }

      return normalizedInput;
    }

    return normalizedInput;
  } catch {
    return normalizedInput;
  }
};

const toHeaderRecord = (headers?: HeadersInit): Record<string, string> => {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, String(value)])
  );
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: resolveBackendBaseUrl(process.env.REACT_APP_BACKEND),
});

export const customInstance = <T>(
  url: string,
  options?: RequestInit & { data?: unknown },
): Promise<T> => {
  const source = axios.CancelToken.source();

  const { body } = options || {};
  const axiosConfig: AxiosRequestConfig = {
    url,
    method: options?.method,
    data: body ?? options?.data,
    cancelToken: source.token,
  };

  // Set default Content-Type for POST/PUT/PATCH requests with body
  const headers: Record<string, string> = {};
  if ((options?.method === 'POST' || options?.method === 'PUT' || options?.method === 'PATCH') && (body || options?.data)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options?.headers) {
    axiosConfig.headers = {
      ...headers,
      ...toHeaderRecord(options.headers),
    };
  } else if (Object.keys(headers).length > 0) {
    axiosConfig.headers = headers;
  }
  const promise = AXIOS_INSTANCE(axiosConfig)
    .then((response) => {
      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
      } as T;
    })
    .catch((error) => {
      throw error;
    }) as CancelablePromise<T>;

  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const language = i18n.language || 'en';

  const requestHeaders = AxiosHeaders.from(config.headers);

  // Check for custom header to skip auth
  if (requestHeaders.get('X-Skip-Auth')) {
    requestHeaders.delete('X-Skip-Auth');
    config.headers = requestHeaders;
    return config;
  }

  // Set language header
  requestHeaders.set('Accept-Language', language);

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  config.headers = requestHeaders;
  return config;
});

import axios, { AxiosHeaders } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import i18n from '../lib/i18n';
import { useAuthStore } from '../stores/useAuthStore';
import { resolveBackendBaseUrl } from '../lib/resolveBackendBaseUrl';
import { secureStorage } from '../lib/secureStorage';

type CancelablePromise<T> = Promise<T> & { cancel: () => void };

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

  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, String(value)]));
};

const resolvedBaseURL = resolveBackendBaseUrl(process.env.REACT_APP_BACKEND, {
  dev: __DEV__,
  metroHostUri:
    Constants.expoConfig?.hostUri ??
    (
      Constants as unknown as {
        manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
      }
    ).manifest2?.extra?.expoClient?.hostUri ??
    (Constants as unknown as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost ??
    null,
});

export const AXIOS_INSTANCE = axios.create(
  resolvedBaseURL ? { baseURL: resolvedBaseURL } : {},
);

export const customInstance = <T>(
  url: string,
  options?: RequestInit & { data?: unknown },
): Promise<T> => {
  const source = axios.CancelToken.source();

  const { body } = options ?? {};
  const axiosConfig: AxiosRequestConfig = {
    url,
    data: body ?? options?.data,
    cancelToken: source.token,
    ...(options?.method ? { method: options.method } : {}),
  };

  // Set default Content-Type for POST/PUT/PATCH requests with body
  const headers: Record<string, string> = {};
  if (
    (options?.method === 'POST' || options?.method === 'PUT' || options?.method === 'PATCH') &&
    (body || options?.data)
  ) {
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

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token ?? (await secureStorage.getItem('token'));
  const language = i18n.language ?? 'en';

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

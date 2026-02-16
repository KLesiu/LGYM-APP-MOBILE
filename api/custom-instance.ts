import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import i18n from '../app/i18n';

export const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
});

export const customInstance = <T>(
  url: string,
  options?: RequestInit & { data?: unknown },
): Promise<T> => {
  const source = axios.CancelToken.source();

  const { body, ...rest } = options || {};
  const axiosConfig: AxiosRequestConfig = {
    url,
    method: options?.method,
    data: body || options?.data,
    cancelToken: source.token,
  };

  // Set default Content-Type for POST/PUT/PATCH requests with body
  const headers: Record<string, string> = {};
  if ((options?.method === 'POST' || options?.method === 'PUT' || options?.method === 'PATCH') && (body || options?.data)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options?.headers) {
    axiosConfig.headers = { ...headers, ...options.headers } as any;
  } else if (Object.keys(headers).length) {
    axiosConfig.headers = headers as any;
  }
  const promise = AXIOS_INSTANCE(axiosConfig).then((response) => {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    } as T;
  }).catch((error) => {
    throw error;
  });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const language = i18n.language || 'en';
  
  // Check for custom header to skip auth
  if (config.headers['X-Skip-Auth']) {
    delete config.headers['X-Skip-Auth'];
    return config;
  }

  // Set language header
  config.headers['Accept-Language'] = language;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

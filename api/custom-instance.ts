import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

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

  if (options?.headers) {
    axiosConfig.headers = options.headers as any;
  }
  const promise = AXIOS_INSTANCE(axiosConfig).then((response) => {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    } as T;
  });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  
  // Check for custom header to skip auth
  if (config.headers['X-Skip-Auth']) {
    delete config.headers['X-Skip-Auth'];
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

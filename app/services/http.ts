import axios, { AxiosError } from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const get = async (url: string,token?:string, params?: Record<string, any>) => {
  const fullUrl = http.defaults.baseURL + url;
  if(token) http.defaults.headers.common['Authorization'] = `Bearer ${token}`
  try {
    const response = await http.get(fullUrl, { params });
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

const post = async (url: string,token?:string, data?: Record<string, any>) => {
  const fullUrl = http.defaults.baseURL + url;
  if(token) http.defaults.headers.common['Authorization'] = `Bearer ${token}`
  try {
    const response = await http.post(fullUrl, data);
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

export { get, post };
export default http;

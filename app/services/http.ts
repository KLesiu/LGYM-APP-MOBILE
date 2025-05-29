import axios, { AxiosError } from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const get = async (url: string, params?: Record<string, any>) => {
  const fullUrl = http.defaults.baseURL + url;
  try {
    const response = await http.get(fullUrl, { params });
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

const post = async (url: string, data?: Record<string, any>) => {
  const fullUrl = http.defaults.baseURL + url;
  try {
    const response = await http.post(fullUrl, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error as AxiosError;
  }
};

export { get, post };

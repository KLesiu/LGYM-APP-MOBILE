import { createContext, useContext, useEffect, useState } from "react";
import { get, post } from "./services/http";
import { AxiosError, AxiosResponse } from "axios";
import { Message } from "../enums/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextProps {
  postAPI: (
    url: string,
    callback: any,
    data?: Record<string, any>,
    serveErrors?: boolean
  ) => Promise<void>;
  getAPI: (
    url: string,
    callback: any,
    params?: Record<string, any>,
    serveErrors?: boolean
  ) => Promise<void>;
  errors: string[];
  isLoading: boolean;
  setErrors: (errors: string[]) => void;
  clearBeforeLogout: () => Promise<void>;
  token?: string;
}

const AppContext = createContext<AppContextProps | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}
const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canAppStart, setCanAppStart] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    getTokenFromLocalStorage();
  }, []);

  const getTokenFromLocalStorage = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) setToken(token);
    setCanAppStart(true);
  };

  const getAPI = async (
    url: string,
    callback: any,
    params?: Record<string, any>,
    serveErrors = true
  ) => {
    try {
      setIsLoading(true);
      const response = await get(url, token, params);
      callback(response);
    } catch (error) {
      if (serveErrors) catchErrors(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const postAPI = async (
    url: string,
    callback: any,
    data?: Record<string, any>,
    serveErrors = true
  ) => {
    try {
      setIsLoading(true);
      setErrors([]);
      const response = await post(url, token, data);
      callback(response);
    } catch (error) {
      if (serveErrors) catchErrors(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const catchErrors = (error: any) => {
    if (error instanceof AxiosError) {
      if (!error.response) {
        setErrors([error.message]);
        return;
      }
      const { status, data } = error.response as AxiosResponse;
      if (status === 500) {
        setErrors([Message.TryAgain]);
      } else {
        setErrors([data.msg]);
      }
    }
  };

  const clearBeforeLogout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    keys.forEach(async (ele) => await deleteFromStorage(ele));
    setToken(undefined);
  };

  const deleteFromStorage = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  };

  return (
    <AppContext.Provider
      value={{
        postAPI,
        getAPI,
        errors,
        isLoading,
        setErrors,
        clearBeforeLogout,
        token,
      }}
    >
      {canAppStart && children}
    </AppContext.Provider>
  );
};
export default AppProvider;

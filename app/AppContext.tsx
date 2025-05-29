import { createContext, useContext, useState } from "react";
import { get, post } from "./services/http";
import { AxiosError, AxiosResponse } from "axios";
import { Message } from "../enums/Message";

interface AppContextProps {
  postAPI: (
    url: string,
    callback: any,
    data?: Record<string, any>
  ) => Promise<void>;
  getAPI: (url: string, params?: Record<string, any>) => Promise<void>;
  errors: string[];
  isLoading: boolean;
  setErrors: (errors: string[]) => void;
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
  const [errors, setErrors] = useState<string[]>([]);

  const getAPI = async (url: string, params?: Record<string, any>) => {
    const response = await get(url, params);
  };

  const postAPI = async (
    url: string,
    callback: any,
    data?: Record<string, any>
  ) => {
    try {
      setIsLoading(true);
      setErrors([]);
      const response = await post(url, data);
      callback(response);
    } catch (error) {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{ postAPI, getAPI, errors, isLoading, setErrors }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;

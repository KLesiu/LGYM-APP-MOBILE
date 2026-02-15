import React, { useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { Message } from "../enums/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInfo } from "../interfaces/User";
import { useAuthStore } from "../stores/useAuthStore";
import { getApiCheckToken } from "../api/generated/user/user";
import { useQueryClient } from "@tanstack/react-query";

import { UserInfoDto } from "../api/generated/model";

interface AppContextProps {

  errors: string[];
  isLoading: boolean;
  setErrors: (errors: string[]) => void;
  clearBeforeLogout: () => Promise<void>;
  token?: string;
  isTokenChecked: boolean;
  setIsTokenChecked: (value: boolean) => void;
  setToken: (token?: string) => void;
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  getRankColor?: "#CACACA" | "#A733DD" | "#FC2C44" | "#E8CC79";
  changeIsVisibleInRanking: (newValue: boolean) => void;
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isTokenChecked, setIsTokenChecked] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    getTokenFromLocalStorage();
  }, []);

  const getTokenFromLocalStorage = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        setToken(token);
        useAuthStore.getState().setToken(token);
        
        try {
          const response = await getApiCheckToken();
          if (response && response.data && "name" in response.data) {
            const userData = response.data as UserInfoDto;
            const userInfo: UserInfo = {
              ...userData,
              createdAt: userData.createdAt
                ? new Date(userData.createdAt)
                : new Date(),
              updatedAt: userData.updatedAt
                ? new Date(userData.updatedAt)
                : new Date(),
            } as UserInfo;
            setUserInfo(userInfo);
            useAuthStore.getState().setUser(userInfo);
          }
        } catch (error) {
          console.error("Failed to fetch user info on startup", error);
        }
    }
    setCanAppStart(true);
  };



  const clearBeforeLogout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await Promise.all(keys.map((key) => deleteFromStorage(key)));
    setUserInfo(null);
    setToken(undefined);
    setIsTokenChecked(false);
    useAuthStore.getState().logout();
    queryClient.removeQueries();
  };

  const deleteFromStorage = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  };

  const changeIsVisibleInRanking = (newValue: boolean): void => {
    setUserInfo((prevUserInfo: UserInfo | null) => {
      if (!prevUserInfo) return prevUserInfo;
      return { ...prevUserInfo, isVisibleInRanking: newValue };
    });
  };

  const getRankColor = useMemo(() => {
    switch (userInfo?.profileRank) {
      case "Junior 1":
      case "Junior 2":
      case "Junior 3":
        return "#CACACA";
      case "Mid 1":
      case "Mid 2":
      case "Mid 3":
        return "#A733DD";
      case "Pro 1":
      case "Pro 2":
      case "Pro 3":
        return "#FC2C44";
      case "Champ":
        return "#E8CC79";
    }
  }, [userInfo?.profileRank]);

  return (
    <AppContext.Provider
      value={{

        errors,
        isLoading,
        setErrors,
        clearBeforeLogout,
        setIsTokenChecked,
        isTokenChecked,
        token,
        userInfo,
        setUserInfo,
        getRankColor,
        setToken,
        changeIsVisibleInRanking,
      }}
    >
      {canAppStart && children}
    </AppContext.Provider>
  );
};
export default AppProvider;

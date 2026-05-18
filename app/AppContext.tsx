import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface AppContextProps {
  errors: string[];
  isLoading: boolean;
  setErrors: (errors: string[]) => void;
  clearBeforeLogout: () => Promise<void>;
  isTokenChecked: boolean;
  setIsTokenChecked: (value: boolean) => void;
  changeIsVisibleInRanking: (newValue: boolean) => void;
  refreshLocalizedCaches: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}
const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading] = useState<boolean>(false);
  const [canAppStart, setCanAppStart] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isTokenChecked, setIsTokenChecked] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const getTokenFromLocalStorage = useCallback(() => {
    setCanAppStart(true);
  }, []);

  useEffect(() => {
    getTokenFromLocalStorage();
  }, [getTokenFromLocalStorage]);

  const clearBeforeLogout = useCallback(async () => {
    setIsTokenChecked(true);
    queryClient.clear();
  }, [queryClient]);

  const changeIsVisibleInRanking = useCallback((newValue: boolean): void => {
    if (newValue) {
      return;
    }
  }, []);

  const refreshLocalizedCaches = useCallback(async (): Promise<void> => {
    const isLocalizedQuery = (queryKey: readonly unknown[]): boolean => {
      return queryKey.some((part) => {
        if (typeof part !== 'string') {
          return false;
        }

        return (
          part.includes('/getPlanConfig') ||
          part.includes('/getPlansList') ||
          part.includes('/checkIsUserHavePlan') ||
          part.includes('/api/planDay/') ||
          part.includes('/api/exercise/')
        );
      });
    };

    await queryClient.invalidateQueries({
      predicate: (query) => isLocalizedQuery(query.queryKey),
    });
  }, [queryClient]);

  const contextValue = useMemo(
    () => ({
      errors,
      isLoading,
      setErrors,
      clearBeforeLogout,
      setIsTokenChecked,
      isTokenChecked,
      changeIsVisibleInRanking,
      refreshLocalizedCaches,
    }),
    [errors, isLoading, changeIsVisibleInRanking, clearBeforeLogout, isTokenChecked, refreshLocalizedCaches],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {canAppStart && children}
    </AppContext.Provider>
  );
};
export default AppProvider;

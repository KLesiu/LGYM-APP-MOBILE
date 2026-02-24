import { create } from 'zustand';
import type { UserInfoDto } from '../api/generated/model';

interface AuthState {
  token: string | null;
  user: UserInfoDto | null;
  isAuthenticated: boolean;
  setToken: (token: string | null | undefined) => void;
  setUser: (user: UserInfoDto | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));

import { create } from 'zustand';
import type { UserInfoDto } from '../api/generated/model';
import { secureStorage } from '../lib/secureStorage';

export const getAuthRankColor = (profileRank?: string | null): string | undefined => {
  switch (profileRank) {
    case 'Junior 1':
    case 'Junior 2':
    case 'Junior 3':
      return '#CACACA';
    case 'Mid 1':
    case 'Mid 2':
    case 'Mid 3':
      return '#A733DD';
    case 'Pro 1':
    case 'Pro 2':
    case 'Pro 3':
      return '#FC2C44';
    case 'Champ':
      return '#E8CC79';
    default:
      return undefined;
  }
};

interface AuthState {
  token: string | null;
  user: UserInfoDto | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: UserInfoDto) => Promise<void>;
  setToken: (token: string | null | undefined) => void;
  setUser: (user: UserInfoDto | null) => void;
  clearSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  hydrate: async () => {
    await secureStorage.migrateFromAsyncStorage();

    const [tokenValue, username, id, email, roles] = await Promise.all([
      secureStorage.getItem('token'),
      secureStorage.getItem('username'),
      secureStorage.getItem('id'),
      secureStorage.getItem('email'),
      secureStorage.getItem('roles'),
    ]);

    if (!tokenValue) {
      set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
      return;
    }

    let parsedRoles: UserInfoDto['roles'] = undefined;
    if (roles) {
      try {
        parsedRoles = JSON.parse(roles) as UserInfoDto['roles'];
      } catch {
        parsedRoles = undefined;
      }
    }

    set({
      token: tokenValue,
      user: {
        _id: id ?? undefined,
        name: username ?? undefined,
        email: email ?? undefined,
        roles: parsedRoles,
      } as UserInfoDto,
      isAuthenticated: true,
      isHydrated: true,
    });
  },
  setSession: async (token, user) => {
    await Promise.all([
      secureStorage.setItem('token', token),
      secureStorage.setItem('username', user.name || ''),
      secureStorage.setItem('id', user._id || ''),
      secureStorage.setItem('email', user.email || ''),
      secureStorage.setItem('roles', JSON.stringify(user.roles ?? [])),
    ]);

    set({ token, user, isAuthenticated: true, isHydrated: true });
  },
  setToken: (token) =>
    set({ ...(token !== undefined ? { token } : {}), isAuthenticated: token !== null && token !== undefined }),
  setUser: (user) => set({ user }),
  clearSession: async () => {
    await secureStorage.clear();
    set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
  },
  logout: async () => {
    await get().clearSession();
  },
}));

export const ROUTES = {
  root: '/',
  login: '/(auth)/login',
  register: '/(auth)/register',
  home: '/(app)/home',
} as const;

export const ROLES = {
  admin: 'ADMIN',
  user: 'USER',
  moderator: 'MODERATOR',
} as const;

export const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
  id: 'id',
  email: 'email',
  username: 'username',
  roles: 'roles',
  planDay: 'planDay',
  trainingSessionScores: 'trainingSessionScores',
  gym: 'gym',
  storageEncryptionKey: 'storage-encryption-key',
  userLanguage: 'user-language',
} as const;

export const TIMEOUTS = {
  request: 15000,
  persistDebounce: 5000,
} as const;

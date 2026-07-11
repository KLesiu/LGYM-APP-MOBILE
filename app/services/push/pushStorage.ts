import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const PUSH_INSTALLATION_ID_KEY = "pushInstallationId";
export const PUSH_REGISTRATION_STATE_KEY = "pushRegistrationState";

export type PushPermissionStatus =
  | "authorized"
  | "provisional"
  | "denied"
  | "notDetermined"
  | "ephemeral";

export interface PushRegistrationState {
  authToken: string;
  installationId: string;
  fcmToken: string;
  appVersion: string | null;
  environment: string;
  permissionStatus: PushPermissionStatus;
}

export const getStoredPushRegistrationState = async (): Promise<PushRegistrationState | null> => {
  const rawState = await AsyncStorage.getItem(PUSH_REGISTRATION_STATE_KEY);
  if (!rawState) {
    return null;
  }

  try {
    return JSON.parse(rawState) as PushRegistrationState;
  } catch (error) {
    console.error("Failed to parse stored push registration state", error);
    await AsyncStorage.removeItem(PUSH_REGISTRATION_STATE_KEY);
    return null;
  }
};

export const storePushRegistrationState = async (
  state: PushRegistrationState
): Promise<void> => {
  await AsyncStorage.setItem(PUSH_REGISTRATION_STATE_KEY, JSON.stringify(state));
};

export const clearPersistedPushRegistrationState = async (): Promise<void> => {
  await AsyncStorage.removeItem(PUSH_REGISTRATION_STATE_KEY);
};

const createPushInstallationId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).slice(2, 12);

  return `${Platform.OS}-${timestamp}-${randomSuffix}`;
};

export const getOrCreatePushInstallationId = async (): Promise<string> => {
  const existingInstallationId = await AsyncStorage.getItem(PUSH_INSTALLATION_ID_KEY);
  if (existingInstallationId) {
    return existingInstallationId;
  }

  const installationId = createPushInstallationId();
  await AsyncStorage.setItem(PUSH_INSTALLATION_ID_KEY, installationId);
  return installationId;
};

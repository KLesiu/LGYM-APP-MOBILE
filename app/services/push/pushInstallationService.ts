import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import {
  postApiPushInstallationsDisassociate,
  postApiPushInstallationsRegister,
  postApiPushInstallationsUnregister,
} from "../../../api/generated/user/user";
import type { RegisterPushInstallationRequest } from "../../../api/generated/model";
import {
  clearPersistedPushRegistrationState,
  PUSH_INSTALLATION_ID_KEY,
  type PushRegistrationState,
} from "./pushStorage";

export type PushInstallationRegistrationInput = Omit<RegisterPushInstallationRequest, "platform">;

const buildAuthHeaders = (authToken?: string): Record<string, string> | undefined => {
  if (!authToken) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${authToken}`,
    "X-Skip-Auth": "true",
  };
};

export const getPushAppVersion = (): string | null => {
  if (Constants.expoConfig?.version) {
    return Constants.expoConfig.version;
  }

  if (Updates.runtimeVersion) {
    return Updates.runtimeVersion;
  }

  return Application.nativeApplicationVersion?.trim() ?? null;
};

export const getPushEnvironment = (): string => {
  if (__DEV__) {
    return "development";
  }

  const updateChannel = Updates.channel?.trim();
  if (updateChannel) {
    return updateChannel;
  }

  return "production";
};

export const isSamePushRegistrationState = (
  left: PushRegistrationState | null,
  right: PushRegistrationState
): boolean => {
  if (!left) {
    return false;
  }

  return (
    left.authToken === right.authToken &&
    left.installationId === right.installationId &&
    left.fcmToken === right.fcmToken &&
    left.appVersion === right.appVersion &&
    left.environment === right.environment &&
    left.permissionStatus === right.permissionStatus
  );
};

export const registerPushInstallation = async (
  request: PushInstallationRegistrationInput,
  authToken?: string
): Promise<void> => {
  await postApiPushInstallationsRegister(
    {
      installationId: request.installationId,
      platform: Platform.OS,
      fcmToken: request.fcmToken,
      appVersion: request.appVersion,
      environment: request.environment,
      permissionStatus: request.permissionStatus,
    },
    {
      headers: buildAuthHeaders(authToken),
    }
  );
};

export const unregisterPushInstallation = async (
  installationId: string,
  authToken?: string
): Promise<void> => {
  await postApiPushInstallationsUnregister(
    { installationId },
    {
      headers: buildAuthHeaders(authToken),
    }
  );
};

export const disassociatePushInstallation = async (
  installationId: string,
  authToken?: string
): Promise<void> => {
  await postApiPushInstallationsDisassociate(
    { installationId },
    {
      headers: buildAuthHeaders(authToken),
    }
  );
};

export const disassociateStoredPushInstallation = async (authToken?: string): Promise<void> => {
  const installationId = await AsyncStorage.getItem(PUSH_INSTALLATION_ID_KEY);
  if (!installationId) {
    await clearPersistedPushRegistrationState();
    return;
  }

  try {
    await disassociatePushInstallation(installationId, authToken);
  } finally {
    await clearPersistedPushRegistrationState();
  }
};

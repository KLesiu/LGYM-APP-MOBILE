import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

type GoogleAuthSuccessResponse = {
  type: "success";
  params: {
    id_token: string;
    access_token: string | null;
  };
};

type GoogleAuthCancelledResponse = {
  type: "cancelled";
};

type GoogleAuthErrorResponse = {
  type: "error";
  error: string;
};

type GoogleAuthResponse = GoogleAuthSuccessResponse | GoogleAuthCancelledResponse | GoogleAuthErrorResponse;

type GoogleAuthRequest = {
  configured: true;
};

const resolveGoogleClientId = (value?: string | null): string => {
  return value?.trim() || "__missing_google_client_id__";
};

const googleWebClientId = resolveGoogleClientId(
  process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID
);

const googleIosClientId = resolveGoogleClientId(
  process.env.REACT_APP_GOOGLE_IOS_CLIENT_ID
);

const isConfiguredClientId = (value: string): boolean => value !== "__missing_google_client_id__";

export const useGoogleAuth = () => {
  const [response, setResponse] = useState<GoogleAuthResponse | null>(null);

  const request = useMemo<GoogleAuthRequest | null>(() => {
    if (Platform.OS === "web") {
      return null;
    }

    if (!isConfiguredClientId(googleWebClientId)) {
      return null;
    }

    if (Platform.OS === "ios" && !isConfiguredClientId(googleIosClientId)) {
      return null;
    }

    return { configured: true };
  }, []);

  useEffect(() => {
    if (!request) {
      return;
    }

    GoogleSignin.configure({
      webClientId: googleWebClientId,
      iosClientId: Platform.OS === "ios" ? googleIosClientId : undefined,
      scopes: ["openid", "profile", "email"],
    });
  }, [request]);

  const promptAsync = useCallback(async (): Promise<GoogleAuthResponse> => {
    if (!request) {
      const unavailableResponse: GoogleAuthErrorResponse = {
        type: "error",
        error: "Google Sign-In is not configured.",
      };
      setResponse(unavailableResponse);
      return unavailableResponse;
    }

    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const signInResponse = await GoogleSignin.signIn();
      if (isCancelledResponse(signInResponse)) {
        const cancelledResponse: GoogleAuthCancelledResponse = { type: "cancelled" };
        setResponse(cancelledResponse);
        return cancelledResponse;
      }

      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken || signInResponse.data.idToken;
      if (!idToken) {
        const missingTokenResponse: GoogleAuthErrorResponse = {
          type: "error",
          error: "Google Sign-In did not return an ID token.",
        };
        setResponse(missingTokenResponse);
        return missingTokenResponse;
      }

      const successResponse: GoogleAuthSuccessResponse = {
        type: "success",
        params: {
          id_token: idToken,
          access_token: tokens.accessToken || null,
        },
      };
      setResponse(successResponse);
      return successResponse;
    } catch (error) {
      if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
        const cancelledResponse: GoogleAuthCancelledResponse = { type: "cancelled" };
        setResponse(cancelledResponse);
        return cancelledResponse;
      }

      const errorResponse: GoogleAuthErrorResponse = {
        type: "error",
        error: error instanceof Error ? error.message : "Google Sign-In failed.",
      };
      setResponse(errorResponse);
      return errorResponse;
    }
  }, [request]);

  return {
    request,
    response,
    promptAsync,
    googleIdToken: response?.type === "success" ? response.params.id_token : null,
  };
};

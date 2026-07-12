import * as WebBrowser from "expo-web-browser";
import { useIdTokenAuthRequest } from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const resolveGoogleClientId = (value?: string | null): string => {
  return value?.trim() || "__missing_google_client_id__";
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = useIdTokenAuthRequest(
    {
      androidClientId: resolveGoogleClientId(
        process.env.REACT_APP_GOOGLE_ANDROID_CLIENT_ID ?? process.env.REACT_APP_GOOGLE_CLIENT_ID
      ),
      iosClientId: resolveGoogleClientId(
        process.env.REACT_APP_GOOGLE_IOS_CLIENT_ID ?? process.env.REACT_APP_GOOGLE_CLIENT_ID
      ),
      webClientId: resolveGoogleClientId(
        process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID ?? process.env.REACT_APP_GOOGLE_CLIENT_ID
      ),
      scopes: ["openid", "profile", "email"],
    },
    {
      scheme: "lgymappmobile",
    }
  );

  return {
    request,
    response,
    promptAsync,
    googleIdToken: response?.type === "success" ? response.params.id_token ?? null : null,
  };
};

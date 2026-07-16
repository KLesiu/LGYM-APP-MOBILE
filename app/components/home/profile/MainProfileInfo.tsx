import { View, Text, ActivityIndicator } from "react-native";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { useState, useEffect, useMemo } from "react";
import React from "react";
import { useAppContext } from "../../../AppContext";
import { useRouter } from "expo-router";
import ConfirmDialog from "../../elements/ConfirmDialog";
import { FontWeights } from "../../../../enums/FontsProperties";
import Checkbox from "../../elements/Checkbox";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../elements/LanguageSwitcher";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../stores/useAuthStore";
import {
  getGetApiGetUsersRankingQueryKey,
  getApiDeleteAccount,
  usePostApiLogout,
  usePostApiChangeVisibilityInRanking,
} from "../../../../api/generated/user/user";
import {
  getGetApiAccountExternalLoginsQueryKey,
  useGetApiAccountExternalLogins,
  usePostApiAccountLinkGoogle,
} from "../../../../api/generated/account/account";
import { disassociateStoredPushInstallation } from "../../../services/push/pushInstallationService";
import { useGoogleAuth } from "../../../../hooks/useGoogleAuth";
import { unlinkGoogleAccount } from "../../../services/googleAccount";
import toastService from "../../../services/toastService";

const logGoogleAuthError = (context: string, error: unknown): void => {
  if (error instanceof Error) {
    console.error(context, { name: error.name, message: error.message });
    return;
  }

  console.error(context, { message: "Google auth request failed." });
};

interface MainProfileInfoProps {
  email: string;
  isVisibleInRanking: boolean;
}

const MainProfileInfo: React.FC<MainProfileInfoProps> = ({
  email,
  isVisibleInRanking,
}) => {
  const { t } = useTranslation();
  const {
    clearBeforeLogout,
    changeIsVisibleInRanking,
  } = useAppContext();
  const { user, setUser } = useAuthStore();
  const [
    isDeleteConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: externalLogins, isLoading: isExternalLoginsLoading } = useGetApiAccountExternalLogins();
  const { request: googleLinkRequest, response: googleLinkResponse, promptAsync: promptGoogleLink } = useGoogleAuth();
  const [isVisibleInRankingState, setIsVisibleInRankingState] =
    useState<boolean>(isVisibleInRanking);
  const [isGoogleUnlinkPending, setIsGoogleUnlinkPending] = useState(false);
  const [isGoogleUnlinkConfirmationVisible, setIsGoogleUnlinkConfirmationVisible] = useState(false);

  const { mutateAsync: changeVisibilityMutation, isPending: isChangingVisibility } =
    usePostApiChangeVisibilityInRanking();
  const { mutateAsync: logoutMutation } = usePostApiLogout();
  const { mutate: linkGoogleAccount, isPending: isLinkingGoogle } = usePostApiAccountLinkGoogle();

  const googleExternalLogin = useMemo(
    () => externalLogins?.data.find((login) => login.provider === "google") ?? null,
    [externalLogins]
  );

  const isGoogleLinked = Boolean(googleExternalLogin);

  useEffect(() => {
    setIsVisibleInRankingState(isVisibleInRanking);
  }, [isVisibleInRanking]);

  useEffect(() => {
    if (googleLinkResponse?.type !== "success") {
      return;
    }

    const idToken = googleLinkResponse.params.id_token;
    if (!idToken) {
      toastService.showError(t("auth.invalidResponse"), t("profile.googleLinkFailed"));
      return;
    }

    linkGoogleAccount(
      {
        data: {
          idToken,
          accessToken: googleLinkResponse.params.access_token,
        },
      },
      {
        onSuccess: async () => {
          toastService.showSuccess(t("profile.googleLinkSuccess"));
          await queryClient.invalidateQueries({
            queryKey: getGetApiAccountExternalLoginsQueryKey(),
          });
          await queryClient.refetchQueries({
            queryKey: getGetApiAccountExternalLoginsQueryKey(),
            type: "all",
          });
        },
        onError: (error: unknown) => {
          logGoogleAuthError("Google link error:", error);
          toastService.showError(t("profile.googleLinkFailed"), t("common.error"));
        },
      }
    );
  }, [linkGoogleAccount, googleLinkResponse, queryClient, t]);

  const linkGoogle = () => {
    if (!googleLinkRequest) {
      toastService.showError(t("profile.googleAuthUnavailable"), t("common.error"));
      return;
    }

    void promptGoogleLink();
  };

  const unlinkGoogle = async (): Promise<void> => {
    setIsGoogleUnlinkPending(true);

    try {
      await unlinkGoogleAccount();
      toastService.showSuccess(t("profile.googleUnlinkSuccess"));
      await queryClient.invalidateQueries({
        queryKey: getGetApiAccountExternalLoginsQueryKey(),
      });
      await queryClient.refetchQueries({
        queryKey: getGetApiAccountExternalLoginsQueryKey(),
        type: "all",
      });
    } catch (error) {
      console.error("Google unlink error:", error);
      toastService.showError(t("profile.googleUnlinkFailed"), t("common.error"));
    } finally {
      setIsGoogleUnlinkPending(false);
      setIsGoogleUnlinkConfirmationVisible(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await disassociateStoredPushInstallation();
      await logoutMutation();
    } catch (error) {
      console.error("Logout API request failed, proceeding with local logout", error);
    } finally {
      await clearBeforeLogout();
      router.push("/");
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      await disassociateStoredPushInstallation();
    } catch (error) {
      console.error("Push disassociation before account deletion failed", error);
    }

    await getApiDeleteAccount();
    setIsDeleteConfirmationDialogVisible(false);
    await clearBeforeLogout();
    router.push("/");
  };

  const changeVisibility = async (newValue: boolean): Promise<void> => {
    const previousValue = isVisibleInRankingState;
    const previousUser = user;

    setIsVisibleInRankingState(newValue);
    changeIsVisibleInRanking(newValue);
    if (user) {
      setUser({
        ...user,
        isVisibleInRanking: newValue,
      });
    }

    try {
      await changeVisibilityMutation({
        data: { isVisibleInRanking: newValue },
      });

      await queryClient.invalidateQueries({
        queryKey: getGetApiGetUsersRankingQueryKey(),
      });
      await queryClient.refetchQueries({
        queryKey: getGetApiGetUsersRankingQueryKey(),
        type: "all",
      });
    } catch {
      setIsVisibleInRankingState(previousValue);
      changeIsVisibleInRanking(previousValue);
      setUser(previousUser);
    }
  };

  return (
    <View className="bg-bgColor flex flex-col flex-1 justify-between items-center w-full px-4 py-2">
      <View className="flex flex-col w-full" style={{ gap: 8 }}>
        <View style={{ gap: 4 }} className="flex flex-col w-full">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-gray-200/80 font-light text-xs"
          >
            {t('auth.email')}
          </Text>
          <View
            style={{ borderRadius: 8 }}
            className="bg-secondaryColor flex justify-center items-center h-14 smallPhone:h-10 py-4 smallPhone:py-2 px-6"
          >
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-gray-200/80 font-light leading-4 text-sm smallPhone:text-xs"
            >
              {email}
            </Text>
          </View>
        </View>
        <View className="flex flex-row w-full items-center" style={{ gap: 12 }}>
          <Checkbox
            value={isVisibleInRankingState}
            setValue={(value: boolean) => {
              if (isChangingVisibility) return;
              void changeVisibility(value);
            }}
          />
          <Text
            className="text-textColor text-sm smallPhone:text-xs"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            {t('profile.visibleInRanking')}
          </Text>
        </View>
        
        <LanguageSwitcher />

        <View className="w-full" style={{ gap: 8 }}>
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-gray-200/80 font-light text-xs"
          >
            {t("profile.googleAccount")}
          </Text>
          <View style={{ gap: 12 }} className="bg-secondaryColor rounded-lg p-4">
            {isExternalLoginsLoading ? (
              <View className="flex flex-row items-center gap-3">
                <ActivityIndicator color="#FFFFFF" />
                <Text className="text-textColor text-sm" style={{ fontFamily: "OpenSans_300Light" }}>
                  {t("profile.googleLoading")}
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-textColor text-sm" style={{ fontFamily: "OpenSans_300Light" }}>
                  {isGoogleLinked ? t("profile.googleLinked") : t("profile.googleNotLinked")}
                </Text>
                {googleExternalLogin?.providerEmail ? (
                  <Text className="text-textColor text-sm" style={{ fontFamily: "OpenSans_300Light" }}>
                    {googleExternalLogin.providerEmail}
                  </Text>
                ) : null}
                {isGoogleLinked ? (
                  <CustomButton
                    text={t("profile.googleUnlink")}
                    onPress={() => setIsGoogleUnlinkConfirmationVisible(true)}
                    customClasses="w-full"
                    textWeight={FontWeights.bold}
                    buttonStyleType={ButtonStyle.cancel}
                    isLoading={isGoogleUnlinkPending}
                  />
                ) : (
                  <CustomButton
                    text={t("profile.googleLink")}
                    onPress={linkGoogle}
                    customClasses="w-full"
                    textWeight={FontWeights.bold}
                    buttonStyleType={ButtonStyle.outline}
                    isLoading={isLinkingGoogle}
                    disabled={!googleLinkRequest || isGoogleUnlinkPending}
                  />
                )}
              </>
            )}
          </View>
        </View>

      </View>

      <View className="flex flex-row  w-full" style={{gap:16}}>
        <CustomButton
          text={t('profile.logout')}
          customClasses="flex-1"
          onPress={logout}
          textWeight={FontWeights.bold}
          buttonStyleType={ButtonStyle.success}
        />
        <CustomButton
          text={t('profile.deleteAccount')}
          onPress={() => setIsDeleteConfirmationDialogVisible(true)}
          customClasses="flex-1"
          textWeight={FontWeights.bold}
          buttonStyleType={ButtonStyle.cancel}
        />
      </View>
      <ConfirmDialog
        visible={isDeleteConfirmationDialogVisible}
        title={t('profile.confirmDeleteTitle')}
        message={t('profile.confirmDeleteMessage')}
        onConfirm={deleteAccount}
        onCancel={() => setIsDeleteConfirmationDialogVisible(false)}
      />
      <ConfirmDialog
        visible={isGoogleUnlinkConfirmationVisible}
        title={t('profile.googleUnlinkConfirmTitle')}
        message={t('profile.googleUnlinkConfirmMessage')}
        onConfirm={unlinkGoogle}
        onCancel={() => setIsGoogleUnlinkConfirmationVisible(false)}
      />
    </View>
  );
};
export default MainProfileInfo;

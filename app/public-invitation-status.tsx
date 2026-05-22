import React, { useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect, Stack, useLocalSearchParams } from "expo-router";
import { useAppContext } from "./AppContext";
import { useTranslation } from "react-i18next";
import toastService from "./services/toastService";
import { useGetApiInvitationsInvitationId } from "../api/generated/public-invitation/public-invitation";
import {
  usePostApiTraineeInvitationsInvitationIdAccept,
  usePostApiTraineeInvitationsInvitationIdReject,
} from "../api/generated/trainee-relationship/trainee-relationship";
import { getErrorMessage } from "../utils/errorHandler";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";

const PublicInvitationStatus: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { setErrors: setAppErrors } = useAppContext();
  const params = useLocalSearchParams();
  
  const invitationId = typeof params.invitationId === "string" ? params.invitationId : "";
  const code = typeof params.code === "string" ? params.code : undefined;

  const {
    data: invitationResponse,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetApiInvitationsInvitationId(invitationId, code ? { code } : undefined, {
    query: {
      enabled: !!invitationId,
    },
  });

  const invitationData = invitationResponse?.data;

  const acceptMutation = usePostApiTraineeInvitationsInvitationIdAccept({
    mutation: {
      onSuccess: () => {
        toastService.showSuccess(
          t("invitation.acceptSuccess") || "Invitation accepted successfully"
        );
        refetch();
      },
      onError: (error) => {
        const errorMsg = getErrorMessage(
          error,
          t("invitation.acceptError") || "Failed to accept invitation"
        );
        toastService.showError(errorMsg);
      },
    },
  });

  const rejectMutation = usePostApiTraineeInvitationsInvitationIdReject({
    mutation: {
      onSuccess: () => {
        toastService.showSuccess(
          t("invitation.rejectSuccess") || "Invitation rejected"
        );
        refetch();
      },
      onError: (error) => {
        const errorMsg = getErrorMessage(
          error,
          t("invitation.rejectError") || "Failed to reject invitation"
        );
        toastService.showError(errorMsg);
      },
    },
  });

  useFocusEffect(
    useCallback(() => {
      setAppErrors([]);
      toastService.hide();

      return () => {
        toastService.hide();
      };
    }, [setAppErrors])
  );

  const handleAccept = () => {
    if (invitationId) {
      acceptMutation.mutate({ invitationId });
    }
  };

  const handleReject = () => {
    if (invitationId) {
      rejectMutation.mutate({ invitationId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "accepted":
        return "#4CAF50";
      case "rejected":
      case "declined":
        return "#F44336";
      case "expired":
        return "#999";
      default:
        return "#999";
    }
  };

  const renderContent = () => {
    if (!invitationId) {
      return (
        <View className="flex items-center justify-center p-4">
          <Text
            className="text-red-500 text-lg text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("invitation.missingId") || "Missing invitation ID"}
          </Text>
          <Text
            className="text-fifthColor text-base text-center mt-2"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t("invitation.invalidLink") || "The invitation link is invalid"}
          </Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View className="flex items-center justify-center p-4">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text
            className="text-fifthColor text-base mt-4"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t("invitation.loading") || "Loading invitation..."}
          </Text>
        </View>
      );
    }

    if (fetchError) {
      const errorMsg = getErrorMessage(
        fetchError,
        t("invitation.fetchError") || "Failed to load invitation"
      );
      return (
        <View className="flex items-center justify-center p-4">
          <Text
            className="text-red-500 text-lg text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("common.error") || "Error"}
          </Text>
          <Text
            className="text-fifthColor text-base text-center mt-2"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {errorMsg}
          </Text>
        </View>
      );
    }

    if (!invitationData) {
      return (
        <View className="flex items-center justify-center p-4">
          <Text
            className="text-fifthColor text-lg text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("invitation.notFound") || "Invitation not found"}
          </Text>
        </View>
      );
    }

    const status = String(invitationData.status || "unknown");
    const isPending = status.toLowerCase() === "pending";
    const isAccepted = status.toLowerCase() === "accepted";
    const isRejected = status.toLowerCase() === "rejected" || status.toLowerCase() === "declined";
    const isExpired = status.toLowerCase() === "expired";

    return (
      <View className="flex items-center p-4" style={{ gap: 24 }}>
        <View
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          <Text
            className="text-white text-lg"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {status.toUpperCase()}
          </Text>
        </View>

        <View className="w-full bg-white rounded-lg p-6" style={{ gap: 16 }}>
          <Text
            className="text-textColor text-xl text-center"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("invitation.trainerInvitation") || "Trainer Invitation"}
          </Text>

          <View style={{ gap: 8 }}>
            <Text
              className="text-fifthColor text-base"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("invitation.status") || "Status"}: {status}
            </Text>
            {invitationData.userExists !== undefined && (
              <Text
                className="text-fifthColor text-base"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {t("invitation.userExists") || "User exists"}:{" "}
                {invitationData.userExists ? t("common.yes") || "Yes" : t("common.no") || "No"}
              </Text>
            )}
          </View>
        </View>

        {isPending && (
          <Text
            className="text-fifthColor text-base text-center"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t("invitation.pendingMessage") || "Please accept or decline this invitation"}
          </Text>
        )}

        {isAccepted && (
          <Text
            className="text-green-600 text-base text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("invitation.acceptedMessage") || "You have accepted this invitation"}
          </Text>
        )}

        {isRejected && (
          <Text
            className="text-red-500 text-base text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("invitation.rejectedMessage") || "You have declined this invitation"}
          </Text>
        )}

        {isExpired && (
          <Text
            className="text-gray-500 text-base text-center"
            style={{ fontFamily: "OpenSans_600SemiBold" }}
          >
            {t("invitation.expiredMessage") || "This invitation has expired"}
          </Text>
        )}

        {isPending && (
          <View className="w-full" style={{ gap: 12 }}>
            <CustomButton
              text={
                acceptMutation.isPending
                  ? t("common.loading") || "Loading..."
                  : t("invitation.accept") || "Accept"
              }
              onPress={handleAccept}
              buttonStyleType={ButtonStyle.success}
              buttonStyleSize={ButtonSize.regular}
              disabled={acceptMutation.isPending || rejectMutation.isPending}
            />
            <CustomButton
              text={
                rejectMutation.isPending
                  ? t("common.loading") || "Loading..."
                  : t("invitation.decline") || "Decline"
              }
              onPress={handleReject}
              buttonStyleType={ButtonStyle.cancel}
              buttonStyleSize={ButtonSize.regular}
              disabled={acceptMutation.isPending || rejectMutation.isPending}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("invitation.statusTitle") || "Invitation Status",
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={{ gap: 16, flexGrow: 1 }}
            className="flex items-center flex-col justify-center bg-bgColor"
          >
            {renderContent()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default PublicInvitationStatus;

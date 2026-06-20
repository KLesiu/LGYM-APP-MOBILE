import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  usePostApiTraineeInvitationsInvitationIdAccept,
  usePostApiTraineeInvitationsInvitationIdReject,
} from "../../../api/generated/trainee-relationship/trainee-relationship";
import { useNotifications } from "../../contexts/NotificationContext";
import {
  getInvitationIdFromRedirectUrl,
  isTrainerInvitationNotificationType,
} from "../../types/notification";
import toastService from "../../services/toastService";
import { getErrorMessage } from "../../../utils/errorHandler";

const PendingTrainerInvitationCard: React.FC = () => {
  const { t } = useTranslation();
  const { activeNotification, clearActiveNotification, fetchNotifications, refreshUnreadCount } =
    useNotifications();
  const { mutateAsync: acceptInvitation, isPending: isAccepting } =
    usePostApiTraineeInvitationsInvitationIdAccept();
  const { mutateAsync: rejectInvitation, isPending: isRejecting } =
    usePostApiTraineeInvitationsInvitationIdReject();

  const invitationId = useMemo(
    () => getInvitationIdFromRedirectUrl(activeNotification?.redirectUrl),
    [activeNotification?.redirectUrl]
  );

  const isTrainerInvitation = isTrainerInvitationNotificationType(
    activeNotification?.type
  );
  const isSubmitting = isAccepting || isRejecting;

  if (!activeNotification || !isTrainerInvitation || !invitationId) {
    return null;
  }

  const handleSuccess = async (message: string) => {
    toastService.showSuccess(message);
    clearActiveNotification();
    await refreshUnreadCount();
    await fetchNotifications(0, 20);
  };

  const handleAccept = async () => {
    try {
      await acceptInvitation({ invitationId });
      await handleSuccess(t("trainer.invitationAccepted"));
    } catch (error) {
      toastService.showError(
        getErrorMessage(error, t("trainer.invitationAcceptFailed"))
      );
    }
  };

  const handleReject = async () => {
    try {
      await rejectInvitation({ invitationId });
      await handleSuccess(t("trainer.invitationRejected"));
    } catch (error) {
      toastService.showError(
        getErrorMessage(error, t("trainer.invitationRejectFailed"))
      );
    }
  };

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
      <Text
        className="text-primaryColor text-base"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {t("trainer.pendingInvitationTitle")}
      </Text>

      <Text
        className="text-textColor text-sm"
        style={{ fontFamily: "OpenSans_400Regular" }}
      >
        {activeNotification.message ||
          t("trainer.pendingInvitationDescription")}
      </Text>

      <View className="flex-row" style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={handleAccept}
          disabled={isSubmitting}
          className={`flex-1 p-3 rounded-lg ${
            isSubmitting ? "bg-primaryColor/60" : "bg-primaryColor"
          }`}
        >
          <Text
            className="text-black text-center"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {isAccepting
              ? t("common.loading", "Loading...")
              : t("trainer.acceptInvitation")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReject}
          disabled={isSubmitting}
          className={`flex-1 p-3 rounded-lg ${
            isSubmitting ? "bg-red-500/60" : "bg-red-500"
          }`}
        >
          <Text
            className="text-white text-center"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {isRejecting
              ? t("common.loading", "Loading...")
              : t("trainer.rejectInvitation")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PendingTrainerInvitationCard;

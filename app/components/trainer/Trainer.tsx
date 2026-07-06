import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHomeContext } from "../home/HomeContext";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import NoTrainerState from "./NoTrainerState";
import WithTrainerState from "./WithTrainerState";
import ViewLoading from "../elements/ViewLoading";
import { useGetApiTraineeTrainer } from "../../../api/generated/trainee-relationship/trainee-relationship";
import { useNotifications } from "../../contexts/NotificationContext";
import { isTrainerInvitationNotificationType } from "../../types/notification";

const Trainer: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const { registerScreen } = useOnboarding();
  const { activeNotification, clearActiveNotification } = useNotifications();
  const { data: trainerResponse, isLoading: isTrainerLoading, error } =
    useGetApiTraineeTrainer({
      query: {
        refetchOnMount: "always",
      },
    });

  useEffect(() => {
    registerScreen("TRAINER");
  }, [registerScreen]);

  const hasTrainerRelationship = !!trainerResponse?.data?.trainerId && !error;

  useEffect(() => {
    if (
      hasTrainerRelationship &&
      isTrainerInvitationNotificationType(activeNotification?.type)
    ) {
      clearActiveNotification();
    }
  }, [activeNotification?.type, clearActiveNotification, hasTrainerRelationship]);

  if (!userId || isTrainerLoading) {
    return <ViewLoading />;
  }

  if (!hasTrainerRelationship) {
    return <NoTrainerState />;
  }

  return <WithTrainerState trainerProfile={trainerResponse?.data} />;
};

export default Trainer;

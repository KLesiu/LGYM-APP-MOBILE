import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHomeContext } from "../home/HomeContext";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import NoTrainerState from "./NoTrainerState";
import WithTrainerState from "./WithTrainerState";
import ViewLoading from "../elements/ViewLoading";
import { useNotifications } from "../../contexts/NotificationContext";
import { useGetApiTraineePlanActive } from "../../../api/generated/trainee-relationship/trainee-relationship";

const Trainer: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const { registerScreen } = useOnboarding();
  const { activeNotification, clearActiveNotification } = useNotifications();
  const { data: planResponse, isLoading: isPlanLoading } = useGetApiTraineePlanActive();

  useEffect(() => {
    registerScreen("TRAINER");
  }, [registerScreen]);

  useEffect(() => {
    if (!activeNotification) {
      return;
    }

    clearActiveNotification();
  }, [activeNotification, clearActiveNotification]);

  if (!userId || isPlanLoading) {
    return <ViewLoading />;
  }

  const hasActivePlan = !!planResponse?.data?._id;

  if (!hasActivePlan) {
    return <NoTrainerState />;
  }

  return <WithTrainerState />;
};

export default Trainer;

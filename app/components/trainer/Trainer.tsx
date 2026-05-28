import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHomeContext } from "../home/HomeContext";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import NoTrainerState from "./NoTrainerState";
import WithTrainerState from "./WithTrainerState";
import ViewLoading from "../elements/ViewLoading";
import { useNotifications } from "../../contexts/NotificationContext";

const Trainer: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const { registerScreen } = useOnboarding();
  const { activeNotification, clearActiveNotification } = useNotifications();
  const [hasTrainer, setHasTrainer] = useState<boolean | null>(null);

  useEffect(() => {
    registerScreen("TRAINER");
  }, [registerScreen]);

  useEffect(() => {
    if (!activeNotification) {
      return;
    }

    clearActiveNotification();
  }, [activeNotification, clearActiveNotification]);

  useEffect(() => {
    if (userId) {
      setHasTrainer(true);
    }
  }, [userId]);

  if (!userId || hasTrainer === null) {
    return <ViewLoading />;
  }

  if (!hasTrainer) {
    return <NoTrainerState />;
  }

  return <WithTrainerState />;
};

export default Trainer;

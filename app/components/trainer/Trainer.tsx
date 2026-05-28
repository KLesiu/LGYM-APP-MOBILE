import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHomeContext } from "../home/HomeContext";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import NoTrainerState from "./NoTrainerState";
import ViewLoading from "../elements/ViewLoading";

const Trainer: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const { registerScreen } = useOnboarding();
  const [hasTrainer, setHasTrainer] = useState<boolean | null>(null);

  useEffect(() => {
    registerScreen("TRAINER");
  }, [registerScreen]);

  useEffect(() => {
    // For now, default to no trainer state
    // In the future, this would check the user's trainer relationship via API
    if (userId) {
      setHasTrainer(false);
    }
  }, [userId]);

  if (!userId || hasTrainer === null) {
    return <ViewLoading />;
  }

  if (!hasTrainer) {
    return <NoTrainerState />;
  }

  // TODO: Implement WithTrainerState component for when user has a trainer
  return <ViewLoading />;
};

export default Trainer;

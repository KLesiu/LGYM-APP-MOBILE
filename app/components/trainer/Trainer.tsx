import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHomeContext } from "../home/HomeContext";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import NoTrainerState from "./NoTrainerState";
import WithTrainerState from "./WithTrainerState";
import ViewLoading from "../elements/ViewLoading";
import { useGetApiTraineeTrainer } from "../../../api/generated/trainee-relationship/trainee-relationship";

const Trainer: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const { registerScreen } = useOnboarding();
  const { data: trainerResponse, isLoading: isTrainerLoading, error } =
    useGetApiTraineeTrainer();

  useEffect(() => {
    registerScreen("TRAINER");
  }, [registerScreen]);

  if (!userId || isTrainerLoading) {
    return <ViewLoading />;
  }

  const hasTrainerRelationship = !!trainerResponse?.data?.trainerId && !error;

  if (!hasTrainerRelationship) {
    return <NoTrainerState />;
  }

  return <WithTrainerState trainerProfile={trainerResponse?.data} />;
};

export default Trainer;

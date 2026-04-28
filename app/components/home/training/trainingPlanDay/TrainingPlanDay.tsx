import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHomeContext } from '../../HomeContext';
import { useAuthStore } from '../../../../../stores/useAuthStore';
import { useTrainingPlanDay } from './TrainingPlanDayContext';
import TrainingPlanDayHeader from './elements/TrainingPlanDayHeader';
import TrainingPlanDayFooterButtons from './elements/TrainingPlanDayFooterButtons';
import TrainingPlanDayActionsButtons from './elements/TrainingPlanDayActionsButtons';
import TrainingPlanDayExerciseLastScoresInfo from './elements/TrainingPlanDayExerciseLastScoresInfo';
import TrainingPlanDayExerciseView from './elements/TrainingPlanDayExerciseView';
import TrainingPlanDayExercisesList from './elements/TrainingPlanDayExercisesList';
import TrainingPlanDayExerciseHeader from './elements/TrainingPlanDayExerciseHeader';
import TrainingPlanDayHeaderButtons from './elements/TrainingPlanDayHeaderButtons';
import TrainingPlanDayTimer from './elements/TrainingPlanDayTimer';
import TrainingPlanDayExerciseForm from './TrainingPlanDayExerciseForm';
import CreatePlanDay from '../../plan/planDay/CreatePlanDay';
import PlanDayProvider from '../../plan/planDay/CreatePlanDayContext';
import ViewLoading from '../../../elements/ViewLoading';
import type { GymForm, TrainingSummary, TrainingSessionScores } from '../../../../../types/models';
import { useTrainingSubmission } from './hooks/useTrainingSubmission';
import { useScoreValidation } from './hooks/useScoreValidation';
import { usePlanDayEditor } from './hooks/usePlanDayEditor';

interface TrainingPlanDayProps {
  hideDaySection: () => void;
  hideAndDeleteTrainingSession: () => Promise<void>;
  dayId: string;
  gym: GymForm | undefined;
  setStep: (step: number) => void;
  setTrainingSummary: (trainingSummary: TrainingSummary) => void;
}

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const { t } = useTranslation();
  const { changeHeaderVisibility, userId } = useHomeContext();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { planDay, scrollViewRef } = useTrainingPlanDay();

  const { parseScoresIfValid } = useScoreValidation(t);
  const { sendTraining, handleDeleteTrainingSession } = useTrainingSubmission({
    dayId: props.dayId,
    gym: props.gym,
    userId,
    user,
    setUser,
    setTrainingSummary: props.setTrainingSummary,
    setStep: props.setStep,
    hideAndDeleteTrainingSession: props.hideAndDeleteTrainingSession,
  });
  const {
    isTrainingPlanDayExerciseFormShow,
    isPlanShow,
    bodyPart,
    showExerciseFormByBodyPart,
    showExerciseForm,
    hideExerciseForm,
    togglePlanShow,
    deleteExerciseFromPlanDay,
    incrementOrDecrementExercise,
    getExerciseToAddFromForm,
  } = usePlanDayEditor();

  useEffect(() => {
    changeHeaderVisibility(false);
    return () => {
      changeHeaderVisibility(true);
    };
  }, [changeHeaderVisibility]);

  const handleSendTraining = async (exercises: TrainingSessionScores[]) => {
    const result = parseScoresIfValid(exercises);
    if (!result.parsedScores) {
      return;
    }

    await sendTraining(result.parsedScores);
  };

  return (
    <View className="absolute w-full h-full text-textColor bg-bgColor flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View style={{ gap: 8 }} className="h-full flex flex-col justify-between pb-4">
          <TrainingPlanDayHeader hideDaySection={props.hideDaySection} />
          <ScrollView
            ref={scrollViewRef}
            className="flex flex-col"
            contentContainerStyle={{ display: 'flex', gap: 16 }}
          >
            <TrainingPlanDayExerciseHeader />
            <View className="flex flex-row px-5" style={{ gap: 8 }}>
              <TrainingPlanDayHeaderButtons showExerciseForm={showExerciseForm} />
              <TrainingPlanDayTimer />
            </View>
            <TrainingPlanDayActionsButtons
              incrementOrDecrementExercise={incrementOrDecrementExercise}
              deleteExerciseFromPlan={deleteExerciseFromPlanDay}
              showExerciseFormByBodyPart={showExerciseFormByBodyPart}
              togglePlanShow={togglePlanShow}
            />
            <TrainingPlanDayExerciseLastScoresInfo />
            <TrainingPlanDayExerciseView />
            <TrainingPlanDayExercisesList deleteExerciseFromPlan={deleteExerciseFromPlanDay} />
          </ScrollView>
          <TrainingPlanDayFooterButtons
            sendTraining={handleSendTraining}
            hideAndDeleteTrainingSession={handleDeleteTrainingSession}
          />
        </View>
      ) : (
        <ViewLoading />
      )}
      {isTrainingPlanDayExerciseFormShow && (
        <TrainingPlanDayExerciseForm
          cancel={hideExerciseForm}
          addExerciseToPlanDay={getExerciseToAddFromForm}
          {...(bodyPart ? { bodyPart } : {})}
        />
      )}
      {isPlanShow && (
        <PlanDayProvider closeForm={togglePlanShow}>
          <CreatePlanDay {...{ isPreview: true }} {...(planDay?._id ? { planDayId: planDay._id } : {})} />
        </PlanDayProvider>
      )}
    </View>
  );
};

export default TrainingPlanDay;

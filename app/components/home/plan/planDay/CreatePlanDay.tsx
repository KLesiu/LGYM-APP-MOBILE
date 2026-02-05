import { JSX, useCallback, useEffect, useRef } from "react";
import {
  ExerciseForPlanDay,
} from "./../../../../../interfaces/Exercise";
import CreatePlanDayName from "./CreatePlanDayName";
import Dialog from "../../../elements/Dialog";
import CreatePlanDayExerciseList from "./CreatePlanDayExerciseList";
import ViewLoading from "../../../elements/ViewLoading";
import CreatePlanDaySummary from "./CreatePlanDaySummary";
import {
  PlanDayExercisesFormVm,
  PlanDayVm,
} from "./../../../../../interfaces/PlanDay";
import { BackHandler } from "react-native";
import { usePlanDay } from "./CreatePlanDayContext";
import React from "react";
import {
  usePostApiPlanDayIdCreatePlanDay,
  usePostApiPlanDayUpdatePlanDay,
  useGetApiPlanDayIdGetPlanDay,
} from "../../../../../api/generated/plan-day/plan-day";

interface CreatePlanDayProps {
  planId?: string;
  planDayId?: string;
  isPreview?: boolean;
}

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const {
    planDayName,
    setPlanDayName,
    setExercisesList,
    currentStep,
    setCurrentStep,
    closeForm,
    exercisesList,
  } = usePlanDay();

  const { mutate: createPlanDayMutation, isPending: isCreatePending } = usePostApiPlanDayIdCreatePlanDay();
  const { mutate: updatePlanDayMutation, isPending: isUpdatePending } = usePostApiPlanDayUpdatePlanDay();
  
  const { data: planDayData, isLoading: isGetPlanDayLoading } = useGetApiPlanDayIdGetPlanDay(
    props.planDayId || "",
    { query: { enabled: !!props.planDayId } }
  );

  const currentStepRef = useRef(currentStep);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (planDayData?.data) {
      const result = planDayData.data as unknown as PlanDayVm;
      setPlanDayName(result.name);
      setExercisesList(mapExercisesListFromSend(result.exercises));
    }
  }, [planDayData]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  const init = async () => {
    if (props.isPreview) setCurrentStep(2);
    else setCurrentStep(0);
  };

  const handleBackButton = useCallback(() => {
    if (props.isPreview) closeForm();
    else setCurrentStep(currentStepRef.current - 1);

    return true;
  }, [currentStepRef.current, props.isPreview]);

  const mapExercisesListToSend = useCallback(
    (exerciseList: ExerciseForPlanDay[]) => {
      const exercises = exerciseList.map((exercise: ExerciseForPlanDay) => {
        return {
          exercise: exercise.exercise.value,
          series: exercise.series,
          reps: exercise.reps,
        };
      });
      return exercises;
    },
    []
  );

  const mapExercisesListFromSend = useCallback(
    (exercises: PlanDayExercisesFormVm[]) => {
      const currentExercisesList = exercises.map(
        (exerciseInPlanDay: PlanDayExercisesFormVm) => {
          return {
            series: exerciseInPlanDay.series,
            reps: exerciseInPlanDay.reps,
            exercise: {
              label: exerciseInPlanDay.exercise.name,
              value: exerciseInPlanDay.exercise._id,
            },
          };
        }
      ) as ExerciseForPlanDay[];
      return currentExercisesList;
    },
    []
  );

  const createPlanDay = (
    planNameArg: string,
    exercisesArg: ExerciseForPlanDay[]
  ) => {
    const exercises = mapExercisesListToSend(exercisesArg);
    if (props.planId) {
      createPlanDayMutation(
        {
          id: props.planId,
          data: { name: planNameArg, exercises: exercises },
        },
        {
          onSuccess: () => {
            closeForm();
          },
        }
      );
    }
  };

  const editPlanDay = (
    planNameArg: string,
    exercisesArg: ExerciseForPlanDay[]
  ) => {
    const exercises = mapExercisesListToSend(exercisesArg);
    if (props.planDayId) {
      updatePlanDayMutation(
        {
          data: {
            _id: props.planDayId,
            name: planNameArg,
            exercises: exercises,
          },
        },
        {
          onSuccess: () => {
            closeForm();
          },
        }
      );
    }
  };

  const savePlan = async (
    planNameArg: string,
    exercisesArg: ExerciseForPlanDay[]
  ) => {
    if (props.planDayId) editPlanDay(planNameArg, exercisesArg);
    else createPlanDay(planNameArg, exercisesArg);
  };

  const renderStep = (): JSX.Element => {
    switch (currentStep) {
      case 0:
        return <CreatePlanDayName />;
      case 1:
        return <CreatePlanDayExerciseList />;
      case 2:
        return (
          <CreatePlanDaySummary
            isPreview={props.isPreview}
            saveCurrentPlan={savePlan}
            isLoading={isCreatePending || isUpdatePending}
          />
        );
      default:
        return <></>;
    }
  };

  const isLoading = isCreatePending || isUpdatePending || isGetPlanDayLoading;

  useEffect(() => {
    if (currentStep === -1) {
      closeForm();
    }
  }, [currentStep]);

  return (
    <>
      <Dialog>{renderStep()}</Dialog>
      {isLoading ? <ViewLoading /> : <></>}
    </>
  );
};

export default CreatePlanDay;

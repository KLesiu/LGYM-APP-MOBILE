import { JSX, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ExerciseForPlanDay,
} from "./../../../../../types/models";
import CreatePlanDayName from "./CreatePlanDayName";
import Dialog from "../../../elements/Dialog";
import CreatePlanDayExerciseList from "./CreatePlanDayExerciseList";
import ViewLoading from "../../../elements/ViewLoading";
import CreatePlanDaySummary from "./CreatePlanDaySummary";
import CreatePlanDayExerciseConfig from "./CreatePlanDayExerciseConfig";
import CreatePlanDayStepper from "./CreatePlanDayStepper";
import {
  PlanDayExercisesFormVm,
  PlanDayVm,
} from "./../../../../../types/models";
import { BackHandler, Pressable, View } from "react-native";
import { usePlanDay } from "./CreatePlanDayContext";
import React from "react";
import {
  usePostApiPlanDayIdCreatePlanDay,
  usePostApiPlanDayUpdatePlanDay,
  useGetApiPlanDayIdGetPlanDay,
  getGetApiPlanDayIdGetPlanDayQueryKey,
  getGetApiPlanDayIdGetPlanDaysInfoQueryKey,
  getGetApiPlanDayIdGetPlanDaysTypesQueryKey,
} from "../../../../../api/generated/plan-day/plan-day";
import { PlanDayVmDto } from "../../../../../api/generated/model";
import { useHomeContext } from "../../HomeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useOnboarding } from "../../../../onboarding/OnboardingContext";

interface CreatePlanDayProps {
  planId?: string;
  planDayId?: string;
  isPreview?: boolean;
  onSaveSuccess?: () => Promise<void> | void;
}

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const queryClient = useQueryClient();
  const { userId } = useHomeContext();
  const { registerScreen, openInfoForScreen } = useOnboarding();
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
      const dto = planDayData.data as PlanDayVmDto;
      const result: PlanDayVm = {
        _id: dto._id || "",
        name: dto.name || "",
       exercises:
         dto.exercises?.map((e) => ({
           series: e.series || 0,
           reps: e.reps || "",
           exercise: {
             _id: e.exercise?._id || "",
             name: e.exercise?.name || "",
             user: e.exercise?.user || "",
             bodyPart: e.exercise?.bodyPart || undefined,
             description: e.exercise?.description || "",
             image: e.exercise?.image || "",
           },
         })) || [],
      };
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
    if (props.isPreview) setCurrentStep(3);
    else setCurrentStep(0);
  };

  useEffect(() => {
    registerScreen("PLAN_DAY");
  }, [registerScreen]);

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
      const planId = props.planId;
      createPlanDayMutation(
        {
          id: planId,
          data: { name: planNameArg, exercises: exercises },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getGetApiPlanDayIdGetPlanDaysInfoQueryKey(planId),
            });
            queryClient.invalidateQueries({
              queryKey: getGetApiPlanDayIdGetPlanDaysTypesQueryKey(userId),
            });
            void props.onSaveSuccess?.();
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
            queryClient.invalidateQueries({
              queryKey: getGetApiPlanDayIdGetPlanDayQueryKey(props.planDayId!),
            });
            if (props.planId) {
              queryClient.invalidateQueries({
                queryKey: getGetApiPlanDayIdGetPlanDaysInfoQueryKey(props.planId),
              });
            }
            queryClient.invalidateQueries({
              queryKey: getGetApiPlanDayIdGetPlanDaysTypesQueryKey(userId),
            });
            void props.onSaveSuccess?.();
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
        return <CreatePlanDayExerciseConfig />;
      case 3:
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
      <Dialog scrollable={currentStep === 0}>
        <View className="w-full flex flex-row justify-end px-5 pt-5">
          <Pressable onPress={() => openInfoForScreen("PLAN_DAY")}>
            <Ionicons name="book-outline" size={22} color="#e8e6e6" />
          </Pressable>
        </View>
        <CreatePlanDayStepper currentStep={currentStep} />
        {renderStep()}
      </Dialog>
      {isLoading ? <ViewLoading /> : <></>}
    </>
  );
};

export default CreatePlanDay;

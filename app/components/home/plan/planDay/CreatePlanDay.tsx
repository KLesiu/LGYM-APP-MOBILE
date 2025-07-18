import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "./../../../../../interfaces/Exercise";
import { Message } from "./../../../../../enums/Message";
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
import { useHomeContext } from "../../HomeContext";
import { useAppContext } from "../../../../AppContext";

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
  } = usePlanDay();

  const { apiURL } = useHomeContext();
  const { postAPI, getAPI } = useAppContext();

  const currentStepRef = useRef(currentStep);

  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

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
    if (props.planDayId) await getPlanDay();
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

  const createPlanDay = async (
    planNameArg: string,
    exercisesArg: ExerciseForPlanDay[]
  ) => {
    const exercises = mapExercisesListToSend(exercisesArg);
    await postAPI(
      `/planDay/${props.planId}/createPlanDay`,
      () => {
        closeForm();
      },
      { name: planNameArg, exercises: exercises }
    );
  };

  const editPlanDay = async (
    planNameArg: string,
    exercisesArg: ExerciseForPlanDay[]
  ) => {
    const exercises = mapExercisesListToSend(exercisesArg);
    await postAPI(`/planDay/updatePlanDay`, () => closeForm(), {
      _id: props.planDayId,
      name: planNameArg,
      exercises: exercises,
    });
  };

  const getPlanDay = async () => {
    await getAPI(
      `/planDay/${props.planDayId}/getPlanDay`,
      (result: PlanDayVm) => {
        requestAnimationFrame(() => {
          setPlanDayName(result.name);
          setExercisesList(mapExercisesListFromSend(result.exercises));
        });
      },
      undefined,
      false
    );
  };

  const savePlan = async (
    planNameArg: string,
    exercisesArg: ExerciseForPlanDay[]
  ) => {
    setViewLoading(true)
    if (props.planDayId) await editPlanDay(planNameArg, exercisesArg);
    else await createPlanDay(planDayName, exercisesArg);
    setViewLoading(false);
  };

  const renderStep = (): JSX.Element => {
    switch (currentStep) {
      case -1:
        closeForm();
      case 0:
        return <CreatePlanDayName />;
      case 1:
        return <CreatePlanDayExerciseList />;
      case 2:
        return (
          <CreatePlanDaySummary
            isPreview={props.isPreview}
            saveCurrentPlan={savePlan}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Dialog>{renderStep()}</Dialog>
      {viewLoading ? <ViewLoading /> : <></>}
    </>
  );
};

export default CreatePlanDay;

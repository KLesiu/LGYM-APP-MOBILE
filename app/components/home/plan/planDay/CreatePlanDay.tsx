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
import { PlanDayExercisesFormVm } from "./../../../../../interfaces/PlanDay";
import { BackHandler } from "react-native";
import { usePlanDay } from "./CreatePlanDayContext";
import { useHomeContext } from "../../HomeContext";

interface CreatePlanDayProps {
  planId: string;
  planDayId?: string;
  isPreview?: boolean;
}

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const {
    planDayName,
    exercisesList,
    setPlanDayName,
    setExercisesList,
    currentStep,
    setCurrentStep,
    closeForm,
  } = usePlanDay();

  const {apiURL} = useHomeContext();

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
  };

  const handleBackButton = useCallback(() => {
    setCurrentStep(currentStepRef.current - 1);
    return true;
  },[currentStepRef.current]) 

  const mapExercisesListToSend = useCallback( (exerciseList: ExerciseForPlanDay[]) => {
    const exercises = exerciseList.map((exercise: ExerciseForPlanDay) => {
      return {
        exercise: exercise.exercise.value,
        series: exercise.series,
        reps: exercise.reps,
      };
    });
    return exercises;
  },[]);

  const mapExercisesListFromSend = useCallback((exercises: PlanDayExercisesFormVm[]) => {
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
  },[]) 

  const createPlanDay = async () => {
    setViewLoading(true);
    const exercises = mapExercisesListToSend(exercisesList);
    const response = await fetch(
      `${apiURL}/api/planDay/${props.planId}/createPlanDay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: planDayName,
          exercises: exercises,
        }),
      }
    );
    const result = await response.json();
    if (result.msg === Message.Created) closeForm();

    setViewLoading(false);
  };

  const editPlanDay = async () => {
    setViewLoading(true);
    const exercises = mapExercisesListToSend(exercisesList);
    const response = await fetch(`${apiURL}/api/planDay/updatePlanDay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: props.planDayId,
        name: planDayName,
        exercises: exercises,
      }),
    });
    const result = await response.json();
    if (result.msg === Message.Updated) closeForm();
    setViewLoading(false);
  };

  const getPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.planDayId}/getPlanDay`
    );
    const result = await response.json();
    setPlanDayName(result.name);
    setExercisesList(mapExercisesListFromSend(result.exercises));
  };

  const savePlan = useCallback(async () => {
    if (props.planDayId) await editPlanDay();
    else await createPlanDay();
  },[props.planDayId]) ;

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

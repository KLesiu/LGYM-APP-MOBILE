import { useEffect, useState } from "react";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "../../../../interfaces/Exercise";
import { Message } from "../../../../enums/Message";
import CreatePlanDayName from "./CreatePlanDayName";
import Dialog from "../../../elements/Dialog";
import CreatePlanDayExerciseList from "./CreatePlanDayExerciseList";
import ViewLoading from "../../../elements/ViewLoading";
import CreatePlanDaySummary from "./CreatePlanDaySummary";
import { PlanDayExercisesFormVm } from "../../../../interfaces/PlanDay";

interface CreatePlanDayProps {
  planId: string;
  closeForm: () => void;
  planDayId?: string;
  isPreview?: boolean;
}

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;

  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (props.planDayId)await getPlanDay();
    if (props.isPreview) setCurrentStep(2);
  };

  const mapExercisesListToSend = (exerciseList: ExerciseForPlanDay[]) => {
    const exercises = exerciseList.map((exercise: ExerciseForPlanDay) => {
      return {
        exercise: exercise.exercise.value,
        series: exercise.series,
        reps: exercise.reps,
      };
    });
    return exercises;
  };

  const mapExercisesListFromSend = (exercises: PlanDayExercisesFormVm[]) => {
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
  };

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
    if (result.msg === Message.Created) props.closeForm();

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
    if (result.msg === Message.Updated) props.closeForm();
    setViewLoading(false);
  };

  const goToNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const goBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const getPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.planDayId}/getPlanDay`
    );
    const result = await response.json();
    setPlanDayName(result.name);
    setExercisesList(mapExercisesListFromSend(result.exercises));
  };

  const savePlan = async () => {
    if (props.planDayId) await editPlanDay();
    else await createPlanDay();
  };

  const renderStep = (): JSX.Element => {
    switch (currentStep) {
      case -1:
        props.closeForm();
      case 0:
        return (
          <CreatePlanDayName
            goBack={goBack}
            goToNext={goToNext}
            setPlanName={setPlanDayName}
            planDayName={planDayName}
          />
        );
      case 1:
        return (
          <CreatePlanDayExerciseList
            goBack={goBack}
            goToNext={goToNext}
            setExerciseList={setExercisesList}
            exerciseList={exercisesList}
          />
        );
      case 2:
        return (
          <CreatePlanDaySummary
            closeForm={props.closeForm}
            goBack={goBack}
            isPreview={props.isPreview}
            saveCurrentPlan={savePlan}
            planDayName={planDayName}
            exercisesList={exercisesList}
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

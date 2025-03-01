import { useEffect, useState } from "react";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "../../../../interfaces/Exercise";
import { Message } from "../../../../enums/Message";
import CreatePlanDayName from "./CreatePlanDayName";
import Dialog from "../../../elements/Dialog";
import { PlanDayForm } from "../../../../interfaces/PlanDay";
import CreatePlanDayExerciseList from "./CreatePlanDayExerciseList";
import ViewLoading from "../../../elements/ViewLoading";

interface CreatePlanDayProps {
  planId: string;
  closeForm: () => void;
  planDayId?: string;
}

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;

  const [planDayForm, setPlanDayFrom] = useState<PlanDayForm>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (props.planDayId) await getPlanDay();
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
  const createPlanDay = async (exerciseList: ExerciseForPlanDay[]) => {
    setViewLoading(true);
    const exercises = mapExercisesListToSend(exerciseList);
    const response = await fetch(
      `${apiURL}/api/planDay/${props.planId}/createPlanDay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: planDayForm?.name,
          exercises: exercises,
        }),
      }
    );
    const result = await response.json();
    if (result.msg === Message.Created) props.closeForm();

    setViewLoading(false);
  };
  const editPlanDay = async (exerciseList: ExerciseForPlanDay[]) => {
    setViewLoading(true);
    const exercises = mapExercisesListToSend(exerciseList);
    const response = await fetch(`${apiURL}/api/planDay/updatePlanDay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: props.planDayId,
        name: planDayForm?.name,
        exercises: exercises,
      }),
    });
    const result = await response.json();
    if (result.msg === Message.Updated) props.closeForm();
    setViewLoading(false);
  };

  const goToNext = () => {
    setCurrentStep(currentStep + 1);
  }
  const goBack = () => {
    setCurrentStep(currentStep - 1);
  }
  const getPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.planDayId}/getPlanDay`
    );
    const result = await response.json();
    setPlanDayFrom(result);
  };

  const renderStep = ():JSX.Element=>{
    switch(currentStep){
      case -1:
        props.closeForm();
      case 0:
        return <CreatePlanDayName goBack={goBack} goToNext={goToNext} />
      case 1:
        return <CreatePlanDayExerciseList goBack={goBack} goToNext={goToNext} />
      default:
        return <></>
    }
  }

  return (
    <>
      <Dialog>
        {renderStep()}
      </Dialog>
      {viewLoading ? <ViewLoading /> : <></>}
    </>
  );
};

export default CreatePlanDay;

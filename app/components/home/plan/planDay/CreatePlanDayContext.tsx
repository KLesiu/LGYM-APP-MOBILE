import { createContext, useContext, useState } from "react";
import { ExerciseForPlanDay } from "../../../../../interfaces/Exercise";

interface PlanDayContextType {
  planDayName: string;
  setPlanDayName: (name: string) => void;
  exercisesList: ExerciseForPlanDay[];
  setExercisesList: (list: ExerciseForPlanDay[]) => void;
  savePlan: () => Promise<void>;
}

const PlanDayContext = createContext<PlanDayContextType | null>(null);

export const usePlanDay = () => {
  const context = useContext(PlanDayContext);
  return context;
};

export const PlanDayProvider = ({ children }: { children: React.ReactNode }) => {
  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);

  const savePlan = async () => {
    const apiURL = `${process.env.REACT_APP_BACKEND}/api/planDay/createPlanDay`;
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: planDayName, exercises: exercisesList }),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Plan zapisany!");
    }
  };

  return (
    <PlanDayContext.Provider value={{ planDayName, setPlanDayName, exercisesList, setExercisesList, savePlan }}>
      {children}
    </PlanDayContext.Provider>
  );
};

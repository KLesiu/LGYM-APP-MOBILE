import { createContext, useCallback, useContext, useState } from "react";
import { ExerciseForPlanDay } from "../../../../../interfaces/Exercise";
import { useHomeContext } from "../../HomeContext";

interface PlanDayContextType {
  planDayName: string;
  setPlanDayName: (name: string) => void;
  exercisesList: ExerciseForPlanDay[];
  setExercisesList: (list: ExerciseForPlanDay[]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToNext: () => void;
  goBack: () => void;
  closeForm: () => void;
}

const PlanDayContext = createContext<PlanDayContextType | null>(null);

export const usePlanDay = () => {
  const context = useContext(PlanDayContext);
  if (!context) {
    throw new Error("usePlanDay must be used within PlanDayProvider");
  }
  return context;
};

interface PlanDayProviderProps {
  children: React.ReactNode;
  closeForm: () => void;
}

const PlanDayProvider: React.FC<PlanDayProviderProps> = ({
  children,
  closeForm,
}) => {
  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-2);

  const goToNext = useCallback(() => {
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const goBack = useCallback(() => {
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  return (
    <PlanDayContext.Provider
      value={{
        planDayName,
        setPlanDayName,
        exercisesList,
        setExercisesList,
        currentStep,
        setCurrentStep,
        goToNext,
        goBack,
        closeForm,
      }}
    >
      {children}
    </PlanDayContext.Provider>
  );
};

export default PlanDayProvider;

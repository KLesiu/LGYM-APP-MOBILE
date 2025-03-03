import { createContext, useContext, useState } from "react";
import { ExerciseForPlanDay } from "../../../../../interfaces/Exercise";

interface PlanDayContextType {
  planDayName: string;
  setPlanDayName: (name: string) => void;
  exercisesList: ExerciseForPlanDay[];
  setExercisesList: (list: ExerciseForPlanDay[]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToNext: () => void;
  goBack: () => void;
  apiURL: string;
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

const PlanDayProvider:React.FC<PlanDayProviderProps> = ({children,closeForm}) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const goToNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const goBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <PlanDayContext.Provider value={{ planDayName, setPlanDayName, exercisesList, setExercisesList,currentStep,setCurrentStep,goToNext,goBack,apiURL,closeForm }}>
      {children}
    </PlanDayContext.Provider>
  );
};

export default PlanDayProvider

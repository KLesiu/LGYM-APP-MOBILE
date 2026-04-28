import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ExerciseForPlanDay } from '../../../../../types/models';

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
    throw new Error('usePlanDay must be used within PlanDayProvider');
  }
  return context;
};

interface PlanDayProviderProps {
  children: React.ReactNode;
  closeForm: () => void;
}

const PlanDayProvider: React.FC<PlanDayProviderProps> = ({ children, closeForm }) => {
  const [planDayName, setPlanDayName] = useState<string>('');
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-2);

  const goToNext = useCallback(() => {
    setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((prevCurrentStep) => prevCurrentStep - 1);
  }, []);

  const contextValue = useMemo(
    () => ({
      planDayName,
      setPlanDayName,
      exercisesList,
      setExercisesList,
      currentStep,
      setCurrentStep,
      goToNext,
      goBack,
      closeForm,
    }),
    [closeForm, currentStep, exercisesList, goBack, goToNext, planDayName],
  );

  return (
    <PlanDayContext.Provider value={contextValue}>
      {children}
    </PlanDayContext.Provider>
  );
};

export default PlanDayProvider;

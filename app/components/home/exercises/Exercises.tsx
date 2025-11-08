import { View, Text, Pressable } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "../../../../interfaces/Exercise";
import CreateExercise from "./CreateExercise";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import React from "react";
import { BodyParts } from "../../../../enums/BodyParts";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import BodyPartsList from "./BodyPartsList";
import ExercisesList from "./ExercisesList";
import ExerciseDetails from "./ExerciseDetails";
import BackIcon from "./../../../../img/icons/backIcon.svg"

interface ExercisesProps {
  isCreatePlanDayMode?: boolean;
  addExerciseToList: (exercise: ExerciseForm) => void;
  exercisesList?: ExerciseForPlanDay[];
  goBackToPlanDay?: () => void;
}

const Exercises: React.FC<ExercisesProps> = ({
  isCreatePlanDayMode,
  addExerciseToList,
  exercisesList,
  goBackToPlanDay
}) => {
  const { toggleMenuButton, hideMenu, userId } = useHomeContext();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyParts | null>(
    null
  );
  const [globalExercises, setGlobalExercises] = useState<ExerciseForm[]>([]);
  const [userExercises, setUserExercises] = useState<ExerciseForm[]>([]);

  const [selectedExercise, setSelectedExercise] = useState<ExerciseForm | null>(
    null
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [isExerciseFormVisible, setIsExerciseFormVisible] = useState(false);
  const { getAPI } = useAppContext();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await Promise.all([
      checkIsAdmin(),
      getAllGlobalExercises(),
      getAllUserExercises(),
    ]);
  };

  const getAllGlobalExercises = async () => {
    try {
      await getAPI(
        `/exercise/getAllGlobalExercises`,
        (response: ExerciseForm[]) => setGlobalExercises(response),
        undefined,
        false
      );
    } catch (error) {
      setGlobalExercises([]);
    }
  };

  const getAllUserExercises = async () => {
    try {
      await getAPI(
        `/exercise/${userId}/getAllUserExercises`,
        (response: ExerciseForm[]) => {
          setUserExercises(response);
        },
        undefined,
        false
      );
    } catch (error) {
      setUserExercises([]);
    }
  };

  const filteredGlobalExercisesByBodyPart = useMemo(() => {
    return selectedBodyPart
      ? globalExercises.filter((e) => e.bodyPart === selectedBodyPart)
      : [];
  }, [globalExercises, selectedBodyPart]);

  const filteredUserExercisesByBodyPart = useMemo(() => {
    return selectedBodyPart
      ? userExercises.filter((e) => e.bodyPart === selectedBodyPart)
      : [];
  }, [userExercises, selectedBodyPart]);

  const checkIsAdmin = async () => {
    try {
      await getAPI(`/${userId}/isAdmin`, (response: boolean) =>
        setIsAdmin(response)
      );
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const closeExerciseForm = async () => {
    setIsExerciseFormVisible(false);
    toggleMenuButton(false);
    hideMenu();
    await Promise.all([getAllUserExercises(), getAllGlobalExercises()]);
    setSelectedExercise(null);
  };

  const openExerciseForm = useCallback(
    (global = false) => {
      setIsGlobal(global);
      setIsExerciseFormVisible(true);
      toggleMenuButton(true);
    },
    [toggleMenuButton]
  );

  const selectBodyPart = (bodyPart: BodyParts) => {
    setSelectedBodyPart(bodyPart);
    setCurrentStep(1);
  };

  const selectExercise = (exercise: ExerciseForm, isEditing = false) => {
    setSelectedExercise(exercise);
    if (isEditing) {
      openExerciseForm();
    } else {
      setCurrentStep(2);
    }
  };

  const goBack = () => {
    const newStep = currentStep - 1;
    if (newStep < 0) return;
    setCurrentStep(newStep);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <BodyPartsList onSelectBodyPart={selectBodyPart} />;
      case 1:
        return (
          <ExercisesList
            bodyPart={selectedBodyPart as BodyParts}
            goBack={goBack}
            selectExercise={selectExercise}
            userExercises={filteredUserExercisesByBodyPart}
            globalExercises={filteredGlobalExercisesByBodyPart}
            isCreatePlanDayMode={isCreatePlanDayMode}
            exercisesList={exercisesList}
            addExerciseToList={addExerciseToList}
          />
        );
      case 2:
        return (
          <ExerciseDetails
            goBack={goBack}
            exercise={selectedExercise as ExerciseForm}
          />
        );
    }
  };

  return (
    <BackgroundMainSection>
      {currentStep !== 2 && (
        <View
          className="flex flex-row px-4 py-2 items-center justify-between "
          style={{ gap: 8 }}
        >
          {" "}
          {isCreatePlanDayMode && (
            <Pressable
              style={{ borderRadius: 10000 }}
              onPress={goBackToPlanDay}
              className="flex items-center justify-center w-8 h-8  bg-secondaryColor "
            >
              <BackIcon />
            </Pressable>
          )}
          <Text
            className="text-xl text-primaryColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Exercises
          </Text>
          <View className="flex flex-row" style={{ gap: 8 }}>
            {isAdmin && (
              <CustomButton
                onPress={() => openExerciseForm(true)}
                buttonStyleType={ButtonStyle.outlineBlack}
                buttonStyleSize={ButtonSize.long}
                text="New global"
              />
            )}
            <CustomButton
              onPress={() => openExerciseForm()}
              buttonStyleType={ButtonStyle.outlineBlack}
              buttonStyleSize={ButtonSize.long}
              text="New"
            />
          </View>
        </View>
      )}

      {renderCurrentStep()}
      {isExerciseFormVisible && (
        <CreateExercise
          closeForm={closeExerciseForm}
          isAdmin={isAdmin}
          isGlobal={isGlobal}
          form={selectedExercise ?? undefined}
        />
      )}
    </BackgroundMainSection>
  );
};

export default Exercises;

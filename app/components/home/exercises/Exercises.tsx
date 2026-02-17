import { View, Text, Pressable } from "react-native";
import { useState, useCallback, useMemo } from "react";
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
import BodyPartsList from "./BodyPartsList";
import ExercisesList from "./ExercisesList";
import ExerciseDetails from "./ExerciseDetails";
import BackIcon from "./../../../../img/icons/backIcon.svg";
import {
  useGetApiExerciseGetAllGlobalExercises,
  useGetApiExerciseIdGetAllUserExercises,
} from "../../../../api/generated/exercise/exercise";
import { useGetApiIdIsAdmin } from "../../../../api/generated/user/user";
import { EnumLookupDto, ExerciseResponseDto } from "../../../../api/generated/model";
import { useTranslation } from "react-i18next";

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
  goBackToPlanDay,
}) => {
  const { t } = useTranslation();
  const { toggleMenuButton, hideMenu, userId } = useHomeContext();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyParts | null>(
    null
  );

  const [selectedExercise, setSelectedExercise] = useState<ExerciseForm | null>(
    null
  );
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [isExerciseFormVisible, setIsExerciseFormVisible] = useState(false);

  const {
    data: globalExercisesData,
    refetch: refetchGlobal,
  } = useGetApiExerciseGetAllGlobalExercises();

  const {
    data: userExercisesData,
    refetch: refetchUser,
  } = useGetApiExerciseIdGetAllUserExercises(userId, {
    query: { enabled: !!userId },
  });

  const { data: isAdminData } = useGetApiIdIsAdmin(userId, {
    query: { enabled: !!userId },
  });

  const globalExercises = useMemo(() => {
    const data = globalExercisesData?.data as ExerciseResponseDto[];
    if (!data) return [];
    return data.map((exercise) => ({
      ...exercise,
      bodyPart: (exercise.bodyPart?.name as BodyParts) || BodyParts.Chest,
    })) as ExerciseForm[];
  }, [globalExercisesData]);

  const userExercises = useMemo(() => {
    const data = userExercisesData?.data as ExerciseResponseDto[];
    if (!data) return [];
    return data.map((exercise) => ({
      ...exercise,
      bodyPart: (exercise.bodyPart?.name as BodyParts) || BodyParts.Chest,
    })) as ExerciseForm[];
  }, [userExercisesData]);
  const isAdmin = !!isAdminData?.data;

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

  const closeExerciseForm = async () => {
    setIsExerciseFormVisible(false);
    if (!isCreatePlanDayMode) toggleMenuButton(false);
    hideMenu();
    await Promise.all([refetchUser(), refetchGlobal()]);
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

  const selectBodyPart = (bodyPart: EnumLookupDto) => {
    setSelectedBodyPart(bodyPart.name as BodyParts);
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
    if (newStep === 1) {
      setSelectedExercise(null);
    } else if (newStep === 0 && !isCreatePlanDayMode) {
      toggleMenuButton(false);
    }
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
            {t('exercises.title')}
          </Text>
          <View className="flex flex-row" style={{ gap: 8 }}>
            {isAdmin && (
              <CustomButton
                onPress={() => openExerciseForm(true)}
                buttonStyleType={ButtonStyle.outlineBlack}
                buttonStyleSize={ButtonSize.long}
                text={t('exercises.newGlobal')}
              />
            )}
            <CustomButton
              onPress={() => openExerciseForm()}
              buttonStyleType={ButtonStyle.outlineBlack}
              buttonStyleSize={ButtonSize.long}
              text={t('exercises.new')}
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

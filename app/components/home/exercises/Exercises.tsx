import { View, Text, Pressable } from "react-native";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "../../../../types/models";
import CreateExercise from "./CreateExercise";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import React from "react";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useHomeContext } from "../HomeContext";
import BodyPartsList from "./BodyPartsList";
import ExercisesList from "./ExercisesList";
import ExerciseDetails from "./ExerciseDetails";
import ExerciseTranslationDialog from "./ExerciseTranslationDialog";
import BackIcon from "./../../../../img/icons/backIcon.svg";
import {
  getGetApiExerciseGetAllGlobalExercisesQueryKey,
  getGetApiExerciseIdGetAllExercisesQueryKey,
  getGetApiExerciseIdGetAllUserExercisesQueryKey,
  useGetApiExerciseGetAllGlobalExercises,
  useGetApiExerciseIdGetAllUserExercises,
  usePostApiExerciseIdAddGlobalTranslation,
} from "../../../../api/generated/exercise/exercise";
import {
  EnumLookupDto,
  ExerciseResponseDto,
  ExerciseTranslationDto,
} from "../../../../api/generated/model";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../../stores/useAuthStore";
import { isAdminUser } from "../../../../utils/authorization";
import { useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../../../AppContext";

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
  const { t, i18n } = useTranslation();
  const { toggleMenuButton, hideMenu, userId } = useHomeContext();
  const { setErrors } = useAppContext();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedBodyPart, setSelectedBodyPart] = useState<EnumLookupDto | null>(
    null
  );

  const [selectedExercise, setSelectedExercise] = useState<ExerciseForm | null>(
    null
  );
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [isExerciseFormVisible, setIsExerciseFormVisible] = useState(false);
  const [exerciseToTranslate, setExerciseToTranslate] =
    useState<ExerciseResponseDto | null>(null);

  const addGlobalTranslationMutation = usePostApiExerciseIdAddGlobalTranslation();

  const {
    data: globalExercisesData,
    refetch: refetchGlobal,
  } = useGetApiExerciseGetAllGlobalExercises({
    query: {
      queryKey: [
        ...getGetApiExerciseGetAllGlobalExercisesQueryKey(),
        i18n.language,
      ],
    },
  });

  const {
    data: userExercisesData,
    refetch: refetchUser,
  } = useGetApiExerciseIdGetAllUserExercises(userId, {
    query: {
      enabled: !!userId,
      queryKey: [
        ...getGetApiExerciseIdGetAllUserExercisesQueryKey(userId),
        i18n.language,
      ],
    },
  });

  const globalExercises = useMemo(() => {
    if(!Array.isArray(globalExercisesData?.data)) return [];
   return globalExercisesData?.data 
  }, [globalExercisesData]);

  const userExercises = useMemo(() => {
    if(!Array.isArray(userExercisesData?.data)) return [];
    return userExercisesData?.data;
  }, [userExercisesData]);


  const isAdmin = isAdminUser(user);

  const filteredGlobalExercisesByBodyPart = useMemo(() => {
    return selectedBodyPart
      ? globalExercises.filter((e) => e.bodyPart?.name === selectedBodyPart.name)
      : [];
  }, [globalExercises, selectedBodyPart]);

  const filteredUserExercisesByBodyPart = useMemo(() => {
    return selectedBodyPart
      ? userExercises.filter((e) => e.bodyPart?.name === selectedBodyPart.name)
      : [];
  }, [userExercises, selectedBodyPart]);

  const closeExerciseForm = async () => {
    setIsExerciseFormVisible(false);
    if (!isCreatePlanDayMode) toggleMenuButton(false);
    hideMenu();
    await Promise.all([refetchUser(), refetchGlobal()]);
    setSelectedExercise(null);
  };

  const closeTranslationForm = () => {
    setExerciseToTranslate(null);
    setErrors([]);
  };

  const refreshExerciseQueries = useCallback(async () => {
    const invalidatePromises: Promise<unknown>[] = [
      queryClient.invalidateQueries({
        queryKey: getGetApiExerciseGetAllGlobalExercisesQueryKey(),
      }),
      ...(userId
        ? [
            queryClient.invalidateQueries({
              queryKey: getGetApiExerciseIdGetAllExercisesQueryKey(userId),
            }),
            queryClient.invalidateQueries({
              queryKey: getGetApiExerciseIdGetAllUserExercisesQueryKey(userId),
            }),
          ]
        : []),
    ];

    await Promise.all(invalidatePromises);
  }, [queryClient, userId]);

  const addTranslation = async (data: {
    culture: string;
    name: string;
  }): Promise<void> => {
    if (!exerciseToTranslate?._id || !userId) {
      setErrors([t("common.tryAgain")]);
      return;
    }

    if (!isAdmin || exerciseToTranslate.user) {
      setErrors([t("common.tryAgain")]);
      return;
    }

    const payload: ExerciseTranslationDto = {
      exerciseId: exerciseToTranslate._id,
      culture: data.culture,
      name: data.name,
    };

    try {
      await addGlobalTranslationMutation.mutateAsync({
        id: userId,
        data: payload,
      });
      await refreshExerciseQueries();
      await Promise.all([refetchUser(), refetchGlobal()]);
      closeTranslationForm();
    } catch (error) {
      setErrors([t("common.tryAgain")]);
    }
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
    if (newStep === 1) {
      setSelectedExercise(null);
    } else if (newStep === 0 && !isCreatePlanDayMode) {
      toggleMenuButton(false);
    }
    setCurrentStep(newStep);
  };

  useEffect(() => {
    setCurrentStep(0);
    setSelectedBodyPart(null);
    setSelectedExercise(null);
  }, [i18n.language]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <BodyPartsList onSelectBodyPart={selectBodyPart} />;
      case 1:
        return (
          <ExercisesList
            bodyPart={selectedBodyPart!}
            goBack={goBack}
            selectExercise={selectExercise}
            addTranslation={setExerciseToTranslate}
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
      {exerciseToTranslate && (
        <ExerciseTranslationDialog
          exercise={exerciseToTranslate}
          isSaving={addGlobalTranslationMutation.isPending}
          onCancel={closeTranslationForm}
          onSubmit={addTranslation}
        />
      )}
    </BackgroundMainSection>
  );
};

export default Exercises;

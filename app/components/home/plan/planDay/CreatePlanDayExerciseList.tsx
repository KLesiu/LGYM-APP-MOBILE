import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, Keyboard, Platform, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { ExerciseForm, ExerciseForPlanDay } from "./../../../../../types/models";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ExerciseList from "./exerciseList/ExerciseList";
import { usePlanDay } from "./CreatePlanDayContext";
import Dialog from "../../../elements/Dialog";
import Exercises from "../../exercises/Exercises";
import Card from "../../../elements/Card";
import Checkbox from "../../../elements/Checkbox";
import { useHomeContext } from "../../HomeContext";
import ViewLoading from "../../../elements/ViewLoading";
import {
  getGetApiExerciseGetAllGlobalExercisesQueryKey,
  getGetApiExerciseIdGetAllUserExercisesQueryKey,
  useGetApiExerciseGetAllGlobalExercises,
  useGetApiExerciseIdGetAllUserExercises,
} from "../../../../../api/generated/exercise/exercise";
import toastService from "../../../../services/toastService";
import { getExerciseDisplayName } from "../../../../../helpers/exerciseDisplayName";

const CreatePlanDayExerciseList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { exercisesList, setExercisesList, goBack, goToNext } = usePlanDay();
  const { userId } = useHomeContext();

  const [isCatalogVisible, setIsCatalogVisible] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: globalExercisesData, isLoading: isGlobalLoading } =
    useGetApiExerciseGetAllGlobalExercises({
      query: {
        queryKey: [...getGetApiExerciseGetAllGlobalExercisesQueryKey(), i18n.language],
      },
    });

  const { data: userExercisesData, isLoading: isUserLoading } =
    useGetApiExerciseIdGetAllUserExercises(userId, {
      query: {
        enabled: !!userId,
        queryKey: [...getGetApiExerciseIdGetAllUserExercisesQueryKey(userId), i18n.language],
      },
    });

  const ensureInputsVisible = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      ensureInputsVisible();
    });

    const keyboardHideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, []);

  const toggleCatalog = () => {
    setIsCatalogVisible((prevState) => !prevState);
  };

  const addExerciseToList = (exercise: ExerciseForm) => {
    const newExerciseForPlanDay: ExerciseForPlanDay = {
      exercise: {
        value: exercise._id || "",
        label: getExerciseDisplayName(exercise),
      },
      series: 1,
      reps: "Max",
    };

    if (exercisesList.some((item) => item.exercise.value === exercise._id)) {
      const newExercisesList = exercisesList.filter(
        (item) => item.exercise.value !== exercise._id
      );
      setExercisesList(newExercisesList);
      return;
    }

    setExercisesList([...exercisesList, newExerciseForPlanDay]);
  };

  const removeExerciseFromList = (exercise: ExerciseForPlanDay) => {
    const newExercisesList = exercisesList.filter(
      (item) => item.exercise.value !== exercise.exercise.value
    );

    setExercisesList(newExercisesList);
  };

  const globalExercises = useMemo(() => {
    return Array.isArray(globalExercisesData?.data) ? globalExercisesData.data : [];
  }, [globalExercisesData]);

  const userExercises = useMemo(() => {
    return Array.isArray(userExercisesData?.data) ? userExercisesData.data : [];
  }, [userExercisesData]);

  const searchableExercises = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return [];
    }

    const mergedExercises = [...userExercises, ...globalExercises];
    const uniqueExercises = mergedExercises.filter(
      (exercise, index, array) =>
        !!exercise._id &&
        array.findIndex((item) => item._id === exercise._id) === index
    );

    return uniqueExercises
      .filter((exercise) =>
        getExerciseDisplayName(exercise).toLowerCase().includes(normalizedSearch)
      )
      .slice(0, 12);
  }, [globalExercises, searchText, userExercises]);

  const handleContinue = () => {
    if (!exercisesList.length) {
      toastService.showValidationError(t("plans.noExercisesSelected"));
      return;
    }

    goToNext();
  };

  const isLoading = isGlobalLoading || isUserLoading;

  return (
    <View className="w-full flex-1">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 w-full"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 + keyboardHeight, paddingHorizontal: 20 }}
      >
        <View className="flex flex-col py-2" style={{ gap: 16 }}>
          <View style={{ gap: 6 }}>
            <Text
              className="text-xl smallPhone:text-base text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t("plans.selectExercisesTitle")}
            </Text>
            <Text
              className="text-sm text-fifthColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("plans.selectExercisesDescription")}
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            <Text
              className="text-sm text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t("plans.searchByName")}
            </Text>
            <View className="w-full flex-row items-center px-3 py-2 bg-cardColor rounded-lg">
              <Text
                className="text-fifthColor pr-2"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {"\u2315"}
              </Text>
              <TextInput
                style={{
                  fontFamily: "OpenSans_400Regular",
                  flex: 1,
                }}
                className="text-textColor"
                value={searchText}
                onChangeText={setSearchText}
                placeholder={t("plans.typeExerciseName")}
                placeholderTextColor="gray"
              />
            </View>
          </View>

          <View className="flex justify-between flex-row w-full" style={{ gap: 12 }}>
            <CustomButton
              text={t("plans.browseByBodyPart")}
              onPress={toggleCatalog}
              buttonStyleType={ButtonStyle.success}
              width="flex-1"
            />
          </View>

          <View className="w-full bg-cardColor rounded-lg px-3 py-3" style={{ gap: 10 }}>
            <View className="flex flex-row items-start" style={{ gap: 12 }}>
              <Text
                className="text-sm text-textColor flex-1"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {t("plans.searchResults")}
              </Text>
              <Text
                className="text-xs text-fifthColor flex-1 text-right"
                style={{ fontFamily: "OpenSans_400Regular", flexShrink: 1 }}
              >
                {searchableExercises.length > 0
                  ? t("plans.total", { count: searchableExercises.length })
                  : t("plans.searchResultsHint")}
              </Text>
            </View>

            {isLoading ? (
              <ViewLoading />
            ) : searchableExercises.length > 0 ? (
              searchableExercises.map((exercise) => (
                <Card key={exercise._id} customClasses="flex flex-row items-center">
                  <View className="flex-1" style={{ gap: 4 }}>
                    <Text
                      className="text-base text-textColor"
                      style={{ fontFamily: "OpenSans_700Bold" }}
                    >
                      {getExerciseDisplayName(exercise)}
                    </Text>
                    <Text
                      className="text-xs text-fifthColor"
                      style={{ fontFamily: "OpenSans_400Regular" }}
                    >
                      {exercise.bodyPart?.displayName || t("common.unknown")}
                    </Text>
                  </View>
                  <Checkbox
                    value={exercisesList.some((item) => item.exercise.value === exercise._id)}
                    setValue={() => addExerciseToList(exercise)}
                  />
                </Card>
              ))
            ) : (
              <Text
                className="text-sm text-fifthColor"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {searchText.trim().length > 0
                  ? t("plans.noExercisesMatched")
                  : t("plans.startTypingExercises")}
              </Text>
            )}
          </View>

          <ExerciseList
            exerciseList={exercisesList}
            removeExerciseFromList={removeExerciseFromList}
          />
        </View>
      </ScrollView>

      <View className="w-full px-5 py-4 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={goBack}
          text={t("plans.back")}
          width="flex-1"
        />
        <CustomButton
          buttonStyleType={ButtonStyle.default}
          onPress={handleContinue}
          text={t("training.continue")}
          width="flex-1"
        />
      </View>

      {isCatalogVisible && (
        <Dialog scrollable={false}>
          <Exercises
            isCreatePlanDayMode={true}
            addExerciseToList={addExerciseToList}
            exercisesList={exercisesList}
            goBackToPlanDay={toggleCatalog}
          />
        </Dialog>
      )}
    </View>
  );
};

export default CreatePlanDayExerciseList;

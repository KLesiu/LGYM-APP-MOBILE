import { View, Text, FlatList } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ExerciseForm } from "../../../../interfaces/Exercise";
import ViewLoading from "../../elements/ViewLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateExercise from "./CreateExercise";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { FontWeights } from "../../../../enums/FontsProperties";
import React from "react";
import CustomDropdown from "../../elements/Dropdown";
import { BodyParts } from "../../../../enums/BodyParts";
import { DropdownItem } from "../../../../interfaces/Dropdown";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import Card from "../../elements/Card";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";

const Exercises: React.FC = () => {
  const { toggleMenuButton, apiURL, hideMenu, userId } = useHomeContext();
  const [globalExercises, setGlobalExercises] = useState<ExerciseForm[]>([]);
  const [userExercises, setUserExercises] = useState<ExerciseForm[]>([]);
  const [isGlobalExercisesLoading, setIsGlobalExercisesLoading] =
    useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseForm | null>(
    null
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | null>(null);
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
        (response: ExerciseForm[]) => setGlobalExercises(response)
      );
    } finally {
      setIsGlobalExercisesLoading(false);
    }
  };

  const getAllUserExercises = async () => {
    try {
      await getAPI(
        `/exercise/${userId}/getAllUserExercises`,
        (response: ExerciseForm[]) => setUserExercises(response)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkIsAdmin = async () => {
    try {
      await getAPI(`/${userId}/isAdmin`, (response: boolean) =>
        setIsAdmin(response)
      );
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const bodyPartsToSelect = useMemo(
    () =>
      Object.values(BodyParts).map((item) => ({ label: item, value: item })),
    []
  );

  const filteredExercises = useCallback(
    (exercises: ExerciseForm[]) =>
      bodyPart ? exercises.filter((e) => e.bodyPart === bodyPart) : exercises,
    [bodyPart]
  );

  const handleSelectBodyPart = useCallback((item: DropdownItem | null) => {
    setBodyPart(item ? (item.value as BodyParts) : null);
  }, []);

  const handleExerciseDetails = useCallback(
    (exercise: ExerciseForm) => {
      setSelectedExercise(exercise);
      toggleMenuButton(true);
      setIsExerciseFormVisible(true);
    },
    [toggleMenuButton]
  );

  const closeExerciseForm = useCallback(async () => {
    await Promise.all([getAllUserExercises(), getAllGlobalExercises()]);
    setIsExerciseFormVisible(false);
    setSelectedExercise(null);
    toggleMenuButton(false);
    hideMenu();
  }, [getAllUserExercises, getAllGlobalExercises, toggleMenuButton]);

  const openExerciseForm = useCallback(
    (global = false) => {
      setIsGlobal(global);
      setIsExerciseFormVisible(true);
      toggleMenuButton(true);
    },
    [toggleMenuButton]
  );

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseForm }) => (
      <View className="h-20">
        <Card
          onPress={() => handleExerciseDetails(item)}
          customClasses="h-full"
        >
          <View className="flex flex-col">
            <Text
              className="smallPhone:text-[14px] text-base text-primaryColor font-bold"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {item.name}
            </Text>
            <Text
              className="smallPhone:text-[12px] text-sm text-white"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              BodyPart: {item.bodyPart}
            </Text>
          </View>
        </Card>
      </View>
    ),
    [handleExerciseDetails]
  );

  return (
    <BackgroundMainSection>
      <View className="flex flex-col p-4" style={{ gap: 32 }}>
        <View className="flex flex-row items-center justify-between">
          <Text
            className="text-white smallPhone:text-base text-lg font-bold"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Filter by body part:
          </Text>
          <CustomDropdown
            value={bodyPart || "All"}
            data={bodyPartsToSelect}
            onSelect={handleSelectBodyPart}
          />
        </View>

        <View className="flex flex-col" style={{ gap: 16 }}>
          {!isGlobalExercisesLoading ? (
            <View className="flex flex-col">
              <View className="flex flex-row items-center justify-between">
                <Text
                  className="smallPhone:text-base text-lg text-white font-bold"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  Global exercises:
                </Text>
                {isAdmin && (
                  <CustomButton
                    textSize="smallPhone:text-sm text-base"
                    onPress={() => openExerciseForm(true)}
                    textWeight={FontWeights.bold}
                    buttonStyleType={ButtonStyle.success}
                    text="Add new exercise"
                  />
                )}
              </View>
              <FlatList
                data={filteredExercises(globalExercises)}
                renderItem={renderExerciseItem}
                keyExtractor={(item) => `${item._id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              />
            </View>
          ) : (
            <ViewLoading />
          )}
          {!isLoading ? (
            <View>
              <View className="flex flex-row items-center justify-between">
                <Text
                  className="smallPhone:text-base text-lg text-white font-bold"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  User exercises:
                </Text>
                <CustomButton
                  textSize="smallPhone:text-sm text-base"
                  onPress={() => openExerciseForm()}
                  textWeight={FontWeights.bold}
                  buttonStyleType={ButtonStyle.success}
                  text="Add new exercise"
                />
              </View>
              <FlatList
                data={filteredExercises(userExercises)}
                renderItem={renderExerciseItem}
                keyExtractor={(item) => `${item._id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              />
            </View>
          ) : (
            <ViewLoading />
          )}
        </View>
      </View>
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

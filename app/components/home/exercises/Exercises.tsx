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

const Exercises: React.FC = () => {
  const { toggleMenuButton, apiURL, hideMenu } = useHomeContext();
  const [globalExercises, setGlobalExercises] = useState<ExerciseForm[]>([]);
  const [userExercises, setUserExercises] = useState<ExerciseForm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseForm | null>(
    null
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | null>(null);
  const [isExerciseFormVisible, setIsExerciseFormVisible] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    await Promise.all([
      getAllGlobalExercises(),
      getAllUserExercises(),
      checkIsAdmin(),
    ]);
    setIsLoading(false);
  };

  const getAllGlobalExercises = useCallback(async () => {
    const response = await fetch(
      `${apiURL}/api/exercise/getAllGlobalExercises`
    );
    if (response.ok) setGlobalExercises(await response.json());
  }, [apiURL]);

  const getAllUserExercises = useCallback(async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${apiURL}/api/exercise/${id}/getAllUserExercises`
    );
    if (response.ok) setUserExercises(await response.json());
  }, [apiURL]);

  const checkIsAdmin = useCallback(async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/isAdmin`);
    setIsAdmin(await response.json());
  }, [apiURL]);

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
              className="text-base text-primaryColor font-bold"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {item.name}
            </Text>
            <Text
              className="text-sm text-white"
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
            className="text-white text-lg font-bold"
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

        <View>
          <View className="flex flex-row items-center justify-between">
            <Text
              className="text-lg text-white font-bold"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Global exercises:
            </Text>
            {isAdmin && (
              <CustomButton
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
          <View className="flex flex-row items-center justify-between">
            <Text
              className="text-lg text-white font-bold"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              User exercises:
            </Text>
            <CustomButton
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
      </View>

      {isLoading && <ViewLoading />}
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

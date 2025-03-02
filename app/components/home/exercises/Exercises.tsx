import { View, Text, FlatList,BackHandler } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { ExerciseForm } from "./../../../../interfaces/Exercise";
import ViewLoading from "../../elements/ViewLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateExercise from "./CreateExercise";
import CustomButton, {
  ButtonStyle,
} from "../../elements/CustomButton";
import { FontWeights } from "./../../../../enums/FontsProperties";
import React from "react";
import CustomDropdown from "../../elements/Dropdown";
import { BodyParts } from "./../../../../enums/BodyParts";
import { DropdownItem } from "./../../../../interfaces/Dropdown";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import Card from "../../elements/Card";


interface ExercisesProps {
  toggleMenuButton: (hide: boolean) => void;
}

const Exercises: React.FC<ExercisesProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [globalExercises, setGlobalExercises] = useState<ExerciseForm[]>([]);
  const [userExercises, setUserExercises] = useState<ExerciseForm[]>([]);
  const [filteredGlobalExercises, setFilteredGlobalExercises] = useState<
    ExerciseForm[]
  >([]);
  const [filteredUserExercises, setFilteredUserExercises] = useState<
    ExerciseForm[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExerciseDetailsVisible, setIsExerciseDetailsVisible] =
    useState<boolean>(false);
  const [isExerciseFormVisible, setIsExerciseFormVisible] =
    useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<
    ExerciseForm | undefined
  >();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | null>(null);
  const [bodyPartsToSelect, setBodyPartsToSelect] = useState<DropdownItem[]>(
    []
  );

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [bodyPart, globalExercises, userExercises]);

  const init = async () => {
    setIsLoading(true);
    await getAllGlobalExercises();
    await getAllUserExercises();
    await checkIsAdmin();
    getBodyParts();
    setIsLoading(false);
  };

  const getAllGlobalExercises = async () => {
    const response = await fetch(
      `${API_URL}/api/exercise/getAllGlobalExercises`
    );
    if (response.ok) {
      const result = await response.json();
      setGlobalExercises(result);
    }
  };

  const getAllUserExercises = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/exercise/${id}/getAllUserExercises`
    );
    if (response.ok) {
      const result = await response.json();
      setUserExercises(result);
    }
  };

  const checkIsAdmin = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${API_URL}/api/${id}/isAdmin`);
    const result = await response.json();
    setIsAdmin(result);
  };

  const getBodyParts = () => {
    const array: DropdownItem[] = Object.values(BodyParts).map((item) => ({
      label: item,
      value: item,
    }));
    setBodyPartsToSelect(array);
  };

  const filterExercises = () => {
    if (!bodyPart) {
      setFilteredGlobalExercises(globalExercises);
      setFilteredUserExercises(userExercises);
    } else {
      setFilteredGlobalExercises(
        globalExercises.filter((exercise) => exercise.bodyPart === bodyPart)
      );
      setFilteredUserExercises(
        userExercises.filter((exercise) => exercise.bodyPart === bodyPart)
      );
    }
  };

  const handleSelectBodyPart = async (item: DropdownItem | null) => {
    setBodyPart(item ? (item.value as BodyParts) : null);
  };

  const showExerciseDetails = (exercise: ExerciseForm): void => {
    setSelectedExercise(exercise);
    props.toggleMenuButton(true);
    setIsExerciseDetailsVisible(true);
  };

  const closeExerciseDetails = async (): Promise<void> => {
    setIsExerciseDetailsVisible(false);
    setSelectedExercise(undefined);
    await getAllUserExercises();
    props.toggleMenuButton(false);
  };

  const openExerciseForm = (): void => {
    props.toggleMenuButton(true);
    setIsExerciseFormVisible(true);
  };
  const openGlobalExerciseForm = (): void => {
    setIsGlobal(true);
    openExerciseForm();
  };

  const closeAddExerciseForm = async () => {
    await getAllUserExercises();
    await getAllGlobalExercises();
    setIsExerciseFormVisible(false);
    props.toggleMenuButton(false);
  };

  const renderExerciseItem = useCallback(({ item }: { item: ExerciseForm }) => {
    return (
      <View className="h-20">
        <Card onPress={() => showExerciseDetails(item)} customClasses="h-full">
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
    );
  }, []);

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
            {isAdmin ? (
              <CustomButton
                onPress={openGlobalExerciseForm}
                textWeight={FontWeights.bold}
                buttonStyleType={ButtonStyle.success}
                text="Add new exercise"
              />
            ) : (
              <></>
            )}
          </View>

          <FlatList
            data={filteredGlobalExercises}
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
              onPress={openExerciseForm}
              textWeight={FontWeights.bold}
              buttonStyleType={ButtonStyle.success}
              text="Add new exercise"
            />
          </View>

          <FlatList
            data={filteredUserExercises}
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
          closeForm={closeAddExerciseForm}
          isAdmin={isAdmin}
          isGlobal={isGlobal}
        />
      )}
      {isExerciseDetailsVisible && selectedExercise && (
        <CreateExercise
          closeForm={closeExerciseDetails}
          form={selectedExercise}
          isAdmin={isAdmin}
        />
      )}
    </BackgroundMainSection>
  );
};

export default Exercises;

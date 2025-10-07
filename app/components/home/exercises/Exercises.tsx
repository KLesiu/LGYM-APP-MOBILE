import { View, Text, FlatList } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ExerciseForm } from "../../../../interfaces/Exercise";
import ViewLoading from "../../elements/ViewLoading";
import CreateExercise from "./CreateExercise";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import React from "react";
import CustomDropdown from "../../elements/Dropdown";
import { BodyParts } from "../../../../enums/BodyParts";
import { DropdownItem } from "../../../../interfaces/Dropdown";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import Card from "../../elements/Card";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";

const Exercises: React.FC = () => {
  const { toggleMenuButton,  hideMenu, userId } =
    useHomeContext();
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
  const { getAPI,getRankColor } = useAppContext();

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
    } finally {
      setIsGlobalExercisesLoading(false);
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

  const filteredExercises = (exercises: ExerciseForm[]) =>
    bodyPart ? exercises.filter((e) => e.bodyPart === bodyPart) : exercises;

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

  const closeExerciseForm = async () => {
    setIsExerciseFormVisible(false);
    toggleMenuButton(false);
    hideMenu();
    setIsGlobalExercisesLoading(true);
    setIsLoading(true);
    await Promise.all([getAllUserExercises(), getAllGlobalExercises()]);
    setSelectedExercise(null);
    setIsGlobalExercisesLoading(false);
    setIsLoading(false);
  };

  const openExerciseForm = useCallback(
    (global = false) => {
      setIsGlobal(global);
      setIsExerciseFormVisible(true);
      toggleMenuButton(true);
    },
    [toggleMenuButton]
  );

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseForm }, isUserExercises = false) => {
      const textColor = isUserExercises ? getRankColor : '#20bc2d'
      return(
      <View className="h-20 smallPhone:h-16 flex justify-center items-center">
        <Card
          onPress={() => handleExerciseDetails(item)}
          customClasses="h-full bg-secondaryColor "
        >
          <View className="flex flex-col">
            <Text
              className={`text-sm ${
                isUserExercises ? `text-[${getRankColor}]` : "text-primaryColor"
              } font-bold`}
              style={{ fontFamily: "OpenSans_700Bold",color:textColor }}
            >
              {item.name}
            </Text>
            <Text
              className=" text-sm font-normal  text-textColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              BodyPart: {item.bodyPart}
            </Text>
          </View>
        </Card>
      </View>
    )},
    [handleExerciseDetails]
  );

  return (
    <BackgroundMainSection>
      <View className="flex flex-col h-full w-full" style={{ gap: 8 }}>
        <Card customClasses="flex flex-row items-center">
          <Text
            className="text-primaryColor  text-base"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Filter by body part:
          </Text>
          <CustomDropdown
            value={bodyPart || "All"}
            data={bodyPartsToSelect}
            onSelect={handleSelectBodyPart}
          />
        </Card>
        <Card>
          {!isGlobalExercisesLoading ? (
            <View className="flex flex-col" style={{ gap: 8 }}>
              <View className="flex flex-row items-center justify-between">
                <Text
                  className="text-primaryColor  text-base smallPhone:text-base"
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  Global exercises:
                </Text>
                {isAdmin && (
                  <CustomButton
                    onPress={() => openExerciseForm(true)}
                  buttonStyleType={ButtonStyle.outlineBlack}
                    buttonStyleSize={ButtonSize.long}
                    text="New"
                  />
                )}
              </View>
              <FlatList
                data={filteredExercises(globalExercises)}
                renderItem={renderExerciseItem}
                keyExtractor={(item) => `${item._id}`}
                showsHorizontalScrollIndicator={false}
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              />
            </View>
          ) : (
            <ViewLoading />
          )}
        </Card>

        <Card>
          {!isLoading && getRankColor ? (
            <View className="flex flex-col" style={{ gap: 8 }}>
              <View className="flex flex-row items-center w-full justify-between">
                <Text
                  className={`text-base smallPhone:text-base `}
                  style={{ fontFamily: "OpenSans_700Bold",color:getRankColor }}
                >
                  User exercises:
                </Text>
                <CustomButton
                  onPress={() => openExerciseForm()}
                  buttonStyleType={ButtonStyle.outlineBlack}
                  buttonStyleSize={ButtonSize.long}
                  text="New"
                />
              </View>
              <FlatList
                data={filteredExercises(userExercises)}
                renderItem={(items: { item: ExerciseForm }) =>
                  renderExerciseItem(items, true)
                }
                keyExtractor={(item) => `${item._id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              />
            </View>
          ) : (
            <ViewLoading />
          )}
        </Card>
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

import { View, Text, Pressable, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { ExerciseForm } from "../../../interfaces/Exercise";
import ViewLoading from "../../elements/ViewLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateExercise from "./CreateExercise";
import ExerciseDetails from "./ExerciseDetails";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import { FontWeights } from "../../../enums/FontsProperties";

interface StartProps {
  viewChange: (view: JSX.Element) => void;
  toggleMenuButton: (hide: boolean) => void;
}

const Exercises: React.FC<StartProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [globalExercises, setGlobalExercises] = useState<ExerciseForm[]>([]);
  const [userExercises, setUserExercises] = useState<ExerciseForm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExerciseDetailsVisible, setIsExerciseDetailsVisible] =
    useState<boolean>(false);
  const [isExerciseFormVisible, setIsExerciseFormVisible] =
    useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseForm>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getAllGlobalExercises();
    getAllUserExercises();
    checkIsAdmin();
  }, []);

  const getAllGlobalExercises = async () => {
    const response = await fetch(
      `${API_URL}/api/exercise/getAllGlobalExercises`
    );
    if (response.ok) {
      const result = await response.json();
      setGlobalExercises(result);
    }
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
  const renderExerciseItem = ({ item }: { item: ExerciseForm }) => {
    const customElements: JSX.Element[] = [
      <Text
        className="text-base text-[#131313] font-bold"
        style={{
          fontFamily: "OpenSans_700Bold",
        }}
      >
        {item.name}
      </Text>,
      <Text
        className="text-sm text-[#1f1f1f]"
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        BodyPart: {item.bodyPart}
      </Text>,
    ];
    return (
      <CustomButton
        customSlots={customElements}
        onPress={() => showExerciseDetails(item)}
        buttonStyleType={ButtonStyle.success}
        buttonStyleSize={ButtonSize.xxl}
      />
    );
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
    setIsLoading(false);
  };
  const openGlobalExerciseForm = (): void => {
    setIsGlobal(true);
    openExerciseForm()
  }
  const openExerciseForm = (): void => {
    props.toggleMenuButton(true);
    setIsExerciseFormVisible(true);
  };
  const closeAddExerciseForm = async () => {
    await getAllUserExercises();
    await getAllGlobalExercises()
    setIsExerciseFormVisible(false);
    props.toggleMenuButton(false);
  };
  const checkIsAdmin = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${API_URL}/api/${id}/isAdmin`);
    const result = await response.json();
    setIsAdmin(result);
  };
  return (
    <View className="relative flex flex-1 bg-[#121212]">
      <View className="flex  flex-col  p-4 ">
        <View className="flex flex-col ">
          <View className="flex w-full  justify-between flex-row  items-center">
            <Text
              className="w-full text-lg text-white  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
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

          <View className=" flex flex-col ">
            <FlatList
              data={globalExercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => `${item._id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10 }}
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            />
          </View>
        </View>
        <View className="flex flex-col ">
          <View className="flex w-full  justify-between flex-row  items-center">
            <Text
              className="text-lg text-white  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
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
            data={userExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => `${item._id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          />
        </View>
      </View>
      {isLoading ? <ViewLoading /> : <Text></Text>}
      {isExerciseFormVisible ? (
        <View className="absolute h-full w-full flex flex-col  bg-[#121212]  top-0 z-30 ">
          <CreateExercise closeForm={closeAddExerciseForm} isAdmin={isAdmin} isGlobal={isGlobal} />
        </View>
      ) : (
        <Text></Text>
      )}
      {isExerciseDetailsVisible && selectedExercise ? (
        <ExerciseDetails
          hideDetails={closeExerciseDetails}
          exercise={selectedExercise}
        />
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

export default Exercises;

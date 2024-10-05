import { View, Text, ScrollView, Pressable,FlatList } from "react-native";
import StartProps from "./props/StartProps";
import { useEffect, useState } from "react";
import { ExerciseForm } from "./interfaces/Exercise";
import ViewLoading from "./ViewLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateExercise from "./CreateExercise";
import ExerciseDetails from "./ExerciseDetails";

const Exercises: React.FC<StartProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [globalExercises, setGlobalExercises] = useState<ExerciseForm[]>([]);
  const [userExercises, setUserExercises] = useState<ExerciseForm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExerciseDetailsVisible, setIsExerciseDetailsVisible] = useState<boolean>(false)
  const [isExerciseFormVisible, setIsExerciseFormVisible] =
    useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseForm>();

  useEffect(() => {
    setIsLoading(true);
    getAllGlobalExercises();
    getAllUserExercises();
  }, []);

  const getAllGlobalExercises = async () => {
    const response = await fetch(
      `${API_URL}/api/exercise/getAllGlobalExercises`
    )
      .then((res) => res.json())
      .catch((err) => err);
    setGlobalExercises(response);
  };
  const showExerciseDetails = (exercise:ExerciseForm): void => {
    setSelectedExercise(exercise)
    setIsExerciseDetailsVisible(true)
  }
  const closeExerciseDetails = async(): Promise<void> => {
    setIsExerciseDetailsVisible(false)
    setSelectedExercise(undefined)
    await getAllUserExercises()
  }
  const renderExerciseItem = ({ item }: { item: ExerciseForm }) => (
    <Pressable
      onPress={() => showExerciseDetails(item)}
      className="flex flex-col w-36 rounded-lg bg-[#94e798] p-2  "
    >
      <Text
        className="text-base text-[#131313] font-bold"
        style={{
          fontFamily: "OpenSans_700Bold",
        }}
      >
        {item.name}
      </Text>
      <Text
        className="text-sm text-[#1f1f1f]"
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        BodyPart: {item.bodyPart}
      </Text>
    </Pressable>
  );
  const getAllUserExercises = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/exercise/${id}/getAllUserExercises`
    )
      .then((res) => res.json())
      .catch((err) => err);
    setUserExercises(response);
    setIsLoading(false);
  };
  const openExerciseForm = (): void => {
    setIsExerciseFormVisible(true);
  };
  return (
    <View className="relative flex flex-1">
      <View className="flex  flex-col  p-4 ">
        {isLoading ? <ViewLoading /> : <Text></Text>}
        <View className="flex flex-col gap-2">
          <Text
            className="w-full text-lg text-white  font-bold "
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
          >
            Global exercises:
          </Text>
          <View className=" flex flex-col ">
            <FlatList
            data={globalExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => `${item._id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            ItemSeparatorComponent={() => <View style={{ width: 4 }} />} // odstępy między elementami
          />
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <View className="flex flex-row justify-between items-center">
            <Text
              className="w-full text-lg text-white  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              User exercises:
            </Text>
            <Pressable
              onPress={openExerciseForm}
              className="w-40  h-12 flex items-center justify-center bg-[#94e798] rounded-lg"
            >
              <Text
                className="text-base text-black  font-bold "
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Add new exercise
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={userExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => `${item._id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />} />

        </View>
      </View>

      {isExerciseFormVisible ? (
        <View className="absolute h-full w-full flex flex-col  bg-black  top-0 z-30 gap-0">
          <CreateExercise closeForm={() => setIsExerciseFormVisible(false)} />
        </View>
      ) : (
        <Text></Text>
      )}
      {isExerciseDetailsVisible && selectedExercise? <ExerciseDetails hideDetails={closeExerciseDetails} exercise={selectedExercise} /> : <Text></Text>}
    </View>
  );
};

export default Exercises;

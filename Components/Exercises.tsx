import { View, Text, ScrollView, Pressable } from "react-native";
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
            <ScrollView className="smh:h-20 mdh:h-36">
              <View className="flex flex-row flex-wrap gap-1">
                {globalExercises.map((exercise, index) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={()=>showExerciseDetails(exercise)}
                      className="flex flex-col w-[48%] rounded-lg bg-[#4cd963b6] p-2  "
                    >
                      <Text
                        className="text-base text-white font-bold"
                        style={{
                          fontFamily: "OpenSans_700Bold",
                        }}
                      >
                        {exercise.name}
                      </Text>
                      <Text
                        className="text-sm text-black  "
                        style={{
                          fontFamily: "OpenSans_400Regular",
                        }}
                      >
                        BodyPart: {exercise.bodyPart}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
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
              className="w-40  h-12 flex items-center justify-center bg-[#4CD964] rounded-lg"
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

          <ScrollView className="smh:h-20 mdh:h-36">
            <View className="flex flex-row flex-wrap gap-1">
              {userExercises.map((exercise, index) => {
                return (
                  <Pressable
                   onPress={()=>showExerciseDetails(exercise)}
                    key={index}
                    className="flex flex-col w-[48%] rounded-lg bg-[#4cd963b6] p-2  "
                  >
                    <Text
                      className="text-base text-white font-bold"
                      style={{
                        fontFamily: "OpenSans_700Bold",
                      }}
                    >
                      {exercise.name} 
                    </Text>
                    <Text
                      className="text-sm text-black  "
                      style={{
                        fontFamily: "OpenSans_400Regular",
                      }}
                    >
                      BodyPart: {exercise.bodyPart}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
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

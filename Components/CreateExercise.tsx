import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { BodyParts } from "./enums/BodyParts";
import { Message } from "./enums/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResponseMessage from "./interfaces/ResponseMessage";
import CreateExerciseProps from "./props/CreateExerciseProps";
import CustomDropdown, { DropdownItem } from "./Dropdown";

const CreateExercise: React.FC<CreateExerciseProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [exerciseName, setExerciseName] = useState<string>("");
  const [bodyPart, setBodyPart] = useState<BodyParts>();
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>();
  const [bodyPartsToSelect, setBodyPartsToSelect] = useState<DropdownItem[]>(
    []
  );

  useEffect(() => {
    getBodyParts();
  }, []);

  const handleSelectBodyPart = (item: { label: string; value: string }) => {
    setBodyPart(item.value as BodyParts);
  };

  const createExercise = async (): Promise<void> => {
    if (!exerciseName || !bodyPart)
      return setError("Name and body part are required!");
    const id = await AsyncStorage.getItem("id");
    const response: ResponseMessage = await fetch(
      `${API_URL}/api/exercise/${id}/addUserExercise`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: exerciseName,
          bodyPart: bodyPart,
          description: description,
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => err);
    if (response.msg === Message.Created) props.closeForm();
    else setError(response.msg);
  };
  const getBodyParts = () => {
    const array: DropdownItem[] = Object.values(BodyParts).map((item) => {
      return {
        label: item,
        value: item,
      };
    });
    setBodyPartsToSelect(array);
  };

  return (
    <View className="absolute h-full w-[95%] flex flex-col  bg-black  top-0 z-30 p-4 gap-2">
      <Text
        className="text-3xl text-white text-center border-b-2 border-[#4CD964] w-full p-4 "
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        New Exercise
      </Text>
      <View className="flex flex-col gap-2 p-2">
        <View className="flex flex-col gap-2">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-white text-xl"
          >
            Name:
          </Text>
          <TextInput
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="bg-white h-8  text-black "
            onChangeText={(text: string) => setExerciseName(text)}
            value={exerciseName}
          />
        </View>
        <View className="flex flex-col gap-2">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-white text-xl"
          >
            BodyPart:
          </Text>
          <View>
            <CustomDropdown
              data={bodyPartsToSelect}
              onSelect={handleSelectBodyPart}
            />
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-white text-xl"
          >
            Description:
          </Text>
          <TextInput
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="bg-white h-40  text-black "
            multiline
            onChangeText={(text: string) => setDescription(text)}
            value={description}
          />
        </View>
      </View>
      <View className="flex flex-row justify-center">
        <Pressable
          onPress={createExercise}
          className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"
        >
          <Text className="text-xl" style={{ fontFamily: "OpenSans_700Bold" }}>
            Create
          </Text>
        </Pressable>
      </View>
      {error?<Text style={{fontFamily:'OpenSans_300Light'}} className="text-red-500 text-lg">{error}</Text>:''}
    </View>
  );
};

export default CreateExercise;

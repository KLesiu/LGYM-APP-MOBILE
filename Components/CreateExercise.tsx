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
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [bodyPartsToSelect, setBodyPartsToSelect] = useState<DropdownItem[]>(
    []
  );

  useEffect(() => {
    if (props.form) {
      setExerciseName(props.form.name);
      setBodyPart(props.form.bodyPart as BodyParts);
      setDescription(props.form.description);
      if (!props.form.user) {
        checkIsBlocked();
      }
    }
    getBodyParts();
  }, []);

  const handleSelectBodyPart = (item: { label: string; value: string }) => {
    setBodyPart(item.value as BodyParts);
  };

  const checkIsBlocked = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${API_URL}/api/isAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    })
      .then((res) => res)
      .catch((err) => err)
      .then((res) => res.json());
    setIsBlocked(!response);
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
      .then((res) => res)
      .catch((err) => err)
      .then((res) => res.json());
    if (response.msg === Message.Created && props.closeForm) props.closeForm();
    else setError(response.msg);
  };

  const updateExercise = async (): Promise<void> => {
    if (!exerciseName || !bodyPart)
      return setError("Name and body part are required!");
    const response: ResponseMessage = await fetch(
      `${API_URL}/api/exercise/updateExercise`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: props.form?._id,
          name: exerciseName,
          bodyPart: bodyPart,
          description: description,
        }),
      }
    )
      .then((res) => res)
      .catch((err) => err)
      .then((res) => res.json());
    if (response.msg === Message.Updated && props.closeForm) props.closeForm();
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
    <View>
      {!props.form ? (
        <Text
          className="text-3xl text-white text-center border-b-2 border-[#4CD964] w-full p-4 "
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          New Exercise
        </Text>
      ) : (
        <Text></Text>
      )}

      <View style={{gap:8}} className="flex flex-col p-2">
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
            readOnly={isBlocked}
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
            {isBlocked ? (
              <Text
                style={{ fontFamily: "OpenSans_400Regular" }}
                className="text-white text-lg"
              >
                {bodyPart}
              </Text>
            ) : (
              <CustomDropdown
                value={bodyPart}
                data={bodyPartsToSelect}
                onSelect={handleSelectBodyPart}
              />
            )}
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
            readOnly={isBlocked}
          />
        </View>
      </View>
      <View className="flex flex-row justify-between p-2">
        
      {!isBlocked && (
    <>
      {props.form ? (
        <Pressable
          onPress={updateExercise}
          className="bg-[#94e798] w-40 h-12 flex items-center justify-center rounded-lg"
        >
          <Text
            className="text-xl"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Update
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={createExercise}
          className="bg-[#94e798] w-40 h-12 flex items-center justify-center rounded-lg"
        >
          <Text
            className="text-xl"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Create
          </Text>
        </Pressable>
      )}
    </>
  )}
        <Pressable
          onPress={props.closeForm}
          className="rounded-lg flex flex-row justify-center items-center  w-40 h-12 bg-[#3f3f3f]"
        >
          <Text
            className="text-center text-xl text-white"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            CANCEL
          </Text>
        </Pressable>
      </View>
      {error ? (
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-red-500 text-lg"
        >
          {error}
        </Text>
      ) : (
        ""
      )}
    </View>
  );
};

export default CreateExercise;

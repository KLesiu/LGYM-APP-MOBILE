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
    <View className="flex flex-col w-full h-full p-4" style={{gap:16}}>
      {!props.form ? (
        <Text
        className="text-lg text-white border-b-[1px] border-[#94e798] py-1  w-full"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
          New Exercise
        </Text>
      ) : (
        <Text></Text>
      )}

      <View style={{gap:16}} className="flex flex-col w-full">
        <View style={{ gap: 8 }} className="flex flex-col w-full  ">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
              className="text-white text-base"
          >
            Name:
          </Text>
          <TextInput
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgba(30, 30, 30, 0.45)",
              borderRadius:8
            }}
            className="w-full px-2 py-4  text-white "
            onChangeText={(text: string) => setExerciseName(text)}
            value={exerciseName}
            readOnly={isBlocked}
          />
        </View>
        <View  style={{ gap: 8 }} className="flex flex-col w-full  ">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
              className="text-white text-base"
          >
            BodyPart:
          </Text>
          <View>
            {isBlocked ? (
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
              className="text-white text-base"
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
        <View  style={{ gap: 8 }} className="flex flex-col w-full  ">
          <Text
             style={{ fontFamily: "OpenSans_300Light" }}
              className="text-white text-base"
          >
            Description:
          </Text>
          <TextInput
            style={{
              fontFamily: "OpenSans_400Regular",
              borderRadius:8,
              backgroundColor: "rgba(30, 30, 30, 0.45)",
            }}
            className="w-full px-2 py-4  text-white "
            multiline
            onChangeText={(text: string) => setDescription(text)}
            value={description}
            readOnly={isBlocked}
          />
        </View>
      </View>
      <View className="flex flex-row justify-between ">
        

        <Pressable
        style={{borderRadius:8}}
          onPress={props.closeForm}
         className=" flex flex-row justify-center items-center  w-40 h-12 bg-[#3f3f3f]"
        >
          <Text
           className="text-center text-base text-white"
           style={{
             fontFamily: "OpenSans_400Regular",
           }}
          >
            Cancel
          </Text>
        </Pressable>
        {!isBlocked && (
    <>
      {props.form ? (
        <Pressable
          onPress={updateExercise}
          style={{borderRadius:8}}
          className="bg-[#94e798] w-40 h-12 flex items-center justify-center "
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
          style={{borderRadius:8}}
           className="bg-[#94e798] w-40 h-12 flex items-center justify-center"
        >
          <Text
             className="text-base"
             style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Create
          </Text>
        </Pressable>
      )}
    </>
  )}
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

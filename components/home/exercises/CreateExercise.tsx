import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { BodyParts } from "../../../enums/BodyParts";
import { Message } from "../../../enums/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResponseMessage from "../../../interfaces/ResponseMessage";
import CustomDropdown from "../../elements/Dropdown";
import { ExerciseForm } from "../../../interfaces/Exercise";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { DropdownItem } from "../../../interfaces/Dropdown";
import React from "react";
import Dialog from "../../elements/Dialog";
interface CreateExerciseProps {
  closeForm: () => void;
  form?: ExerciseForm;
  isGlobal?: boolean;
  isAdmin?: boolean;
}

const CreateExercise: React.FC<CreateExerciseProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [exerciseName, setExerciseName] = useState<string>("");
  const [bodyPart, setBodyPart] = useState<BodyParts>();
  const [description, setDescription] = useState<string | undefined>("");
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
        setIsBlocked(!props.isAdmin);
      }
    }
    getBodyParts();
  }, []);

  const handleSelectBodyPart = (item: DropdownItem | null) => {
    if (!item) return setBodyPart(undefined);
    setBodyPart(item.value as BodyParts);
  };

  const create = async () => {
    if (props.isGlobal) await createGlobalExercise();
    else await createExercise();
  };

  const createExercise = async (): Promise<void> => {
    if (!validateForm()) return;
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
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
    );
    const result = await response.json();
    if (result.msg === Message.Created && props.closeForm) props.closeForm();
    else setError(result.msg);
  };

  const createGlobalExercise = async (): Promise<void> => {
    if (!validateForm()) return;
    const response = await fetch(`${API_URL}/api/exercise/addExercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: exerciseName,
        bodyPart: bodyPart,
        description: description,
      }),
    });
    const result = await response.json();
    if (result.msg === Message.Created && props.closeForm) props.closeForm();
    else setError(result.msg);
  };

  const validateForm = (): boolean => {
    if (!exerciseName || !bodyPart) {
      setError(Message.FieldRequired);
      return false;
    }
    return true;
  };
  const updateExercise = async (): Promise<void> => {
    if (!exerciseName || !bodyPart)
      return setError("Name and body part are required!");
    const response = await fetch(`${API_URL}/api/exercise/updateExercise`, {
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
    });
    const result: ResponseMessage = await response.json();
    if (result.msg === Message.Updated && props.closeForm) props.closeForm();
    else setError(result.msg);
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
    <Dialog>
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

        <View style={{ gap: 16 }} className="flex flex-col w-full">
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
                borderRadius: 8,
              }}
              className="w-full px-2 py-4  text-white "
              onChangeText={(text: string) => setExerciseName(text)}
              value={exerciseName}
              readOnly={isBlocked}
            />
          </View>
          <View style={{ gap: 8 }} className="flex flex-col w-full  ">
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
          <View style={{ gap: 8 }} className="flex flex-col w-full  ">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-white text-base"
            >
              Description:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                borderRadius: 8,
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
        <View className="flex flex-row justify-between " style={{ gap: 8 }}>
          <CustomButton
            onPress={props.closeForm}
            text="Cancel"
            buttonStyleType={ButtonStyle.cancel}
            width="flex-1"
          />
          {!isBlocked && (
            <>
              {props.form ? (
                <CustomButton
                  onPress={updateExercise}
                  text="Update"
                  buttonStyleType={ButtonStyle.success}
                  width="flex-1"
                  textSize="text-xl"
                />
              ) : (
                <CustomButton
                  onPress={create}
                  text="Create"
                  buttonStyleType={ButtonStyle.success}
                  width="flex-1"
                  textSize="text-xl"
                />
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
    </Dialog>
  );
};

export default CreateExercise;

import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { BodyParts } from "./../../../../enums/BodyParts";
import { Message } from "./../../../../enums/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResponseMessage from "./../../../../interfaces/ResponseMessage";
import CustomDropdown from "../../elements/Dropdown";
import { ExerciseForm } from "./../../../../interfaces/Exercise";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { DropdownItem } from "./../../../../interfaces/Dropdown";
import React from "react";
import Dialog from "../../elements/Dialog";
import ExerciseIcon from "./../../../../img/icons/exercisesIcon.svg";
import ValidationView from "../../elements/ValidationView";
import { useAppContext } from "../../../AppContext";
import { useHomeContext } from "../HomeContext";
interface CreateExerciseProps {
  closeForm: () => void;
  form?: ExerciseForm;
  isGlobal?: boolean;
  isAdmin?: boolean;
}

const CreateExercise: React.FC<CreateExerciseProps> = (props) => {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [bodyPart, setBodyPart] = useState<BodyParts>();
  const [description, setDescription] = useState<string | undefined>("");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const { postAPI, setErrors,isLoading } = useAppContext();
  const { userId } = useHomeContext();

  useEffect(() => {
    if (props.form) {
      if (!props.form.user) {
        setIsBlocked(!props.isAdmin);
      }
      setExerciseName(props.form.name);
      setBodyPart(props.form.bodyPart as BodyParts);
      setDescription(props.form.description);
    }
  }, []);

  const handleSelectBodyPart = useCallback((item: DropdownItem | null) => {
    if (!item) return setBodyPart(undefined);
    setBodyPart(item.value as BodyParts);
  }, []);

  const createExercise = async (): Promise<void> => {
    if (!validateForm()) return;
    try {
      await postAPI(
        `/exercise/${userId}/addUserExercise`,
        (response: ResponseMessage) => props.closeForm(),
        {
          name: exerciseName,
          bodyPart: bodyPart,
          description: description,
        }
      );
    } catch (error) {
      setErrors([Message.TryAgain]);
    }
  };

  const createGlobalExercise = async (): Promise<void> => {
    if (!validateForm()) return;
    try {
      await postAPI(
        "/exercise/addExercise",
        (response: ResponseMessage) => props.closeForm(),
        {
          name: exerciseName,
          bodyPart: bodyPart,
          description: description,
        }
      );
    } catch (error) {
      setErrors([Message.TryAgain]);
    }
  };

  const validateForm = useCallback((): boolean => {
    if (!exerciseName || !bodyPart) {
      setErrors([Message.FieldRequired]);
      return false;
    }
    return true;
  }, [exerciseName, bodyPart]);

  const updateExercise = async (): Promise<void> => {
    if (!exerciseName || !bodyPart)
      return setErrors(["Name and body part are required!"]);
    try {
      await postAPI("/exercise/updateExercise", () => props.closeForm(), {
        _id: props.form?._id,
        name: exerciseName,
        bodyPart: bodyPart,
        description: description,
      });
    } catch (error) {
      setErrors([Message.TryAgain]);
    }
  };

  const deleteExercise = async (): Promise<void> => {
    if (!props.form?._id) return;
    try {
      await postAPI(
        `/exercise/${userId}/deleteExercise`,
        (response: ResponseMessage) => props.closeForm(),
        { id: props.form._id }
      );
    } catch (error) {
      setErrors([Message.TryAgain]);
    }
  };

  const handleSubmit = () => {
    if (props.isGlobal) createGlobalExercise();
    else if (props.form) updateExercise();
    else createExercise();
  };

  const bodyPartsToSelect = useMemo(() => {
    const array: DropdownItem[] = Object.values(BodyParts).map((item) => {
      return {
        label: item,
        value: item,
      };
    });
    return array;
  }, []);

  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2">
          <Text
            className=" text-3xl smallPhone:text-2xl text-white"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {props.form ? "Edit Exercise" : "New Exercise"}
          </Text>
        </View>
        <View className="px-5" style={{ gap: 16 }}>
          <View className="flex flex-row items-center" style={{ gap: 8 }}>
            <ExerciseIcon />
            <Text
              className=" text-xl smallPhone:text-lg text-white"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              Set an exercise
            </Text>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-white text-base smallPhone:text-sm"
            >
              Name:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-white  "
              onChangeText={(text: string) => setExerciseName(text)}
              value={exerciseName}
              readOnly={isBlocked}
            />
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-white text-base smallPhone:text-sm"
            >
              BodyPart:
            </Text>
            <View>
              {isBlocked ? (
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="text-white text-base smallPhone:text-sm"
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
          <View style={{ gap: 4 }} className="flex flex-col">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-white text-base smallPhone:text-sm"
            >
              Description:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_300Light",
                borderRadius: 8,
                backgroundColor: "rgb(30, 30, 30)",
              }}
              className="w-full px-2 py-4  text-white "
              multiline
              onChangeText={(text: string) => setDescription(text)}
              value={description}
              readOnly={isBlocked}
            />
          </View>
        </View>
        <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
          <CustomButton
            onPress={props.closeForm}
            text="Cancel"
            buttonStyleType={ButtonStyle.outlineBlack}
            width="flex-1"
          />

          {!isBlocked && (
            <>
              {props.form && props.form._id && (
                <CustomButton
                  onPress={deleteExercise}
                  disabled={isLoading}
                  text="Delete"
                  buttonStyleType={ButtonStyle.default}
                  width="flex-1"
                />
              )}

              <CustomButton
                onPress={handleSubmit}
                disabled={isLoading}
                text={props.form ? "Update" : "Create"}
                buttonStyleType={ButtonStyle.success}
                width="flex-1"
              />
            </>
          )}
        </View>
        <ValidationView />
      </View>
    </Dialog>
  );
};

export default CreateExercise;

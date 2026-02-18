import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { BodyParts } from "./../../../../enums/BodyParts";
import { Message } from "./../../../../enums/Message";
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
import { usePostApiExerciseIdAddUserExercise, usePostApiExerciseAddExercise, usePostApiExerciseUpdateExercise, usePostApiExerciseIdDeleteExercise } from "../../../../api/generated/exercise/exercise";
import { ExerciseFormDto, EnumLookupDto, EnumLookupResponseDto } from "../../../../api/generated/model";
import { useGetApiEnumsEnumType } from "../../../../api/generated/enum/enum";


interface CreateExerciseProps {
  closeForm: () => void;
  form?: ExerciseForm;
  isGlobal?: boolean;
  isAdmin?: boolean;
}

const CreateExercise: React.FC<CreateExerciseProps> = (props) => {
  const { t } = useTranslation();
  const [exerciseName, setExerciseName] = useState<string>("");
  const [bodyPart, setBodyPart] = useState<EnumLookupDto | undefined>();
  const [description, setDescription] = useState<string | undefined>("");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const { setErrors } = useAppContext();
  const { userId } = useHomeContext();

  const createUserExerciseMutation = usePostApiExerciseIdAddUserExercise();
  const createGlobalExerciseMutation = usePostApiExerciseAddExercise();
  const updateExerciseMutation = usePostApiExerciseUpdateExercise();
  const deleteExerciseMutation = usePostApiExerciseIdDeleteExercise();

  const { data: bodyPartsData, isLoading: isLoadingBodyParts } = useGetApiEnumsEnumType("BodyParts");

  const isLoading = createUserExerciseMutation.isPending ||
    createGlobalExerciseMutation.isPending ||
    updateExerciseMutation.isPending ||
    deleteExerciseMutation.isPending;

  useEffect(() => {
    if (props.form) {
      if (!props.form.user) {
        setIsBlocked(!props.isAdmin);
      }
      setExerciseName(props.form.name || "");
      setBodyPart(props.form.bodyPart || undefined);
      setDescription(props.form.description || "");
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!exerciseName || !bodyPart) {
      setErrors([t("createExercise.nameAndBodyPartRequired")]);
      return false;
    }
    return true;
  }, [exerciseName, bodyPart, setErrors, t]);

  const createExercise = async (): Promise<void> => {
    if (!validateForm()) return;
    try {
      const payload: ExerciseFormDto = {
        name: exerciseName,
        bodyPart: bodyPart?.name || null,
        description: description,
      };
      await createUserExerciseMutation.mutateAsync({
        id: userId,
        data: payload,
      });
      props.closeForm();
    } catch (error) {
      setErrors([t("common.tryAgain")]);
    }
  };

  const createGlobalExercise = async (): Promise<void> => {
    if (!validateForm()) return;
    try {
      const payload: ExerciseFormDto = {
        name: exerciseName,
        bodyPart: bodyPart?.name || null,
        description: description,
      };
      await createGlobalExerciseMutation.mutateAsync({
        data: payload,
      });
      props.closeForm();
    } catch (error) {
      setErrors([t("common.tryAgain")]);
    }
  };

  const updateExercise = async (): Promise<void> => {
    if (!exerciseName || !bodyPart)
      return setErrors([t("createExercise.nameAndBodyPartRequired")]);
    try {
      const payload: ExerciseFormDto = {
        _id: props.form?._id,
        name: exerciseName,
        bodyPart: bodyPart?.name || null,
        description: description,
      };
      await updateExerciseMutation.mutateAsync({
        data: payload,
      });
      props.closeForm();
    } catch (error) {
      setErrors([t("common.tryAgain")]);
    }
  };

  const deleteExercise = async (): Promise<void> => {
    if (!props.form?._id) return;
    try {
      await deleteExerciseMutation.mutateAsync({
        id: userId,
        data: {
          id: props.form._id,
        },
      });
      props.closeForm();
    } catch (error) {
      setErrors([t("common.tryAgain")]);
    }
  };

  const handleSubmit = () => {
    if (props.isGlobal) createGlobalExercise();
    else if (props.form) updateExercise();
    else createExercise();
  };

  const bodyPartsToSelect = useMemo(() => {
    const responseData = bodyPartsData?.data as EnumLookupResponseDto;
    if (responseData && responseData.values) {
      return responseData.values.map((item) => ({
        label: item.displayName || item.name || "",
        value: item.name || "",
      }));
    }
    return [];
  }, [bodyPartsData]);

  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2">
          <Text
            className=" text-3xl smallPhone:text-2xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {props.form ? t("createExercise.editExercise") : t("createExercise.newExercise")}
          </Text>
        </View>
        <View className="px-5" style={{ gap: 16 }}>
          <View className="flex flex-row items-center" style={{ gap: 8 }}>
            <ExerciseIcon />
            <Text
              className=" text-xl smallPhone:text-lg text-textColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("createExercise.setExercise")}
            </Text>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="  text-textColor text-base smallPhone:text-sm"
              >
                {t("createExercise.exerciseName")}:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>

            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-textColor  "
              onChangeText={(text: string) => setExerciseName(text)}
              value={exerciseName}
              readOnly={isBlocked}
            />
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="  text-textColor text-base smallPhone:text-sm"
              >
                {t("createExercise.bodyPart")}:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>

             <View>
              {isBlocked ? (
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="text-textColor text-base smallPhone:text-sm"
                >
                  {bodyPart?.displayName || ""}
                </Text>
              ) : (
                <CustomDropdown
                  value={bodyPart?.name || ""}
                  data={bodyPartsToSelect}
                  onSelect={(item) => {
                    if (!item) {
                      setBodyPart(undefined);
                      return;
                    }
                    const selected = (bodyPartsData?.data as EnumLookupResponseDto)?.values?.find(
                      (bp) => bp.name === item.value
                    );
                    if (selected) {
                      setBodyPart(selected);
                    }
                  }}
                />
              )}
            </View>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-textColor text-base smallPhone:text-sm"
            >
              {t("createExercise.description")}:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_300Light",
                borderRadius: 8,
                backgroundColor: "rgb(30, 30, 30)",
              }}
              className="w-full px-2 py-4  text-textColor "
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
            text={t("common.cancel")}
            buttonStyleType={ButtonStyle.outlineBlack}
            width="flex-1"
          />

          {!isBlocked && (
            <>
              {props.form && props.form._id && (
                <CustomButton
                  onPress={deleteExercise}
                  disabled={isLoading}
                  text={t("createExercise.delete")}
                  buttonStyleType={ButtonStyle.default}
                  width="flex-1"
                />
              )}

              <CustomButton
                onPress={handleSubmit}
                disabled={isLoading}
                text={props.form ? t("common.update") : t("common.create")}
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

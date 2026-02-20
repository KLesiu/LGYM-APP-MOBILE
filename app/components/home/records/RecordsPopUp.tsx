import { Text, View, TextInput, Pressable } from "react-native";
import { MainRecordsForm } from "./../../../../interfaces/MainRecords";
import AutoComplete from "./../../elements/Autocomplete";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseForm } from "./../../../../interfaces/Exercise";
import { isIntValidator } from "./../../../../helpers/numberValidator";
import { WeightUnits } from "./../../../../enums/Units";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { DropdownItem } from "./../../../../interfaces/Dropdown";
import Dialog from "../../elements/Dialog";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import ValidationView from "../../elements/ValidationView";
import React from "react";
import { useTranslation } from "react-i18next";
import RecordIcon from "./../../../../img/icons/recordsIcon.svg";
import { useGetApiExerciseIdGetAllExercises } from "../../../../api/generated/exercise/exercise";
import { usePostApiMainRecordsIdAddNewRecord } from "../../../../api/generated/main-records/main-records";

import { ExerciseResponseDto } from "../../../../api/generated/model";
import { BodyParts } from "../../../../enums/BodyParts";

interface RecordsPopUpProps {
  offPopUp: () => void;
  exerciseId: string | undefined;
}
const RecordsPopUp: React.FC<RecordsPopUpProps> = (props) => {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [weight, setWeight] = useState<string>();
  const [clearQuery, setClearQuery] = useState<boolean>(false);
  const { userId } = useHomeContext();
  const { setErrors } = useAppContext();

  const { data: exercisesData } = useGetApiExerciseIdGetAllExercises(userId, {
    query: { enabled: !!userId },
  });

  const { mutateAsync: addNewRecordMutation } =
    usePostApiMainRecordsIdAddNewRecord();

  useEffect(() => {
    if (exercisesData?.data) {
      const response = (exercisesData.data as ExerciseResponseDto[]).map(
        (dto) => ({
          _id: dto._id || "",
          name: dto.name || "",
          user: dto.user || "",
          bodyPart: dto.bodyPart || undefined,
          description: dto.description || "",
          image: dto.image || "",
        })
      );
      const helpExercisesToSelect = response.map((exercise: ExerciseForm) => {
        return {
          label: exercise.name,
          value: exercise._id,
        } as DropdownItem;
      });
      if (props.exerciseId) {
        const exercise = helpExercisesToSelect.find(
          (exercise) => exercise.value === props.exerciseId
        );
        if (exercise) {
          setSelectedExercise(exercise);
        }
      }
      setExercisesToSelect(helpExercisesToSelect);
    }
  }, [exercisesData, props.exerciseId]);

  const clearAutoCompleteQuery = () => setClearQuery(false);

  const validator = (input: string): void => {
    if (!input) return setWeight(input);
    const result = isIntValidator(input);
    if (result) setWeight(input);
  };

  const createNewRecord = async () => {
    if (!weight || !selectedExercise) return setErrors([t('common.fieldRequired')]);
    
    try {
      await addNewRecordMutation({
        id: userId,
        data: {
          weight: parseFloat(weight),
          exercise: selectedExercise.value,
          unit: WeightUnits.KILOGRAMS,
          date: new Date().toISOString(),
        },
      });
      props.offPopUp();
    } catch (error) {
      console.error("Error creating new record:", error);
      setErrors([t('common.tryAgain')]);
    }
  };
  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2">
          <Text
            className=" text-3xl smallPhone:text-2xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {props.exerciseId && selectedExercise
              ? t('records.editRecord')
              : t('records.newRecord')}
          </Text>
        </View>
        <View className="px-5" style={{ gap: 16 }}>
          <View className="flex flex-row items-center" style={{ gap: 8 }}>
            <RecordIcon />
            <Text
              className=" text-xl smallPhone:text-lg text-textColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t('records.setRecord')}
            </Text>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-textColor text-base smallPhone:text-sm"
            >
              {t('records.exercise')}:
            </Text>
            {props.exerciseId && selectedExercise ? (
              <TextInput
                style={{ fontFamily: "OpenSans_400Regular" }}
                className="w-full  px-2 py-4 smallPhone:px-1 smallPhone:py-3 bg-secondaryColor rounded-lg  text-textColor "
                readOnly={true}
                value={selectedExercise.label}
              />
            ) : (
              <AutoComplete
                data={exercisesToSelect}
                onSelect={(item) => setSelectedExercise(item)}
                value={selectedExercise?.label || ""}
                onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined}
              />
            )}
          </View>
          <View className="flex flex-col w-full" style={{ gap: 4 }}>
            <Text
              className="text-textColor  text-base smallPhone:text-sm"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              {t('records.weight')}:
            </Text>
            <TextInput
              style={{ fontFamily: "OpenSans_400Regular" }}
              className="w-full  px-2 py-4 smallPhone:px-1 smallPhone:py-3 bg-secondaryColor rounded-lg  text-textColor "
              onChangeText={validator}
              value={weight}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
          <CustomButton
            text={t('common.cancel')}
            onPress={props.offPopUp}
            buttonStyleType={ButtonStyle.cancel}
            width="flex-1"
          />
          <CustomButton
            text={t('common.add')}
            onPress={createNewRecord}
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
          />
        </View>

        <ValidationView />
      </View>
    </Dialog>
  );
};
export default RecordsPopUp;

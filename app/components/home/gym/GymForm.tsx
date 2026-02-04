import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { GymForm as GymFormVm } from "./../../../../interfaces/Gym";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import Dialog from "../../elements/Dialog";
import GymIcon from "./../../../../img/icons/gymIcon.svg";
import ValidationView from "../../elements/ValidationView";
import { useHomeContext } from "../HomeContext";
import React from "react";
import { usePostApiGymIdAddGym, usePostApiGymEditGym } from "../../../../api/generated/gym/gym";
import type { CreateOrUpdateGymDto, GymFormDto } from "../../../../api/generated/model";

interface GymFormProps {
  closeForm: () => void;
  gym?: GymFormDto;
}

const GymForm: React.FC<GymFormProps> = (props) => {
  const { userId } = useHomeContext();
  const [gymName, setGymName] = useState<string>("");

  const addGymMutation = usePostApiGymIdAddGym();
  const editGymMutation = usePostApiGymEditGym();

  const isLoading = addGymMutation.isPending || editGymMutation.isPending;

  useEffect(() => {
    if (props.gym) setGymName(props.gym.name);
  }, []);

  const updateGym = async () => {
    try {
      const payload: CreateOrUpdateGymDto = {
        name: gymName,
        _id: props.gym?._id,
      };
      await editGymMutation.mutateAsync({
        data: payload,
      });
      props.closeForm();
    } catch (error) {
      console.error("Error updating gym:", error);
    }
  };

  const createGym = async () => {
    try {
      const payload: CreateOrUpdateGymDto = {
        name: gymName,
      };
      await addGymMutation.mutateAsync({
        id: userId,
        data: payload,
      });
      props.closeForm();
    } catch (error) {
      console.error("Error creating gym:", error);
    }
  };

  const handleSubmit = () => {
    if (props.gym) updateGym();
    else createGym();
  };

  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2">
          <Text
            className=" text-3xl smallPhone:text-2xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {props.gym ? "Edit Gym" : "New Gym"}
          </Text>
        </View>
        <View className="px-5" style={{ gap: 16 }}>
          <View className="flex flex-row items-center" style={{ gap: 4 }}>
            <GymIcon />
            <Text
              className="text-xl smallPhone:text-lg text-textColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              Set a gym
            </Text>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="  text-textColor   text-base smallPhone:text-sm"
              >
                Name:
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
              onChangeText={(text) => setGymName(text)}
              value={gymName}
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
          <CustomButton
            onPress={handleSubmit}
            disabled={isLoading}
            text={props.gym ? "Update" : "Create"}
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
          />
        </View>
        <ValidationView />
      </View>
    </Dialog>
  );
};

export default GymForm;

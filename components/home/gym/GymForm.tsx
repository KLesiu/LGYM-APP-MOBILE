import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { GymForm as GymFormVm } from "../../../interfaces/Gym";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../../../enums/Message";
import Dialog from "../../elements/Dialog";

interface GymFormProps {
  closeForm: () => void;
  gym?: GymFormVm;
}

const GymForm: React.FC<GymFormProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [gymName, setGymName] = useState<string>("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props.gym) setGymName(props.gym.name);
  }, []);

  const updateGym = async () => {
    const response = await fetch(`${API_URL}/api/gym/editGym`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: gymName, _id: props.gym?._id }),
    });
    const result = await response.json();
    if (result.msg === Message.Updated) props.closeForm();
  };
  const createGym = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${API_URL}/api/gym/${id}/addGym`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: gymName }),
    });
    const result = await response.json();
    if (result.msg === Message.Created) props.closeForm();
  };

  return (
    <Dialog>
      {!props.gym ? (
        <Text
          className="text-lg text-white border-b-[1px] border-[#94e798] py-1  w-full"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          New gym
        </Text>
      ) : (
        <Text
          className="text-lg text-white border-b-[1px] border-[#94e798] py-1  w-full"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Edit gym
        </Text>
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
            onChangeText={(text: string) => setGymName(text)}
            value={gymName}
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
        {props.gym ? (
          <CustomButton
            onPress={updateGym}
            text="Update"
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
            textSize="text-xl"
          />
        ) : (
          <CustomButton
            onPress={createGym}
            text="Create"
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
            textSize="text-xl"
          />
        )}
      </View>
    </Dialog>
  );
};

export default GymForm;

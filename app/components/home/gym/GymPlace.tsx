import { View, Text, Image } from "react-native";
import { GymChoiceInfo, GymForm } from "./../../../../interfaces/Gym";
import CustomButton, { ButtonSize } from "../../elements/CustomButton";
import EditIcon from "./../../../../img/icons/editIcon.svg";
import RemoveIcon from "./../../../../img/icons/deleteIcon.svg";
import React from "react";
import Card from "../../elements/Card";

interface GymPlaceProps {
  gym: GymChoiceInfo;
  isEditable: boolean;
  editGym?: (id: string) => void;
  deleteGym?: (id: string) => void;
}

const GymPlace: React.FC<GymPlaceProps> = (props) => {
  const { lastTrainingInfo } = props.gym;
  const trainingDate =
    lastTrainingInfo && lastTrainingInfo.createdAt
      ? new Date(props.gym.lastTrainingInfo.createdAt).toLocaleDateString()
      : "";
  const trainingName =
    lastTrainingInfo && lastTrainingInfo.type && lastTrainingInfo.type.name
      ? lastTrainingInfo.type.name
      : "";
  return (
    <Card>
      <View className="flex flex-col">
        <View className="flex flex-row justify-between w-full">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-2xl font-bold text-primaryColor"
          >
            {props.gym.name}
          </Text>
          {props.isEditable ? (
            <View style={{ gap: 8 }} className="flex flex-row">
              <CustomButton
                buttonStyleSize={ButtonSize.small}
                onPress={() =>
                  props.editGym ? props.editGym(`${props.gym._id}`) : null
                }
                customSlots={[<EditIcon fill={'white'} width={24} height={24}/>]}
              />
              <CustomButton
                buttonStyleSize={ButtonSize.small}
                onPress={() =>
                  props.deleteGym ? props.deleteGym(`${props.gym._id}`) : null
                }
                customSlots={[<RemoveIcon />]}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
        <View className="flex flex-col">
          <Text
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="text-lg text-white"
          >
            Last training: {`${trainingDate} ${trainingName}`}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default GymPlace;

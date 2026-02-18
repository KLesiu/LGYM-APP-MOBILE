import { View, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { GymChoiceInfo, GymForm } from "./../../../../interfaces/Gym";
import CustomButton, { ButtonSize } from "../../elements/CustomButton";
import EditIcon from "./../../../../img/icons/editIcon.svg";
import RemoveIcon from "./../../../../img/icons/deleteIcon.svg";
import React, { useMemo } from "react";
import Card from "../../elements/Card";
import type { GymChoiceInfoDto } from "../../../../api/generated/model";

interface GymPlaceProps {
  gym: GymChoiceInfoDto;
  isEditable: boolean;
  editGym?: (id: string) => void;
  deleteGym?: (id: string) => void;
}

const GymPlace: React.FC<GymPlaceProps> = (props) => {
  const { t } = useTranslation();
  const { lastTrainingInfo } = props.gym;
  const trainingDate = useMemo(
    () =>
      lastTrainingInfo && lastTrainingInfo.createdAt
        ? new Date(lastTrainingInfo.createdAt).toLocaleDateString()
        : "",
    [lastTrainingInfo]
  );

  const trainingName = useMemo(
    () =>
      lastTrainingInfo && lastTrainingInfo.type && lastTrainingInfo.type.name
        ? lastTrainingInfo.type.name
        : "",
    [lastTrainingInfo]
  );

  return (
    <Card>
      <View className="flex flex-col">
        <View className="flex flex-row justify-between items-center w-full">
          <View className="flex flex-col">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className=" text-base font-bold text-textColor"
            >
              {props.gym.name}
            </Text>
            <Text
              style={{ fontFamily: "OpenSans_400Regular" }}
              className=" text-sm text-fifthColor"
            >
              {t("gym.lastTraining")} {`${trainingDate} ${trainingName}`}
            </Text>
          </View>
          {props.isEditable && (
            <View style={{ gap: 8 }} className="flex flex-row">
              <CustomButton
                buttonStyleSize={ButtonSize.small}
                onPress={() =>
                  props.editGym ? props.editGym(`${props.gym._id}`) : null
                }
                customSlots={[
                  <EditIcon fill={"white"} width={24} height={24} />,
                ]}
              />
              <CustomButton
                buttonStyleSize={ButtonSize.small}
                onPress={() =>
                  props.deleteGym ? props.deleteGym(`${props.gym._id}`) : null
                }
                customSlots={[<RemoveIcon />]}
              />
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

export default GymPlace;

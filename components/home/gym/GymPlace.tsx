import { View, Text, Image } from "react-native";
import { GymForm } from "../../../interfaces/Gym";
import CustomButton, { ButtonSize } from "../../elements/CustomButton";
import EditIcon from "./../../../img/icons/edit.png";
import RemoveIcon from "./../../../img/icons/remove.png";

interface GymPlaceProps {
  gym: GymForm;
  editGym: (id: string | undefined) => void;
  deleteGym: (id: string | undefined) => void;
}

const GymPlace: React.FC<GymPlaceProps> = (props) => {
  return (
    <View
      style={{ borderRadius: 8 }}
      className="flex flex-col p-4 bg-[#282828] w-full"
    >
      <View className="flex flex-row justify-between w-full">
        <Text
          style={{ fontFamily: "OpenSans_700Bold" }}
          className="text-2xl font-bold text-[#94e798]"
        >
          {props.gym.name}
        </Text>
        <View style={{ gap: 8 }} className="flex flex-row">
          <CustomButton
            buttonStyleSize={ButtonSize.small}
            onPress={() => props.editGym(props.gym._id)}
            customSlots={[<Image className="w-6 h-6" source={EditIcon} />]}
          />
          <CustomButton
            buttonStyleSize={ButtonSize.small}
            onPress={() => props.deleteGym(props.gym._id)}
            customSlots={[<Image className="w-6 h-6" source={RemoveIcon} />]}
          />
        </View>
      </View>
      <View className="flex flex-col">
        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-lg text-white"
        >
          Address:
        </Text>
        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-lg text-white"
        >
          Last training:
        </Text>
      </View>
    </View>
  );
};

export default GymPlace;

import { View, Text, TextInput } from "react-native";
import PlanNameIcon from "./../../../..//img/icons/planIcon.svg";
import CustomButton, {
  ButtonStyle,
} from "../../../elements/CustomButton";
import ValidationView from "../../../elements/ValidationView";
import { useState } from "react";
import { Message } from "../../../../enums/Message";

interface CreatePlanDayNameProps {
  goBack: () => void;
  goToNext: () => void;
  setPlanName: (name: string) => void;
  planDayName: string;
}

const CreatePlanDayName: React.FC<CreatePlanDayNameProps> = (props) => {

  const [errors, setErrors] = useState<string[]>([]);

  const goNextSection = () => {
    if(validateForm()){
      return props.goToNext();
    }
    setErrors([Message.FieldRequired])
  }

  const validateForm = () => {
    if(!props.planDayName.length) return false;
    return true;
  }
  return (
    <View className="w-full h-full">
      <View className="px-5 py-2">
        <Text
          className="text-3xl text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          New Plan Day
        </Text>
      </View>
      <View className="px-5" style={{ gap: 16 }}>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <PlanNameIcon />
          <Text
            className="text-xl text-white"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Set a plan name
          </Text>
        </View>
        <View style={{ gap: 4 }} className="flex flex-col">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="  text-white  text-base"
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
            onChangeText={(text: string) => props.setPlanName(text)}
            value={props.planDayName}
          />
        </View>
      </View>
      <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={props.goBack}
          text="Back"
          width="flex-1"
        />
        <CustomButton
          buttonStyleType={ButtonStyle.default}
          onPress={goNextSection}
          text="Next"
          width="flex-1"
        />
      </View>
      <ValidationView errors={errors} />
    </View>
  );
};

export default CreatePlanDayName;

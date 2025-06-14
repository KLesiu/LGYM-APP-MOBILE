import { View, Text, TextInput } from "react-native";
import PlanNameIcon from "./../../../../../img/icons/planIcon.svg";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ValidationView from "../../../elements/ValidationView";
import { useCallback, useMemo, useState } from "react";
import { Message } from "./../../../../../enums/Message";
import { usePlanDay } from "./CreatePlanDayContext";

const CreatePlanDayName: React.FC = () => {
  const { planDayName, setPlanDayName, goBack, goToNext } = usePlanDay();

  const [errors, setErrors] = useState<string[]>([]);

  const goNextSection = () => {
    if (validateForm) {
      return goToNext();
    }
    setErrors([Message.FieldRequired]);
  };

  const validateForm = useMemo(() => {
    if (!planDayName.length) return false;
    return true;
  },[planDayName])
   
  return (
    <View className="w-full h-full">
      <View className="px-5 py-2">
        <Text
          className="smallPhone:text-xl midPhone:text-3xl text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          New Plan Day
        </Text>
      </View>
      <View className="px-5" style={{ gap: 16 }}>
        <View className="flex flex-row items-center" style={{ gap: 8 }}>
          <PlanNameIcon />
          <Text
            className="smallPhone:text-base midPhone:text-xl text-white"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Set a plan name
          </Text>
        </View>
        <View style={{ gap: 4 }} className="flex flex-col">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="  text-white smallPhone:text-sm  midPhone:text-base"
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
            onChangeText={(text: string) => setPlanDayName(text)}
            value={planDayName}
          />
        </View>
      </View>
      <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={goBack}
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

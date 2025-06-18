import { View, Text, TextInput } from "react-native";
import PlanNameIcon from "./../../../../../img/icons/planIcon.svg";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ValidationView from "../../../elements/ValidationView";
import {  useMemo,} from "react";
import { Message } from "./../../../../../enums/Message";
import { usePlanDay } from "./CreatePlanDayContext";
import { useAppContext } from "../../../../AppContext";

const CreatePlanDayName: React.FC = () => {
  const { planDayName, setPlanDayName, goBack, goToNext } = usePlanDay();
  const {setErrors} = useAppContext()


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
          className="text-3xl smallPhone:text-xl text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          New Plan Day
        </Text>
      </View>
      <View className="px-5" style={{ gap: 16 }}>
        <View className="flex flex-row items-center" style={{ gap: 8 }}>
          <PlanNameIcon />
          <Text
            className="text-xl smallPhone:text-base text-white"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Set a plan name
          </Text>
        </View>
        <View style={{ gap: 4 }} className="flex flex-col">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="  text-white  text-base smallPhone:text-sm"
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
      <ValidationView  />
    </View>
  );
};

export default CreatePlanDayName;

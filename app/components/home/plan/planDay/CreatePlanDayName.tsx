import { View, Text, TextInput } from "react-native";
import PlanNameIcon from "./../../../../../img/icons/planIcon.svg";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ValidationView from "../../../elements/ValidationView";
import { useMemo } from "react";
import { Message } from "./../../../../../enums/Message";
import { usePlanDay } from "./CreatePlanDayContext";
import { useAppContext } from "../../../../AppContext";
import React from "react";
import { useTranslation } from "react-i18next";

const CreatePlanDayName: React.FC = () => {
  const { t } = useTranslation();
  const { planDayName, setPlanDayName, goBack, goToNext } = usePlanDay();
  const { setErrors } = useAppContext();

  const goNextSection = () => {
    if (validateForm) {
      return goToNext();
    }
    setErrors([Message.FieldRequired]);
  };

  const validateForm = useMemo(() => {
    if (!planDayName.length) return false;
    return true;
  }, [planDayName]);

  return (
    <View className="w-full flex-1">
      <View className="flex-1 px-5 py-2" style={{ gap: 16 }}>
        <View className="flex flex-row items-center" style={{ gap: 8 }}>
          <PlanNameIcon />
          <View style={{ gap: 2 }}>
            <Text
              className="text-xl smallPhone:text-base text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t('plans.setPlanName')}
            </Text>
            <Text
              className="text-sm text-fifthColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t('plans.nameStepDescription')}
            </Text>
          </View>
        </View>
        <View style={{ gap: 4 }} className="flex flex-col">
          <View className="flex flex-row gap-1">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-textColor  text-base smallPhone:text-sm"
            >
              {t('plans.name')}:
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
            onChangeText={(text: string) => setPlanDayName(text)}
            value={planDayName}
          />
        </View>
      </View>
      <View className="w-full p-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={goBack}
          text={t('plans.back')}
          width="flex-1"
        />
        <CustomButton
          buttonStyleType={ButtonStyle.default}
          onPress={goNextSection}
          text={t('plans.next')}
          width="flex-1"
        />
      </View>
      <ValidationView />
    </View>
  );
};

export default CreatePlanDayName;

import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { isIntValidator } from "./../../../../helpers/numberValidator";
import ResponseMessage from "./../../../../interfaces/ResponseMessage";
import { Message } from "./../../../../enums/Message";
import ViewLoading from "../../elements/ViewLoading";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import Dialog from "../../elements/Dialog";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import ValidationView from "../../elements/ValidationView";
import PlanNameIcon from "./../../../../img/icons/planIcon.svg";
import React from "react";

interface CreatePlanConfigProps {
  reloadSection: VoidFunction;
  hidePlanConfig: VoidFunction;
}

const CreatePlanConfig: React.FC<CreatePlanConfigProps> = (props) => {
  const { userId } = useHomeContext();
  const { postAPI, setErrors } = useAppContext();
  const [planName, setPlanName] = useState<string>("");
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const sendConfig = async (): Promise<void> => {
    if (!planName ) return setErrors([Message.FieldRequired]);
    setViewLoading(true);
    await submitPlanConfig();
    setViewLoading(false);
  };

  const submitPlanConfig = async (): Promise<void> => {
    await postAPI(
      `/${userId}/createPlan`,
      (result: ResponseMessage) => {
        props.reloadSection();
      },
      { name: planName }
    );
  };

  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2">
          <Text
            className="text-3xl smallPhone:text-xl text-white"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Plan Config
          </Text>
        </View>
        <View className="px-5" >
          <View style={{ gap: 4 }} className="flex flex-col">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-white  text-base smallPhone:text-sm"
            >
              Plan name:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-white  "
              onChangeText={(text: string) => setPlanName(text)}
              value={planName}
            />
          </View>
        </View>
        <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
          <CustomButton
            text="Cancel"
            onPress={props.hidePlanConfig}
            buttonStyleType={ButtonStyle.cancel}
            width="flex-1"
          />
          <CustomButton
            text="Next"
            onPress={sendConfig}
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
          />
        </View>
        <ValidationView />
      </View>
      {viewLoading && <ViewLoading />}
    </Dialog>
  );
};

export default CreatePlanConfig;

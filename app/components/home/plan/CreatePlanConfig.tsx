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

interface CreatePlanConfigProps {
  reloadSection: VoidFunction;
  hidePlanConfig: VoidFunction;
}

const CreatePlanConfig: React.FC<CreatePlanConfigProps> = (props) => {
  const { userId } = useHomeContext();
  const { postAPI,setErrors } = useAppContext();
  const [planName, setPlanName] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<string>("");
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const sendConfig = async (): Promise<void> => {
    if (!planName || !numberOfDays) return setErrors([Message.FieldRequired]);
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
      { trainingDays: numberOfDays, name: planName }
    );
  };

  const validator = (input: string): void => {
    if (!input) return setNumberOfDays(input);
    const result = isIntValidator(input);
    if (result) setNumberOfDays(input);
  };

  return (
    <Dialog>
      <Text
        className="text-lg text-white border-b-[1px] border-primaryColor py-1  w-full"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Plan Config
      </Text>
      <View
        style={{ gap: 16 }}
        className="flex items-center flex-col justify-around w-full "
      >
        <View className="flex flex-col w-full" style={{ gap: 16 }}>
          <View style={{ gap: 8 }} className="flex flex-col w-full  ">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-white text-base"
            >
              Plan name:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className="w-full px-2 py-4  text-white "
              onChangeText={(text: string) => setPlanName(text)}
              value={planName}
            />
          </View>
          <View style={{ gap: 8 }} className="flex flex-col w-full ">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-white  text-base"
            >
              How many days per week?
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-white  "
              keyboardType="numeric"
              onChangeText={validator}
              value={numberOfDays}
            />
          </View>
        </View>
        <View className="flex flex-row justify-between w-full">
          <CustomButton
            text="Cancel"
            onPress={props.hidePlanConfig}
            buttonStyleType={ButtonStyle.cancel}
          />
          <CustomButton
            text="Next"
            onPress={sendConfig}
            buttonStyleType={ButtonStyle.success}
          />
        </View>
      </View>
      <ValidationView />

      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </Dialog>
  );
};

export default CreatePlanConfig;

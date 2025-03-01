import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIntValidator } from "../../../helpers/numberValidator";
import ResponseMessage from "../../../interfaces/ResponseMessage";
import { Message } from "../../../enums/Message";
import ViewLoading from "../../elements/ViewLoading";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import Dialog from "../../elements/Dialog";

interface CreatePlanConfigProps {
  reloadSection: VoidFunction;
  hidePlanConfig: VoidFunction;
}

const CreatePlanConfig: React.FC<CreatePlanConfigProps> = (props) => {
  const [planName, setPlanName] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<string>("");
  const [error, setError] = useState<string>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const sendConfig = async (): Promise<void> => {
    if (!planName || !numberOfDays) return setError(Message.FieldRequired);
    setViewLoading(true);
    await submitPlanConfig();
    setViewLoading(false);
  };

  const submitPlanConfig = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/${id}/createPlan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trainingDays: numberOfDays,
            name: planName,
          }),
        }
      );
      if (!response.ok) {
        console.error("Failed to send plan config");
        return setError(Message.TryAgain);
      }
      const data: ResponseMessage = await response.json();
      if (data.msg === Message.Created) {
        return props.reloadSection();
      } else {
        return setError(data.msg);
      }
    } catch (error) {
      setError(Message.TryAgain);
    }
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
      {error ? (
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-red-500 text-lg"
        >
          {error}
        </Text>
      ) : (
        ""
      )}
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </Dialog>
  );
};

export default CreatePlanConfig;

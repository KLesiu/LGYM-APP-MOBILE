import { View, Text, ScrollView } from "react-native";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { FontWeights } from "../../../enums/FontsProperties";
import GymPlace from "./GymPlace";
import { GymForm } from "../../../interfaces/Gym";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GymFormComponent from "./GymForm";
import { Message } from "../../../enums/Message";
interface GymProps {
  viewChange: (view: JSX.Element) => void;
  toggleMenuButton: (hide: boolean) => void;
}

const Gym: React.FC<GymProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;

  const [gyms, setGyms] = useState<GymForm[]>([]);
  const [currentChosenGym, setCurrentChosenGym] = useState<GymForm>();
  const [isGymFormVisible, setIsGymFormVisible] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getGyms();
  };

  const getGyms = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${API_URL}/api/gym/${id}/getGyms`);
    const result = await response.json();
    setGyms(result);
  };

  const getGym = async(id:string):Promise<GymForm>=>{
    const response = await fetch(`${API_URL}/api/gym/${id}/getGym`);
    const result = await response.json();
    return result;
  }


  const addNewGym = ()=>{
    setCurrentChosenGym(undefined);
    openForm();``
  }
  const openForm = () => {
    props.toggleMenuButton(true);
    setIsGymFormVisible(true);
  };

  const closeForm = async () => {
    await getGyms();
    setIsGymFormVisible(false);
    props.toggleMenuButton(false);
  };



  const editGym = async (id: string) => {
    const gym = await getGym(id);
    setCurrentChosenGym(gym);
    openForm();
  }

  const deleteGym = async (id: string) => {
    const response = await fetch(`${API_URL}/api/gym/${id}/deleteGym`, {
      method: "DELETE",
    });
    const result = await response.json();
    if(result.msg === Message.Deleted) await getGyms();
  }

  return (
    <View className="relative flex flex-1 bg-[#121212]">
      <View className="flex flex-col p-4" style={{ gap: 16 }}>
        <View className="flex flex-col ">
          <View className="flex w-full  justify-between flex-row  items-center">
            <Text
              className="text-lg text-white  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              Your gyms:
            </Text>

            <CustomButton
              onPress={addNewGym}
              textWeight={FontWeights.bold}
              buttonStyleType={ButtonStyle.success}
              text="Add gym"
            />
          </View>
        </View>
        <ScrollView className="w-full">
          <View style={{ gap: 8 }} className="flex flex-col pb-12">
            {gyms.map((gym, index) => (
              <GymPlace
                key={index}
                gym={gym}
                editGym={editGym}
                deleteGym={deleteGym}
                isEditable={true}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      {isGymFormVisible ? (
        <View className="absolute h-full w-full flex flex-col  bg-[#121212]  top-0 z-30 ">
          <GymFormComponent closeForm={closeForm} gym={currentChosenGym} />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default Gym;

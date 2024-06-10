import { View, TouchableOpacity, Image, Text } from "react-native";
import MenuProps from "./props/MenuProps";
import TrainingPlan from "./TrainingPlan";
import History from "./History";
import AddTraining from "./AddTraining";
import Profile from "./Profile";
import Start from "./Start";
import home from "./img/icons/home.png";
import profile from "./img/icons/profile.png";
import history from "./img/icons/history.png";
import addTraining from "./img/icons/add.png";
import plan from "./img/icons/plan.png";
import { MarkedDates, TrainingsDates } from "./types/Training";
import ErrorMsg from "./types/ErrorMsg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect,useState } from "react";

const Menu: React.FC<MenuProps> = (props) => {
  const [trainingsDates,setTrainingsDates]= useState<MarkedDates[]>([])
  useEffect(() => {
    dateScroll(new Date());
  }, []);
  // Do poprawy na backendzie!!! Narazie funkcja zwraca tablice wszystkich dat treningow uzytkownika ale docelowo ma zwracac daty z podanego przedziału!
  const dateScroll = async (date: any) => {
    const id = await AsyncStorage.getItem("id");
    const response: ErrorMsg | TrainingsDates = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/getTrainingDates`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          date: date,
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => err);
    if("msg" in response) return
    const markedDates: MarkedDates[]= response.dates.map((ele:Date)=>{
      return{
        date:ele,
        dots:[
          {color:'#4CD964'}
        ]
      }
    })
    setTrainingsDates(markedDates)
  };
  return (
    <View className="bg-[#131313] smh:h-20 lgh:h-32 py-3  w-[99%]">
      <View className="flex justify-between h-14 flex-row">
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() =>
              props.viewChange(<Start viewChange={props.viewChange} />)
            }
            className="items-center  flex h-full justify-center flex-col w-full"
          >
            <Image className="w-6 h-6" source={home} />
            <Text
              className="text-xs  text-gray-200/80 font-light leading-4"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Start
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<TrainingPlan />)}
            className="items-center  flex h-full justify-center flex-col w-full"
          >
            <Image source={plan} className="w-6 h-6" />
            <Text
              className="text-xs text-gray-200/80 font-light leading-4"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Plan
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<AddTraining />)}
            className="items-center  flex h-full justify-center flex-row w-full"
          >
            <Image source={addTraining} className="w-14 h-14" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<History trainingsDates={trainingsDates} />)}
            className="items-center  flex h-full justify-center flex-col w-full"
          >
            <Image source={history} className="w-6 h-6" />
            <Text
              className="text-gray-200/80 text-xs font-light leading-4"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<Profile />)}
            className="items-center  flex h-full justify-center flex-col w-full"
          >
            <Image source={profile} className="w-6 h-6" />
            <Text
              className="leading-4 text-xs text-gray-200/80 font-light"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Menu;

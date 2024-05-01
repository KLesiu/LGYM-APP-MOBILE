import { View, TouchableOpacity,Image,Text } from "react-native";
import MenuProps from "./props/MenuProps";
import TrainingPlan from "./TrainingPlan";
import History from "./History";
import AddTraining from "./AddTraining";
import Profile from "./Profile";
import Start from "./Start";
import home from './img/icons/home.png'
import profile from './img/icons/profile.png'
import history from './img/icons/history.png'
import addTraining from './img/icons/add.png'
import plan from './img/icons/plan.png'



const Menu: React.FC<MenuProps> = (props) => {
  return (
    <View className="bg-[#131313] h-32 py-3  w-[99%]">
      <View className="flex justify-between  h-14 flex-row">
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<Start />)}
            className="items-center  flex h-full justify-center flex-col w-full"
          >
            <Image className="w-6 h-6"  source={home}/>
            <Text  className="text-xs  text-gray-200/80 font-light leading-4" style={{fontFamily:"OpenSans_300Light"}}>Start</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<TrainingPlan />)}
            className="items-center  flex h-full justify-center flex-col w-full"
          >
            <Image  source={plan} className="w-6 h-6"/>
            <Text className="text-xs text-gray-200/80 font-light leading-4" style={{fontFamily:"OpenSans_300Light"}}>Plan</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<AddTraining />)}
            className="items-center  flex h-full justify-center flex-row w-full"
          >
            <Image source={addTraining} className="w-14 h-14"/>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<History />)}
            className="items-center  flex h-full justify-center flex-col w-full"
          >
            <Image  source={history} className="w-6 h-6"/>
            <Text className="text-gray-200/80 text-xs font-light leading-4" style={{fontFamily:"OpenSans_300Light"}}>History</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center w-[19.9%]">
          <TouchableOpacity
            onPress={() => props.viewChange(<Profile />)}
            className="items-center  flex h-full justify-center flex-col w-full"
          >
           <Image  source={profile} className="w-6 h-6"/>
           <Text className="leading-4 text-xs text-gray-200/80 font-light" style={{fontFamily:"OpenSans_300Light"}}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Menu;

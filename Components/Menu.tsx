import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MenuProps from "./props/MenuProps";
import TrainingPlan from "./TrainingPlan";
import History from "./History";
import AddTraining from "./AddTraining";
import Records from "./Records";
import Profile from "./Profile";

const Menu: React.FC<MenuProps> = (props) => {
  return (
    <View className="bg-[#28292a] flex justify-between flex-row h-[10%] w-full">
      <View className="flex flex-col justify-center w-[19.9%]">
        <TouchableOpacity
          onPress={() => props.viewChange(<TrainingPlan />)}
          className="items-center bg-[#595959] flex h-full justify-center flex-row w-full"
        >
          <Icon name="note-outline" size={40} color={`#cccccc`} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-col justify-center w-[19.9%]">
        <TouchableOpacity
          onPress={() => props.viewChange(<History />)}
          className="items-center bg-[#595959] flex h-full justify-center flex-row w-full"
        >
          <Icon name="calendar" size={40} color={`#cccccc`} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-col justify-center w-[19.9%]">
        <TouchableOpacity
          onPress={() => props.viewChange(<AddTraining />)}
          className="items-center bg-[#595959] flex h-full justify-center flex-row w-full"
        >
          <Icon name="plus" size={40} color={`#cccccc`} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-col justify-center w-[19.9%]">
        <TouchableOpacity
          onPress={() => props.viewChange(<Records />)}
          className="items-center bg-[#595959] flex h-full justify-center flex-row w-full"
        >
          <Icon name="trophy" size={40} color={`#cccccc`} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-col justify-center w-[19.9%]">
        <TouchableOpacity
          onPress={() => props.viewChange(<Profile />)}
          className="items-center bg-[#595959] flex h-full justify-center flex-row w-full"
        >
          <Icon name="account" size={40} color={`#cccccc`} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Menu;

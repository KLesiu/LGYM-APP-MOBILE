import {View} from "react-native";
import CreatePlanProps from "./props/CreateConfigPlanProps";
const CreatePlan:React.FC<CreatePlanProps>=(props)=><View className="absolute h-full w-full flex flex-col bg-black ">{props.formElements}</View>

export default CreatePlan
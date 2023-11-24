import {View} from "react-native";
import CreatePlanProps from "./props/CreateConfigPlanProps";
import { CreatePlanStyles } from "./styles/CreatePlanStyles";
const CreatePlan:React.FC<CreatePlanProps>=(props)=><View style={CreatePlanStyles.createPlanSection}>{props.formElements}</View>

export default CreatePlan
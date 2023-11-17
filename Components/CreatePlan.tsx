import { Text,Image,View,ImageBackground,TouchableOpacity, ScrollView,Alert } from "react-native";
import CreatePlanProps from "./props/CreateConfigPlanProps";
import { CreatePlanStyles } from "./styles/CreatePlanStyles";
const CreatePlan:React.FC<CreatePlanProps>=(props)=>{
    
    return(
        <View style={CreatePlanStyles.createPlanSection}>{props.formElements}</View>
       
    )
}
export default CreatePlan
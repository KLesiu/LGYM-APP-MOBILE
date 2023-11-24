import {View,TouchableOpacity } from "react-native";
import { MenuStyles } from "./styles/MenuStyles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuProps from "./props/MenuProps";
import TrainingPlan from "./TrainingPlan";
import History from "./History";
import AddTraining from "./AddTraining";
import Records from "./Records";
import Profile from "./Profile";

const Menu:React.FC<MenuProps>=(props)=>{
    return(
        <View style={MenuStyles.nav}>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity onPress={()=>props.viewChange(<TrainingPlan/>)} style={MenuStyles.button}>
                    <Icon name="note-outline" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity onPress={()=>props.viewChange(<History/>)} style={MenuStyles.button}>
                    <Icon name="calendar" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity onPress={()=>props.viewChange(<AddTraining/>)} style={MenuStyles.button}>
                    <Icon name="plus" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity onPress={()=>props.viewChange(<Records/>)} style={MenuStyles.button}>
                    <Icon name="trophy" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity onPress={()=>props.viewChange(<Profile/>)} style={MenuStyles.button}>
                    <Icon name="account" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default Menu
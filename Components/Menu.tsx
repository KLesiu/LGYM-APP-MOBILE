import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import { MenuStyles } from "./styles/MenuStyles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Menu:React.FC=()=>{
    return(
        <View style={MenuStyles.nav}>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity style={MenuStyles.button}>
                    <Icon name="note-outline" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity style={MenuStyles.button}>
                    <Icon name="calendar" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity style={MenuStyles.button}>
                    <Icon name="plus" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity style={MenuStyles.button}>
                    <Icon name="trophy" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
            <View style={MenuStyles.containerForButtonMenu}>
                <TouchableOpacity style={MenuStyles.button}>
                    <Icon name="account" size={40} color={`rgb(204, 204, 204)`}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default Menu
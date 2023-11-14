import { StyleSheet } from "react-native";

export const MenuStyles=StyleSheet.create({
    nav:{
        backgroundColor:'rgb(40,41,42)',
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        height:'10%',
        width:'100%'
    },
    containerForButtonMenu:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        width:'19.9%'
    },
    button:{
       alignItems:'center',
       backgroundColor:'rgb(89,89,89)',
       display:'flex',
       height:'100%',
       justifyContent:'center',
       flexDirection:'row',
       width:'100%' 
    }
})
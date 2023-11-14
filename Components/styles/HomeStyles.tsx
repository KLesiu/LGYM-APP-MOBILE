import { StyleSheet } from "react-native";

export const HomeStyles=StyleSheet.create({
    main:{
       backgroundColor: 'rgb(17,18,18)',
       display:'flex',
       flexDirection:'column',
       justifyContent:'space-between',
       position:'relative',
       height:'100%'
    },
    logoOfHome:{
        width:'15%',
        height:'90%',
        marginLeft:'42.5%',
        marginRight:'42.5%'
    },
    holderForLogo:{
        backgroundColor:'rgba(44, 44, 44, 0.486)',
        display:'flex',
        justifyContent:'center',
        width:'100%',
        height:'10%'
    }


})
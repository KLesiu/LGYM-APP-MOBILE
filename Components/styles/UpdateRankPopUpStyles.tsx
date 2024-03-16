import { StyleSheet } from "react-native";

export const UpdateRankPopUpStyles = StyleSheet.create({
    updateRankSection:{
        height:'100%',
        width:'100%',
        position:'absolute',
        top:0,
        backgroundColor:'rgba(0, 0, 0, 0.956)',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'

    },
    rankText:{
        color:'white',
        fontSize:30,
        textAlign:'center'
    },
    image:{
        width:250,
        height:250
    },
    closePopUp:{
        width:100,
        height:50,
        padding:5,
        position:'absolute',
        top:0,
        right:0,
        marginRight:10,
        borderColor:'white',
        borderWidth:1,
        borderStyle:'solid',
        borderRadius:10
    
    }
})
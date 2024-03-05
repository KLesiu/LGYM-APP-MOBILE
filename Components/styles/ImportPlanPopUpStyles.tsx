import { StyleSheet } from "react-native";

export const ImportPlanPopUpStyles = StyleSheet.create({
    importPlanPopUp:{
        position:'absolute',
        width:'100%',
        height:'100%',
        top:0,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0, 0, 0, 0.956)'
    },
    input:{
        borderRadius:10,
        height:'6%',
        fontSize:15,
        width:'80%',
        borderColor:'rgb(60,60,60)',
        borderWidth:2,
        marginTop:5,
        paddingLeft:15,
        color:'white'
    },
    h2:{
        color:'white',
        fontSize:20,
        textAlign:'center'
    },
    button:{
        width:'50%',
        height:'10%',
        borderRadius:10,
        backgroundColor: 'rgb(170,180,189)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:'5%'
    },
})
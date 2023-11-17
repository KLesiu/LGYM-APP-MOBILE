import { StyleSheet } from "react-native";

export const CreateConfigPlanStyles = StyleSheet.create({
    createConfigPlanSection:{
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,0.95)',
        position:'absolute',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        
    },
    input:{
        borderRadius:10,
        height:'8%',
        fontSize:15,
        width:'80%',
        borderColor:'rgb(60,60,60)',
        borderWidth:2,
        marginTop:5,
        marginBottom:'10%',
        paddingLeft:15,
        color:'white'
    },
    button:{
        width:'40%',
        height:'10%',
        borderColor:'grey',
        borderWidth:2,
        borderRadius:10,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
})
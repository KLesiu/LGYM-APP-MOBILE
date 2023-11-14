import { StyleSheet } from "react-native";

export const LoginStyles = StyleSheet.create({
    container:{
        display:'flex',
        alignItems:'center',
        flexDirection:'column',
        height:'100%',
        justifyContent:'flex-start',
        backgroundColor:'rgba(25,25,25,1)'
    },
    logo:{
        width:'60%',
        height:'30%'
    },
    label:{
        color:'rgb(185, 177, 162)',
        fontSize:30,
        margin:5

    },
    input:{
        borderRadius:10,
        height:'6%',
        fontSize:15,
        width:'80%',
        backgroundColor:'rgb(60,60,60)',
        marginTop:5,
        paddingLeft:15

    },
    buttonLogin:{
       marginTop:10,
       width:'50%',
       backgroundColor: 'rgb(134,134,134)',
       display:'flex',
       alignItems:'center',
       justifyContent:'center',
       borderRadius:10,
       height:'10%',
       
    },
    buttonLoginText:{
        fontSize:40,
        color:'rgb(226,226,226)'
    },
    errorContainer:{
        display:'flex',
        flexDirection:'column',
        textAlign:'center',
        width:'90%',
        
    },
    errorText:{
        color:'red',
        width:'100%',
        textAlign:'center',
        marginTop:'2%'
    }
})
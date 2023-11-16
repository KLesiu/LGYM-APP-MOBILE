import { StyleSheet } from "react-native";

export const HistoryStyles=StyleSheet.create({
    historyContainer:{
        borderTopStartRadius:10,
        borderTopEndRadius:10,
        backgroundColor:'rgba(255,255,255,0.97)',
        height:'99%',
        width:'100%',
        zIndex:2
    },
    background:{
        height:'79%',
        width:'98%',
        marginLeft:'1%',
        marginRight:'1%',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        opacity:1,
        resizeMode:'cover',
    },
    withoutTrainingContainer:{
        display:'flex',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    h1:{
        fontSize:40,
        textAlign:'center'
    },
    withoutTrainingText:{
        fontSize:20
    },
    session:{
        alignItems:'flex-start',
        borderWidth:3,
        borderColor:'grey',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        position:'relative',
        marginTop:'2%',
        padding:10,
        width:'90%',
        marginLeft:'5%',
        marginRight:'5%',
        borderRadius:10,
        marginBottom:'2%',
       
    },
    scrollView:{
        padding:5,
        display:'flex',
        flexDirection:'column',
        
    },
    buttonRead:{
        position:'absolute',
        right:'10%',
        top:'30%',
        
    }
})
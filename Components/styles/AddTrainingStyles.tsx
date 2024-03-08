import { StyleSheet } from "react-native";


export const AddTrainingStyles=StyleSheet.create({
    addTrainingContainer:{
        borderTopStartRadius:10,
        borderTopEndRadius:10,
        backgroundColor:'rgba(255,255,255,0.97)',
        height:'99%',
        width:'100%',
        zIndex:2,
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
    withoutTraining:{
        width:'100%',
        height:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        paddingTop:'40%'
    },
    addTrainingSection:{
        position:'relative',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        height:'100%',
        width:'100%'
    },
    chooseDaySection:{
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.94)',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        gap:10,
        height:'100%',
        position:'absolute',
        width:'100%',
        top:0
    },
    button:{
        alignItems: 'center',
        borderColor:'rgb(134,134,134)',
        borderWidth:1,
        borderRadius: 10,
        display: 'flex',
        fontSize:10,
        justifyContent: 'center',
        marginTop: 20,
        height: '10%',
        opacity: 1,
        width: '70%',
    },
    daySection:{
        position:'absolute',
        width:'100%',
        height:'100%',
        color:'white',
        backgroundColor:"rgba(0, 0, 0, 0.962)",
        display:'flex',
        flexDirection:'column',
        paddingBottom:40,
    },
    input:{
        borderRadius:10,
        fontSize:15,
        width:'20%',
        borderColor:'rgb(60,60,60)',
        borderWidth:2,
        color:'white',
        paddingLeft:10
    },
    exerciseDiv:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:'grey',
        borderBottomWidth:1,
        marginTop:5,
    },
    buttonsSection:{
        width:'100%',
        display:'flex',
        justifyContent:'center',
        flexDirection:'row',
        position:'absolute',
        alignItems:'center',
        bottom:0,
        gap:50,
        marginBottom:0
    },
    buttonAtAddTrainingConfig:{
        width:'30%',
        height:50,
        borderRadius:10,
        backgroundColor: 'rgb(170,180,189)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    popUp:{
        alignItems:'center',
        backgroundColor:'green',
        borderRadius:50,
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        width:'50%',
        height:'30%',
        top:'30%',
        position:'absolute'

    },
    lastSessionTrainingSection:{
        backgroundColor:'rgba(0,0,0,0.98)',
        position:'absolute',
        width:'100%',
        height:'100%',
        display:'flex',
        flexDirection:"column",
        zIndex:5,
    },
    lastSessionField:{
        width:'100%',
        borderBottomColor:'grey',
        borderBottomWidth:1,
        height:80,
        color:'white'
    },
    lastSessionDate:{
        fontSize:30,
        textAlign:'center',
        color:'white'
    },
    scrollViewLastSession:{
        width:'80%',
        marginLeft:'10%',
        height:'70%',
        
    },
    lastSessionScore:{
        width:'50%',
        borderBottomColor:'grey',
        borderBottomWidth:1,
        height:80,
        paddingLeft:'10%',
        backgroundColor:"rgba(20,20,20,0.7)",
        paddingTop:20,
        color:'white'
    },
    ViewLastSessionInsideScroll:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
    },
    containerForFieldsAtLastSession:{
        width:'60%',
    
    },
    containerForScoresAtLastSession:{
        width:'40%',
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
  
    }
})
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
        backgroundColor: 'rgb(134,134,134)',
        borderRadius: 10,
        display: 'flex',
        fontSize:10,
        justifyContent: 'center',
        marginTop: 20,
        height: '10%',
        opacity: 1,
        width: '70%',
    }
})
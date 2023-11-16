import { StyleSheet } from "react-native";

export const CurrentTrainingHistorySessionStyles = StyleSheet.create({
    currentTrainingHistorySession:{
        backgroundColor:'black',
        display:'flex',
        flexWrap:'wrap',
        height:'100%',
        width:'100%',
        position:'absolute',
        justifyContent:'center'
    },
    sessionTrainingContainer:{
        backgroundColor:'rgba(255, 255, 255, 0.349)',
        borderRadius:5,
        marginBottom:'2%',
        marginTop:'1%',
        height:'10%',
        color:'white',
        display:'flex',
        flexWrap:'wrap',
        flexDirection:'row',
        justifyContent:'center',
        width:'100%'
    },
    h3:{
        margin:5,
        width:'100%',
        fontSize:25,
        textAlign:'center'
    },
    date:{
        color:'white',
        margin:0,
        fontSize:25,
        height:'10%',
        width:'100%',
        textAlign:'center'
    },
    exerciseDiv:{
        alignItems:'center',
        display:'flex',
        justifyContent:'space-between',
        textAlign:'center',
        flexDirection:'row',
        minHeight:100,
        width:'50%',
        borderBottomWidth:1,
        borderBottomColor:'white',
        
    },
    exerciseDivSpan:{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection:'row',
        height: '100%',
        width: '100%',
        textAlign:'left'
    },
    exerciseDivSpanSpan:{
        color:'white',
        fontSize:30,
        width:'20%',
        textAlign:'right'
    },
    exerciseDivSpanP:{
        textAlign:'center',
        width:'75%',
        fontSize:18,
        height:'100%',
        paddingLeft:'5%',
        paddingRight:'5%',
        borderRightColor:'white',
        borderRightWidth:1,
        backgroundColor:'rgba(150,150,150,0.1)',
        borderRadius:10

        
    },
    sessionTrainingDiv:{
        display: 'flex',
        justifyContent: 'center',
        gap:100,
        flexDirection:'row',
        marginLeft: '50%',
        width: '50%',
        paddingLeft: '15%',
        marginRight: '23%',
        fontSize: 12
    },
    container:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        flexWrap:'wrap'
    },
    exerciseDivSpanSpanWeight:{
        width:'100%',
        fontSize:30
    }
    
})
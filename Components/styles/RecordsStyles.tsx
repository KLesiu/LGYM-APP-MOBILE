import { StyleSheet } from "react-native";


export const RecordsStyles=StyleSheet.create({
    recordsContainer:{
        borderTopStartRadius:10,
        borderTopEndRadius:10,
        backgroundColor:'rgba(255,255,255,0.97)',
        height:'99%',
        width:'100%',
        zIndex:2,
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'center'
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
    titleh2:{
        borderBottomColor:'white',
        borderBottomWidth:2,
        paddingBottom:2,
        textAlign:'center',
        width:'70%',
        fontSize:25
    },
    titleOfLift:{
        alignItems:'center',
        width:'100%',
        backgroundColor:'rgb(184,186,189)',
        marginTop:'5%',
        display:'flex',
        justifyContent:'center',
        flexDirection:'row'

    },
    lift:{
        marginLeft:'1%',
        fontSize:20,
        
    },
    icon:{
      
      width:'7%',
      height:'70%',
      marginBottom:'1%'
    },
    span:{
        width:'100%',
        textAlign:'center',
        fontSize:40
    },
    total:{
        width:'70%',
        fontSize:25,
        borderBottomColor:'white',
        borderBottomWidth:2,
        textAlign:'center'
    },
    buttonUpdateRecords:{
        width:'60%',
        height:'10%',
        marginTop:'15%',
        borderRadius:10,
        backgroundColor: 'rgb(170,180,189)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        fontSize:25
    }
})
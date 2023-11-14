import { StyleSheet } from "react-native";

export const TrainingPlanStyles = StyleSheet.create({
    sectionPlan:{
        height:'99%',
        position:'relative',
        width:'100%'
        
    },
    withoutPlanContainer:{
        alignItems:'center',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        height:'100%',
        width:'100%',
        backgroundColor:'rgba(255,255,255,0.97)',
        borderTopStartRadius:10,
        borderTopEndRadius:10,
    },
    backgroundIMG:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        opacity:1,
        resizeMode:'cover',
        width:'98%',
        marginLeft:'1%',
        marginRight:'1%',
        height:'79%',
    },
    withoutPlanText:{
        fontSize:30,
        textAlign:'center'
    },
    withoutPlanButton:{
        backgroundColor: 'rgb(194,194,194)',
        width:'50%',
        height:'10%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginTop:'5%'
    },
    withoutPlanButtonText:{
        fontSize:20,
        width:'100%',
        textAlign:'center'
    }
})
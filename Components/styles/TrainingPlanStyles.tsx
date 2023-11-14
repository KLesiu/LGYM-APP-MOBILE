import { StyleSheet } from "react-native";

export const TrainingPlanStyles = StyleSheet.create({
    sectionPlan:{
        height:'80%',
        position:'relative',
        
    },
    withoutPlanContainer:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        height:'100%',
        width:'100%',
        backgroundColor:'rgba(255,255,255,0.9)',
        borderRadius:10,
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
        height:'100%'
    },
})
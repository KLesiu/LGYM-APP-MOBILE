import { StyleSheet } from "react-native";


export const ProfileStyles=StyleSheet.create({
    profileContainer:{
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
    }
})
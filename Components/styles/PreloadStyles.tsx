import { StyleSheet } from "react-native";

export const PreloadStyles = StyleSheet.create({
    logoLGYMAPP:{
        width:'70%',
        height:'40%'
    },
    preLoadDiv:{
        backgroundColor: 'rgba(92, 92, 92,0.9)',
        height:'100%',
        width:'100%',

    },
    backgroundIMG:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        opacity:1,
        resizeMode:'cover'
    },
    preLoadContainer:{
        flex:1,
        alignItems:'center',
        backgroundColor: 'rgba(0, 0, 0, 0.897)',
        justifyContent: 'space-around',
    }
})
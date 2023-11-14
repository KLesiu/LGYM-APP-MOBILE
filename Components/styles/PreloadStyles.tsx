import { StyleSheet } from "react-native";


export const PreloadStyles = StyleSheet.create({
    logoLGYMAPP:{
        width:'70%',
        height:'40%'
    },
    preLoadDiv:{
        backgroundColor: 'rgba(92, 92, 92,0.7)',
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
        justifyContent: 'center',
        gap:20
    },
    login:{
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
    },
    register:{
        alignItems: 'center',
        backgroundColor: 'rgb(134,134,134)',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        height: '10%',
        opacity: 1,
        width: '70%',
    },
    loginText:{
        color: 'rgb(226,226,226)',
        fontSize: 35,
        textDecorationLine: 'none',
        textShadowColor: 'rgb(0, 0, 0)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        letterSpacing: 4,  
    },
    registerText:{
        color: 'rgb(226,226,226)',
        fontSize: 35,
        textDecorationLine: 'none',
        textShadowColor: 'rgb(0, 0, 0)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        letterSpacing: 4,  
    },
    quote:{
        textAlign:'center',
        width:'90%',
        color:'white'
    }
})
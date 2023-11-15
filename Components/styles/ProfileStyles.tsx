import { StyleSheet } from "react-native";


export const ProfileStyles=StyleSheet.create({
    profileContainer:{
        borderTopStartRadius:10,
        borderTopEndRadius:10,
        backgroundColor:'rgba(255,255,255,0.95)',
        height:'99%',
        width:'100%',
        display:'flex',
        flexDirection:'column',
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
    h1:{
        borderRadius: 20,
        margin: 0,
        fontSize:40,
        width:'100%',
        textAlign:'center'
    },
    h2:{
        padding:5,
        borderColor:'grey',
        borderWidth:2,
        width:'70%',
        borderRadius:3,
        fontSize:25,
        marginBottom:40
    },
    containerForInfoProfile:{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
        height: '60%'
    },
    columnProfile:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        height:'100%',
        alignItems:'center'
    },
    profileRankContainer:{
        alignItems:'flex-start',
        display:'flex',
        width:'70%',
        justifyContent:'flex-start',
        flexDirection:'column',
        flexWrap:'wrap',
        backgroundColor:'rgba(49,49,49,0.7)',
        borderRadius:3,
        paddingLeft:5,
        height:'40%'
    },
    h3:{
        padding:5,
        borderColor:'grey',
        borderWidth:2,
        width:'70%',
        borderRadius:3,
        fontSize:20,
        marginTop:20
    },
    logoutButton:{
        width:'50%',
        height:'10%',
        backgroundColor:'rgba(189,18,18,.884)',
        borderColor:'black',
        borderWidth:1,
        borderRadius:10,
        display:'flex',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        marginLeft:'25%',
        marginTop:'15%'
    }
})
import { Text,Image,View,ImageBackground,TouchableOpacity, ScrollView,Alert,TextInput } from "react-native";
import CreatePlanProps from "./props/CreateConfigPlanProps";
import { useState,useEffect } from "react";
import { useFonts,Teko_400Regular,Teko_700Bold } from "@expo-google-fonts/teko";
import * as SplashScreen from 'expo-splash-screen'
import { CreateConfigPlanStyles } from "./styles/CreateConfigPlanStyles";


const CreateConfigPlan:React.FC<CreatePlanProps> =(props)=>{
    const [name,setName]=useState<string>()
    const [days,setDays]=useState<string>()
    const [error,setErrors]=useState<String[]>()
    const [fontsLoaded]=useFonts({
        Teko_700Bold,
        Teko_400Regular
    })
    useEffect(() => {
        const loadAsyncResources = async () => {
          try {
            SplashScreen.preventAutoHideAsync();
            await fontsLoaded;
            SplashScreen.hideAsync();
          } catch (error) {
            console.error('Błąd ładowania zasobów:', error);
          }
        };
    
        loadAsyncResources();
      }, [fontsLoaded]);
    const sendDaysAndName=()=>{
        if(!name || !days) return setErrors(['All fields are required'])
        if(parseInt(days)>1 || parseInt(days) < 7){
            props.setDayAndName!(name!,days!)
        }
        else return setErrors(['In second field you have to type number from 1-7'])  
        
    }
    if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
        <View style={CreateConfigPlanStyles.createConfigPlanSection}>
            <Text style={{fontFamily:'Teko_700Bold',fontSize:40,marginBottom:'20%',color:'rgb(200,200,200)'}}>Plan Config</Text>
            <Text style={{fontFamily:'Teko_700Bold',fontSize:30,color:'rgb(200,200,200)'}}>Plan name:</Text>
            <TextInput placeholder="FBW" style={CreateConfigPlanStyles.input} onChangeText={(text:string)=>setName(text)}/>
            <Text style={{fontFamily:'Teko_700Bold',fontSize:25,textAlign:'center',width:'80%',color:'rgb(200,200,200)'}}>How many days per week do you want to train?</Text>
            <TextInput placeholder="1-7" style={CreateConfigPlanStyles.input} onChangeText={(text:string)=>setDays(text)}/>
            <TouchableOpacity style={CreateConfigPlanStyles.button} onPress={sendDaysAndName}>
                <Text style={{fontFamily:'Teko_700Bold',fontSize:30,color:'rgb(200,200,200)'}}>NEXT</Text>
            </TouchableOpacity>
            {error?error.map((ele,index:number)=><Text style={{color:'red',marginTop:10,fontFamily:'Teko_400Regular',fontSize:20}} key={index}>{ele}</Text>):''}
        </View>
    )
}
export default CreateConfigPlan
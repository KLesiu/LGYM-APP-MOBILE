import { Text,Image,View,ImageBackground,TouchableOpacity, ScrollView,Alert,TextInput } from "react-native";
import CreatePlanProps from "./props/CreateConfigPlanProps";
import { useState,useEffect } from "react";
import { useFonts,Teko_400Regular,Teko_700Bold } from "@expo-google-fonts/teko";
import * as SplashScreen from 'expo-splash-screen'
import { CreateConfigPlanStyles } from "./styles/CreateConfigPlanStyles";


const CreateConfigPlan:React.FC<CreatePlanProps> =(props)=>{
    const [name,setName]=useState<string>()
    const [days,setDays]=useState<string>()
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
        console.log(name,days)
        // props.setDayAndName!(name!,days!)
    }
    if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
        <View style={CreateConfigPlanStyles.createConfigPlanSection}>
            <Text style={{fontFamily:'Teko_700Bold'}}>Plan name:</Text>
            <TextInput onChangeText={(text:string)=>setName(text)}/>
            <Text style={{fontFamily:'Teko_700Bold'}}>How many days per week do you want to train?</Text>
            <TextInput onChangeText={(text:string)=>setDays(text)}/>
            <TouchableOpacity onPress={sendDaysAndName}>
                <Text style={{fontFamily:'Teko_700Bold'}}>NEXT</Text>
            </TouchableOpacity>
        </View>
    )
}
export default CreateConfigPlan
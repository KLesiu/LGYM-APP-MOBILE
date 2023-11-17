import { Text,Image,View,ImageBackground,TouchableOpacity, ScrollView,Alert, TextInput } from "react-native";
import { CreateCurrentDayPlanStyles } from "./styles/CreateCurrentDayPlanStyles";
import CreateCurrentDayProps from "./props/CreateCurrentDayPlanProps";
import {useState,useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts,Teko_700Bold,Teko_400Regular } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
const CreateCurrentDayPlan:React.FC<CreateCurrentDayProps> =(props)=>{
    const [elements,setElements]=useState<Array<JSX.Element>>()
    const [countElements,setCountElements]=useState<number>(0)
    const [fontsLoaded]=useFonts({
        Teko_700Bold,
        Caveat_400Regular,
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
    useEffect(()=>{
        addElements(props.day)
    },[countElements])
    const removeElement=()=>{
        const newElements = elements?.slice(1)
        setElements(newElements)
        setCountElements(countElements-1)
     }
    const addElements=(day:string):void=>{
        const Element:JSX.Element = <View style={CreateCurrentDayPlanStyles.exerciseHolder}>
            <TextInput style={CreateCurrentDayPlanStyles.input} placeholder='Exercise name'/>
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series'  />
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Repetitions interval'  />

            
        </View>
        const arr:Array<JSX.Element> = []
        if(day === 'planA'){
            if(props.planA) props.planA.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder} >
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
            <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
            
            </View>))
        }
        else if(day === 'planB'){
            if(props.planB) props.planB.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
       <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
       <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
       </View>))
        }
        else if(day === 'planC'){
            if(props.planC) props.planC.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
       <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
       <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
       </View>))
        }
        else if(day === 'planD'){
            if(props.planD) props.planD.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
       <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
       <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
       </View>))
        }
        else if(day === 'planE'){
            if(props.planE) props.planE.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
       <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
       <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
       </View>))
        }
        else if(day === 'planF'){
            if(props.planF) props.planF.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
       <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
       <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
       </View>))
        }
        else if(day === 'planG'){
            if(props.planG) props.planG.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
            <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
       <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
       <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
       </View>))
        }      
        for(let i=0;i<countElements;i++)arr.push(Element)
        setElements(arr)
        
    }
    if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
        <View style={CreateCurrentDayPlanStyles.createCurrentDay}>
            <Text style={{fontFamily:'Teko_700Bold',...CreateCurrentDayPlanStyles.h2}}>{props.day}</Text>
            {elements?.map(ele=>ele)}
            <TouchableOpacity onPress={()=>{
                removeElement()
            }} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Icon name="delete" style={{fontSize:30,...CreateCurrentDayPlanStyles.delete}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setCountElements(countElements+1)}>
                <Icon style={{fontSize:30,...CreateCurrentDayPlanStyles.plus}} name="plus" />
            </TouchableOpacity>

            <TouchableOpacity style={CreateCurrentDayPlanStyles.readyButton}>
                <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>READY!</Text>
            </TouchableOpacity>
        </View>
    )
}
export default CreateCurrentDayPlan
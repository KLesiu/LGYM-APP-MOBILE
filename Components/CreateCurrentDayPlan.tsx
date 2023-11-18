import { Text,Image,View,ImageBackground,TouchableOpacity, ScrollView,Alert, TextInput } from "react-native";
import { CreateCurrentDayPlanStyles } from "./styles/CreateCurrentDayPlanStyles";
import CreateCurrentDayProps from "./props/CreateCurrentDayPlanProps";
import {useState,useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts,Teko_700Bold,Teko_400Regular } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import Exercise from "./types/Exercise";
const CreateCurrentDayPlan:React.FC<CreateCurrentDayProps> =(props)=>{
    const [elements,setElements]=useState<Array<JSX.Element>>()
    const [countElements,setCountElements]=useState<number>(0)
    const [canAdd,setCanAdd]=useState<boolean>(true)
    const [name,setName]= useState<string>()
    const [series,setSeries]=useState<number>()
    const [reps,setReps]=useState<string>()
    const [objects,setObjects]=useState<Exercise[]>()
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
        if(countElements===0) return
        setCountElements(countElements-1)
     }
    const addElements=(day:string):void=>{

        if(!canAdd) return
        setCanAdd(false)
        const Element:JSX.Element = <View style={CreateCurrentDayPlanStyles.exerciseHolder}>
            <TextInput onChangeText={(text)=>setName(text)}  style={CreateCurrentDayPlanStyles.input} placeholder='Exercise name'/>
            <TextInput onChangeText={(text)=>setSeries(parseInt(text))}  style={CreateCurrentDayPlanStyles.input}  placeholder='Series'  />
            <TextInput onChangeText={(text)=>setReps(text)}  style={CreateCurrentDayPlanStyles.input}  placeholder='Repetitions interval'  />

            
        </View>
        const arr:Array<JSX.Element> = []
    //     if(day === 'planA'){
    //         if(props.planA) props.planA.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder} >
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
            
    //         </View>))
    //     }
    //     else if(day === 'planB'){
    //         if(props.planB) props.planB.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
    //    </View>))
    //     }
    //     else if(day === 'planC'){
    //         if(props.planC) props.planC.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
    //    </View>))
    //     }
    //     else if(day === 'planD'){
    //         if(props.planD) props.planD.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
    //    </View>))
    //     }
    //     else if(day === 'planE'){
    //         if(props.planE) props.planE.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
    //    </View>))
    //     }
    //     else if(day === 'planF'){
    //         if(props.planF) props.planF.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
    //    </View>))
    //     }
    //     else if(day === 'planG'){
    //         if(props.planG) props.planG.map(ele=>arr.push(<View style={CreateCurrentDayPlanStyles.exerciseHolder}  >
    //         <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Exercise name'   defaultValue={ele.name} />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  placeholder='Series' defaultValue={`${ele.series}`}  />
    //    <TextInput style={CreateCurrentDayPlanStyles.input}  defaultValue={ele.reps} placeholder='Repetitions interval'  />
       
    //    </View>))
    //     }      
        for(let i=0;i<countElements;i++)arr.push(Element)
        setElements(arr)
        
    }
    const setCurrentPlanDay=(day:string,obj:Exercise)=>{
        console.log(day,obj)
       
    }
    
    if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
        <View style={CreateCurrentDayPlanStyles.createCurrentDay}>
            <Text style={{fontFamily:'Teko_700Bold',...CreateCurrentDayPlanStyles.h2}}>{props.day}</Text>
            {objects?.map(ele=><View style={{width:'100%',backgroundColor:'red'}}>
               <Text>Name: {ele.name}</Text>
               <Text>Series: {ele.series}</Text>
               <Text>Reps: {ele.reps}</Text>
            </View>)}
            {elements?.map(ele=>ele)}
            <View style={{display:'flex',flexDirection:'row',width:'90%',justifyContent:'space-between',marginTop:'5%'}}>
            
            <TouchableOpacity style={{width:'15%'}} onPress={()=>setCountElements(countElements+1)}>
                <Icon style={{fontSize:30}} name="plus" />
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{
                removeElement()
            }} style={{display:'flex',justifyContent:'center',alignItems:'center',width:'15%',}}>
                <Icon name="delete" style={{fontSize:30,...CreateCurrentDayPlanStyles.delete}} />
            </TouchableOpacity>
            </View>
            

            <TouchableOpacity onPress={()=>props.setCurrentPlanDay(props.day,elements)} style={CreateCurrentDayPlanStyles.readyButton}>
                <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>READY!</Text>
            </TouchableOpacity>
        </View>
    )
}
export default CreateCurrentDayPlan
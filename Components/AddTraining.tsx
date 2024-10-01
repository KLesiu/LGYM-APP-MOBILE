import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { useState, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Exercise from "./types/Exercise";
import Data from "./types/DataPlansArrays";
import LastTrainingSession from "./types/LastTrainingSession";
import ExerciseTraining from "./types/ExerciseTraining";
import addTrainingFetchType from "./types/AddTrainingFetchAnsw";
import SuccessMsg from "./types/SuccessMsg";
import ViewLoading from "./ViewLoading";
import MiniLoading from "./MiniLoading";
import useInterval from "./helpers/hooks/useInterval";
import UpdateRankPopUp from "./UpdateRankPopUp";
import { LastTrainingModel } from "./types/Training";
import TrainingPlanDay from "./TrainingPlanDay";
import AddTrainingProps from "./props/AddTrainingProps";
type InputAction = {
  type: "UPDATE_INPUT";
  index: number;
  value: string;
};

type InputState = Record<number, string>;

const inputReducer = (state: InputState, action: InputAction): InputState => {
  switch (action.type) {
    case "UPDATE_INPUT":
      return {
        ...state,
        [action.index]: action.value,
      };
    default:
      return state;
  }
};

const AddTraining: React.FC<AddTrainingProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [isTrainingPlanDayVisible, setIsTrainingPlanDayVisible] =useState(false)
  const [dayId,setDayId] = useState<string>()


  const [plan, setPlan] = useState<string | null | undefined>("");
  const [chooseDay, setChooseDay] = useState<JSX.Element>(<View></View>);
  const [daySection, setDaySection] = useState<JSX.Element>(<View></View>);
  const [dayToCheck, setDayToCheck] = useState<string>();
  const [pickedDay, setPickedDay] = useState<Array<Exercise>>();
  const [lastTrainingSessionDate, setLastTrainingSessionDate] =
    useState<string>();
  const [lastTrainingSessionExercises, setLastTrainingSessionExercises] =
    useState<Array<ExerciseTraining>>();
  const [showExercise, setShowExercise] = useState<boolean>();
  const [fieldsArray, setFieldsArray] = useState<String[]>();
  const [isPopUpShowed, setIsPopUpShowed] = useState<boolean>(false);
  const [inputValues, dispatch] = useReducer(inputReducer, {});
  const [inputWeightValues, dispatchWeight] = useReducer(inputReducer, {});
  const [lastTrainingSection, setLastTrainingSection] = useState<JSX.Element>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddTrainingActive, setIsAddTrainingActive] =
    useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isPopUpRankShowed,setIsPopUpRankShowed] = useState<boolean>(false)

  // Second
  const [inputValuesSecond, dispatchSecond] = useReducer(inputReducer, {});
  const [inputWeightValuesSecond, dispatchWeightSecond] = useReducer(
    inputReducer,
    {}
  );

  // Third
  const [inputValuesThird, dispatchThird] = useReducer(inputReducer, {});
  const [inputWeightValuesThird, dispatchWeightThird] = useReducer(
    inputReducer,
    {}
  );

  // Fourth
  const [inputValuesFourth, dispatchFourth] = useReducer(inputReducer, {});
  const [inputWeightValuesFourth, dispatchWeightFourth] = useReducer(
    inputReducer,
    {}
  );

  // Fifth
  const [inputValuesFifth, dispatchFifth] = useReducer(inputReducer, {});
  const [inputWeightValuesFifth, dispatchWeightFifth] = useReducer(
    inputReducer,
    {}
  );

  // Sixth
  const [inputValuesSixth, dispatchSixth] = useReducer(inputReducer, {});
  const [inputWeightValuesSixth, dispatchWeightSixth] = useReducer(
    inputReducer,
    {}
  );

  // Seventh
  const [inputValuesSeventh, dispatchSeventh] = useReducer(inputReducer, {});
  const [inputWeightValuesSeventh, dispatchWeightSeventh] = useReducer(
    inputReducer,
    {}
  );

  // Eighth
  const [inputValuesEighth, dispatchEighth] = useReducer(inputReducer, {});
  const [inputWeightValuesEighth, dispatchWeightEighth] = useReducer(
    inputReducer,
    {}
  );

  // Ninth
  const [inputValuesNinth, dispatchNinth] = useReducer(inputReducer, {});
  const [inputWeightValuesNinth, dispatchWeightNinth] = useReducer(
    inputReducer,
    {}
  );

  // Tenth
  const [inputValuesTenth, dispatchTenth] = useReducer(inputReducer, {});
  const [inputWeightValuesTenth, dispatchWeightTenth] = useReducer(
    inputReducer,
    {}
  );

  // Eleventh
  const [inputValuesEleventh, dispatchEleventh] = useReducer(inputReducer, {});
  const [inputWeightValuesEleventh, dispatchWeightEleventh] = useReducer(
    inputReducer,
    {}
  );

  // Twelfth
  const [inputValuesTwelfth, dispatchTwelfth] = useReducer(inputReducer, {});
  const [inputWeightValuesTwelfth, dispatchWeightTwelfth] = useReducer(
    inputReducer,
    {}
  );

  // Thirteenth
  const [inputValuesThirteenth, dispatchThirteenth] = useReducer(
    inputReducer,
    {}
  );
  const [inputWeightValuesThirteenth, dispatchWeightThirteenth] = useReducer(
    inputReducer,
    {}
  );

  // Fourteenth
  const [inputValuesFourteenth, dispatchFourteenth] = useReducer(
    inputReducer,
    {}
  );
  const [inputWeightValuesFourteenth, dispatchWeightFourteenth] = useReducer(
    inputReducer,
    {}
  );

  // Fifteenth
  const [inputValuesFifteenth, dispatchFifteenth] = useReducer(
    inputReducer,
    {}
  );
  const [inputWeightValuesFifteenth, dispatchWeightFifteenth] = useReducer(
    inputReducer,
    {}
  );

  // Sixteenth
  const [inputValuesSixteenth, dispatchSixteenth] = useReducer(
    inputReducer,
    {}
  );
  const [inputWeightValuesSixteenth, dispatchWeightSixteenth] = useReducer(
    inputReducer,
    {}
  );

  // Seventeenth
  const [inputValuesSeventeenth, dispatchSeventeenth] = useReducer(
    inputReducer,
    {}
  );
  const [inputWeightValuesSeventeenth, dispatchWeightSeventeenth] = useReducer(
    inputReducer,
    {}
  );

  // Eighteenth
  const [inputValuesEighteenth, dispatchEighteenth] = useReducer(
    inputReducer,
    {}
  );
  const [inputWeightValuesEighteenth, dispatchWeightEighteenth] = useReducer(
    inputReducer,
    {}
  );

  // Nineteenth
  const [inputValuesNineteenth, dispatchNineteenth] = useReducer(
    inputReducer,
    {}
  );
  const [inputWeightValuesNineteenth, dispatchWeightNineteenth] = useReducer(
    inputReducer,
    {}
  );


  useInterval(() => {
    if(!showExercise) return
    submitYourTraining(false);
  }, 1000);
  useEffect(() => {
    setViewLoading(true);
    getFromStorage();
    getSessionFromStorage();
    setViewLoading(false)
  }, []);
  const getSessionFromStorage = async () => {
    const training = await AsyncStorage.getItem("currentTraining");
    const parsedTraining = JSON.parse(training as string);
    showDaySection(parsedTraining.day, true);
  };
  const getFromStorage = async (): Promise<void> => {
    const plan: string | null | undefined =
      (await AsyncStorage.getItem("plan")) || "";
    setPlan(plan);
    setViewLoading(false);
  };
  const getInformationsAboutPlanDays: VoidFunction =
    async (): Promise<void> => {
      setLoading(true);
      const id = await AsyncStorage.getItem("id");
      const trainingTypes = await fetch(
        `${apiURL}/api/planDay/${id}/getPlanDaysTypes`
      )
        .then((res) => res.json())
        .catch((err) => err)
    

      setChooseDay(
        <View className="items-center bg-[#131313] flex flex-col justify-start gap-y-5  h-full absolute m-0 w-full top-0">
          <Text
          className="text-3xl text-white"
            style={{ fontFamily: "OpenSans_700Bold"}}
          >
            Choose training day!
          </Text>
          {trainingTypes.map((ele:{_id:string,name:string}) => (
            <TouchableOpacity
              onPress={() => showDaySection(ele._id, false)}
              className="items-center border-[#868686] border-[1px] rounded-xl flex text-[10px] justify-center mt-5 h-[10%] opacity-100 w-[70%]"
              key={ele._id}
            >
              <Text
              className="text-white text-3xl"
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                {ele.name}
              </Text>
            </TouchableOpacity>
          ))}
          {loading ? <MiniLoading /> :<Text></Text>}
        </View>
      );
      setLoading(false);
    };
  const resetChoosePlanDay=()=>{
    setChooseDay(<></>)
  }
  const showDaySection = async (
    day: string,
    session: boolean
  ): Promise<void> => {
    setViewLoading(true);

    setIsAddTrainingActive(true)
    setDayId(day)
    setViewLoading(false)
    props.hideMenuButton()





    // const id = await AsyncStorage.getItem("id");
    // const planOfTheDay: Array<Exercise> | undefined = await fetch(
    //   `https://lgym-app-api-v2.vercel.app/api/${id}/getPlan`
    // )
    //   .then((res) => res.json())
    //   .catch((err) => err)
    //   .then((res) => {
    //     const data: Data = res.data;
    //     if (day === "A") return data.planA;
    //     else if (day === "B") return data.planB;
    //     else if (day === "C") return data.planC;
    //     else if (day === "D") return data.planD;
    //     else if (day === "E") return data.planE;
    //     else if (day === "F") return data.planF;
    //     else if (day === "G") return data.planG;
    //   });
    // session
    //   ? setCurrentDaySectionFromSession(planOfTheDay!, day)
    //   : setCurrentDaySection(planOfTheDay!, day);
    // setDayToCheck(day);
    // setChooseDay(<View></View>);
    // setPickedDay(planOfTheDay);
    // setViewLoading(false)
  };
  const setCurrentDaySection = async (
    exercises: Array<Exercise>,
    day: string
  ): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: { prevSession: LastTrainingSession } | null = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/getPrevSessionTraining/${day}`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    let lastTraining: string;
    let lastExercises: Array<ExerciseTraining>;
    let lastTrainingCompletedArray:Array<LastTrainingModel>=[];
    if ("prevSession" in response!) {
      lastTraining = response.prevSession.createdAt.slice(0, 24);
      lastExercises = response.prevSession.exercises.map((ele) => ele);
      const sessionTrainingReps = lastExercises.filter(
        (ele: any, index: number) => index % 2 === 0
      );
      const sessionTrainingWeight = lastExercises.filter(
        (ele: any, index: number) => index % 2 !== 0
      );
       lastTrainingCompletedArray = exercises.map((ele) => {
        const prevReps = sessionTrainingReps.slice(0, ele.series);
        sessionTrainingReps.splice(0, ele.series);
        const prevWeights = sessionTrainingWeight.slice(0, ele.series);
        sessionTrainingWeight.splice(0, ele.series);
        return {
          name: ele.name,
          reps: ele.reps,
          series: ele.series,
          prevReps: prevReps,
          prevWeights: prevWeights,
        };
      });
      
    }
    let arr: String[] = [];

    setDaySection(
      <View className="absolute w-full h-full text-white bg-[#000000f5] flex flex-col pb-10">
        <Text
          style={{
            fontFamily: "OpenSans_700Bold",
            width: "100%",
            textAlign: "center",
            fontSize: 30,
            color: "white",
          }}
        >
          Training <Text>{day}</Text>
        </Text>
        <ScrollView>
          {exercises.map((ele: Exercise, indexMain: number) => {
            const helpsArray: Array<string> = [];
            for (let i = 1; i < +ele.series + 1; i++) {
              helpsArray.push(`Series: ${i}`);
            }
            return (
              <View style={{ marginBottom: 50 }} key={indexMain}>
                <View className="flex flex-col mb-7 pl-1">
                <Text
                 className='text-md text-[#4CD964] '
                  style={{
                    fontFamily: "OpenSans_700Bold",
                  }}
                >
                  {ele.name}
                </Text>
                {lastTrainingCompletedArray.length > 0?<Text className="text-gray-300 text-[12px] mt-2 " style={{fontFamily:'OpenSans_300Light'}}>
                  Last Training scores:
                {lastTrainingCompletedArray[indexMain].prevReps.map((ele:ExerciseTraining,index:number)=>{
                    return(
                      ` ${ele.score}x${lastTrainingCompletedArray[indexMain].prevWeights[index].score}kg `
                    )
                  })}</Text>:<Text></Text>}
                </View>

                {helpsArray.map((s, index: number) => {
                  arr.push(`${ele.name} ${s}: Rep`);
                  arr.push(`${ele.name} ${s}: Weight (kg)`);
                  return (
                    <View className="flex flex-row justify-center items-center border-b-gray-500 border-b-1 mt-1"  key={index}>
                      <Text
                      className="text-[11px] w-1/5 text-white"
                        style={{
                          fontFamily: "OpenSans_400Regular",
                        }}
                      >
                      {s}: Rep
                      </Text>
                      <TextInput
                        defaultValue="0"
                        onLayout={() =>
                          handleInputChange(index, "0", indexMain)
                        }
                        onChangeText={(text) =>
                          handleInputChange(index, text, indexMain)
                        
                        }
                        className="rounded-xl text-sm w-[20%] border-[#3c3c3c] border-[2px] text-white pl-2"
                       
                      />
                      <Text
                       className="text-[11px] w-1/5 ml-[10%] text-white"
                        style={{
                          fontFamily: "OpenSans_400Regular",
                        }}
                      >
                        {s}: Weight (kg)
                      </Text>
                      <TextInput
                        defaultValue="0"
                        onLayout={() =>
                          handleInputWeightChange(index, "0", indexMain)
                        }

                        onChangeText={(text) =>
                          handleInputWeightChange(index, text, indexMain)
                        }
                        className="rounded-xl text-[15px] w-[20%] border-[#3c3c3c] border-[2px] text-white pl-2 border-b-gray-500 border-b-2"
                       
                      />
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
    setLastTrainingSessionDate(lastTraining!);
    setLastTrainingSessionExercises(lastExercises!);
    setShowExercise(true);
    setFieldsArray(arr);
    setViewLoading(false);
  };
  const setCurrentDaySectionFromSession = async (
    exercises: Array<Exercise>,
    day: string
  ): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: { prevSession: LastTrainingSession } | null = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/getPrevSessionTraining/${day}`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    let lastTraining: string;
    let lastExercises: Array<ExerciseTraining>;
    let lastTrainingCompletedArray:Array<LastTrainingModel>=[];
    if ("prevSession" in response!) {
      lastTraining = response.prevSession.createdAt.slice(0, 24);
      lastExercises = response.prevSession.exercises.map((ele) => ele);
      const sessionTrainingReps = lastExercises.filter(
        (ele: any, index: number) => index % 2 === 0
      );
      const sessionTrainingWeight = lastExercises.filter(
        (ele: any, index: number) => index % 2 !== 0
      );
       lastTrainingCompletedArray = exercises.map((ele) => {
        const prevReps = sessionTrainingReps.slice(0, ele.series);
        sessionTrainingReps.splice(0, ele.series);
        const prevWeights = sessionTrainingWeight.slice(0, ele.series);
        sessionTrainingWeight.splice(0, ele.series);
        return {
          name: ele.name,
          reps: ele.reps,
          series: ele.series,
          prevReps: prevReps,
          prevWeights: prevWeights,
        };
      });
    }
    let arr: String[] = [];
    const sessionTraining = await AsyncStorage.getItem("currentTraining");
    const parsedSessionTraining = JSON.parse(
      sessionTraining as string
    ).training;
    const sessionTrainingReps = parsedSessionTraining.filter(
      (ele: any, index: number) => index % 2 === 0
    );
    const sessionTrainingWeight = parsedSessionTraining.filter(
      (ele: any, index: number) => index % 2 !== 0
    );
    const newHelpsArray = exercises.map((ele) => {
      const prevReps = sessionTrainingReps.slice(0, ele.series);
      sessionTrainingReps.splice(0, ele.series);
      const prevWeights = sessionTrainingWeight.slice(0, ele.series);
      sessionTrainingWeight.splice(0, ele.series);
      return {
        name: ele.name,
        reps: ele.reps,
        series: ele.series,
        prevReps: prevReps,
        prevWeights: prevWeights,
      };
    });
    setDaySection(
      <View className="absolute w-full h-full text-white bg-[#131313] flex-col flex p-4 pb-10">
        <Text
        className="w-full text-3xl text-center text-white"
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
        >
          Training <Text className="text-[#4CD964]">{day}</Text>
        </Text>
        <ScrollView>
          {newHelpsArray.map((ele: any, indexMain: number) => {
            let helpsArray: Array<string> = [];
            for (let i = 1; i < +ele.series + 1; i++) {
              helpsArray.push(`Series: ${i}`);
            }
            return (
              <View style={{ marginBottom: 50 }} key={indexMain}>
                <View className="flex flex-col mb-7 pl-1">
                <Text
                 className='text-md text-[#4CD964] '
                  style={{
                    fontFamily: "OpenSans_700Bold",
                  }}
                >
                  {ele.name}
                </Text>
                {lastTrainingCompletedArray.length > 0?<Text className="text-gray-300 text-[12px] mt-2 " style={{fontFamily:'OpenSans_300Light'}}>
                  Last Training scores:
                {lastTrainingCompletedArray[indexMain].prevReps.map((ele:ExerciseTraining,index:number)=>{
                    return(
                      ` ${ele.score}x${lastTrainingCompletedArray[indexMain].prevWeights[index].score}kg `
                    )
                  })}</Text>:<Text></Text>}

                </View>

                {helpsArray.map((s, index: number) => {
                  arr.push(`${ele.name} ${s}: Rep`);
                  arr.push(`${ele.name} ${s}: Weight (kg)`);
                  return (
                    <View className="flex flex-row justify-center items-center border-b-gray-500 border-b-1 mt-1"key={index}>
                      <Text
                      className="text-[11px] w-1/5 text-white"
                        style={{
                          fontFamily: "OpenSans_400Regular",
                        }}
                      >
                         {s}: Rep
                      </Text>
                      <TextInput
                        defaultValue={ele.prevReps[index].score}
                        onLayout={() =>
                          handleInputChange(
                            index,
                            ele.prevReps[index].score,
                            indexMain
                          )
                        }
                        
                        onChangeText={(text) =>
                          handleInputChange(index, text, indexMain)
                        }
                        className="rounded-xl text-sm w-[20%] border-[#3c3c3c] border-[2px] text-white pl-2"
                      />
                      <Text
                      className="text-[11px] w-1/5 ml-[10%] text-white"
                        style={{
                          fontFamily: "OpenSans_400Regular",
                        }}
                      >
                  {s}: Weight
                      </Text>
                      <TextInput
                        defaultValue={ele.prevWeights[index].score}
                        onLayout={() =>
                          handleInputWeightChange(
                            index,
                            ele.prevWeights[index].score,
                            indexMain
                          )
                        }
                        onChangeText={(text) =>
                          handleInputWeightChange(index, text, indexMain)
                        }
                        className="rounded-xl text-sm w-[20%] border-[#3c3c3c] border-[2px] text-white pl-2 border-b-gray-500 border-b-2"
                      
                      />
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
    setLastTrainingSessionDate(lastTraining!);
    setLastTrainingSessionExercises(lastExercises!);
    setShowExercise(true);
    setFieldsArray(arr);
    setViewLoading(false);
  };

  const handleInputChange = (
    index: number,
    text: string,
    indexMain: number
  ) => {
    if (indexMain === 0)
      dispatch({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    else if (indexMain === 1)
      dispatchSecond({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    else if (indexMain === 2)
      dispatchThird({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    else if (indexMain === 3)
      dispatchFourth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    else if (indexMain === 4) {
      dispatchFifth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 5) {
      dispatchSixth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 6) {
      dispatchSeventh({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 7) {
      dispatchEighth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 8) {
      dispatchNinth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 9) {
      dispatchTenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 10) {
      dispatchEleventh({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 11) {
      dispatchTwelfth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 12) {
      dispatchThirteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 13) {
      dispatchFourteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 14) {
      dispatchFifteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 15) {
      dispatchSixteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 16) {
      dispatchSeventeenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 17) {
      dispatchEighteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 18) {
      dispatchNineteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    }
  };
  const handleInputWeightChange = (
    index: number,
    text: string,
    indexMain: number
  ) => {
    if (indexMain === 0) {
      dispatchWeight({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 1) {
      dispatchWeightSecond({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 2) {
      dispatchWeightThird({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 3) {
      dispatchWeightFourth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 4) {
      dispatchWeightFifth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 5) {
      dispatchWeightSixth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 6) {
      dispatchWeightSeventh({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 7) {
      dispatchWeightEighth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 8) {
      dispatchWeightNinth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 9) {
      dispatchWeightTenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 10) {
      dispatchWeightEleventh({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 11) {
      dispatchWeightTwelfth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 12) {
      dispatchWeightThirteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 13) {
      dispatchWeightFourteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 14) {
      dispatchWeightFifteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 15) {
      dispatchWeightSixteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 16) {
      dispatchWeightSeventeenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 17) {
      dispatchWeightEighteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    } else if (indexMain === 18) {
      dispatchWeightNineteenth({
        type: "UPDATE_INPUT",
        index,
        value: text,
      });
    }
  };

  const submitYourTraining = (isPlanFinished: boolean) => {
    const arrReps: ExerciseTraining[] = [];
    const arrWeight: ExerciseTraining[] = [];
    const arr: ExerciseTraining[] = [];
    let helpsArrayReps = fieldsArray?.filter(
      (ele, index: number) => index === 0 || index % 2 === 0
    );
    let helpsArrayWeights = fieldsArray?.filter(
      (ele, index: number) => index !== 0 && index % 2 !== 0
    );
    function processInputValues(
      values: any,
      weights: any,
      repsArray: any,
      weightArray: any
    ) {
      for (let i = 0; i < Object.keys(values).length; i++) {
        repsArray.push({ field: `${helpsArrayReps![i]}`, score: values[i] });
        weightArray.push({
          field: `${helpsArrayWeights![i]}`,
          score: weights[i],
        });
      }
      helpsArrayReps = helpsArrayReps!.slice(Object.keys(values).length);
      helpsArrayWeights = helpsArrayWeights!.slice(Object.keys(weights).length);
    }

    const helpsArrayInputsValues = [
      inputValues,
      inputValuesSecond,
      inputValuesThird,
      inputValuesFourth,
      inputValuesFifth,
      inputValuesSixth,
      inputValuesSeventh,
      inputValuesEighth,
      inputValuesNinth,
      inputValuesTenth,
      inputValuesEleventh,
      inputValuesTwelfth,
      inputValuesThirteenth,
      inputValuesFourteenth,
      inputValuesFifteenth,
      inputValuesSixteenth,
      inputValuesSeventeenth,
      inputValuesEighteenth,
      inputValuesNineteenth,
    ];
    const helpsArrayInputsValuesWeights = [
      inputWeightValues,
      inputWeightValuesSecond,
      inputWeightValuesThird,
      inputWeightValuesFourth,
      inputWeightValuesFifth,
      inputWeightValuesSixth,
      inputWeightValuesSeventh,
      inputWeightValuesEighth,
      inputWeightValuesNinth,
      inputWeightValuesTenth,
      inputWeightValuesEleventh,
      inputWeightValuesTwelfth,
      inputWeightValuesThirteenth,
      inputWeightValuesFourteenth,
      inputWeightValuesFifteenth,
      inputWeightValuesSixteenth,
      inputWeightValuesSeventeenth,
      inputWeightValuesEighteenth,
      inputWeightValuesNineteenth,
    ];

    for (let i = 0; i < pickedDay?.length!; i++) {
      const currentInputValues = helpsArrayInputsValues[i];
      const currentInputValuesWeights = helpsArrayInputsValuesWeights[i];
      processInputValues(
        currentInputValues,
        currentInputValuesWeights,
        arrReps,
        arrWeight
      );
    }
    for (let i = 0; i < arrReps.length; i++) {
      arr.push(arrReps[i]);
      arr.push(arrWeight[i]);
    }
    isPlanFinished
      ? addYourTrainingToDataBase(dayToCheck!, arr)
      : addYourTrainingToStorage(dayToCheck!, arr);
  };
  const addYourTrainingToStorage = async (
    day: string,
    training: Array<ExerciseTraining>
  ): Promise<void> => {
    const trainingToStorage = {
      day: day,
      training: training,
    };
    await AsyncStorage.removeItem('currentTraining')
    await AsyncStorage.setItem(
      "currentTraining",
      JSON.stringify(trainingToStorage)
    );
  };

  const addYourTrainingToDataBase = async (
    day: string,
    training: Array<ExerciseTraining>
  ): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: addTrainingFetchType = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/addTraining`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          day: day,
          training: training,
          createdAt: new Date().getTime(),
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if ((response.msg = "Training added")) {
      setChooseDay(<View></View>);
      setDaySection(<View></View>);
      setShowExercise(false);
      setIsPopUpShowed(true);
      popUpTurnOn();
      setIsPopUpRankShowed(true)
      await AsyncStorage.removeItem("currentTraining");
    }
  };
  const popUpTurnOn: VoidFunction = (): void => {
    setTimeout(() => setIsPopUpShowed(false), 3000);
  };
  const showLastTrainingSection: VoidFunction = async (): Promise<void> => {
    if (
      !lastTrainingSessionDate ||
      lastTrainingSessionExercises?.length! < 1 ||
      !lastTrainingSessionExercises
    )
      return setViewLoading(false);
    if (!(await checkLastTrainingSession(dayToCheck!)))
      return setViewLoading(false);
    let count: number = 0;
    pickedDay?.map((ele) => {
      count += ele.series;
    });

    let scoreAndFieldsCount = count * 2;
    if (lastTrainingSessionExercises.length !== scoreAndFieldsCount)
      return setViewLoading(false);
    setLastTrainingSection(() => {
      return (
        <View className="bg-[#000000fa] absolute w-full h-full flex flex-col z-[5]">
          <TouchableOpacity onPress={hideLastTrainingSection}>
            <Icon style={{ fontSize: 40, color: "white" }} name="close" />
          </TouchableOpacity>
          <Text
          className="text-2xl text-center mb-5 text-white"
            style={{
              fontFamily: "OpenSans_400Regular"
            }}
          >
            Date:  <Text className="text-[#4CD964]" style={{fontFamily:'OpenSans_400Regular'}}>{new Date(lastTrainingSessionDate).toLocaleDateString()}</Text> 
          </Text>
          <ScrollView className="w-4/5 ml-[10%] h-[70%] ">
            <View className="w-full flex flex-row">
              <View className="w-[60%]" >
                {lastTrainingSessionExercises.length > 0
                  ? lastTrainingSessionExercises.map((ele, index: number) => {
                      if (index !== 0 && index % 2 !== 0) return;
                      return (
                        <View
                        className="w-full  border-b-[1px] h-20 text-white"
                          key={index}
                        >
                          {index === 0 || index % 2 == 0 ? (
                            <Text
                              className="text-sm mt-5 ml-2 text-white"
                              style={{
                                fontFamily: "OpenSans_400Regular",
                              }}
                            >
                              {ele.field.slice(0, ele.field.length - 4)}
                            </Text>
                          ) : (
                            <Text></Text>
                          )}
                        </View>
                      );
                    })
                  :<Text></Text>}
              </View>

              <View className="w-[40%] flex flex-row flex-wrap">
                {lastTrainingSessionExercises.length > 0
                  ? lastTrainingSessionExercises.map((ele, index) => {
                      return (
                        <Text
                          style={{
                            fontFamily: "OpenSans_400Regular"
                          }}
                          className="w-1/2  border-b-[1px] h-20 pl-[10%]
                          bg-[#4cd96309] pt-5 text-white text-base"
                          key={index}
                        >
                          {ele.score}
                        </Text>
                      );
                    })
                  :<Text></Text>}
              </View>
            </View>
          </ScrollView>
        </View>
      );
    });

    setViewLoading(false);
  };
  const checkLastTrainingSession = async (day: string): Promise<boolean> => {
    const id = await AsyncStorage.getItem("id");
    const response: SuccessMsg = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/checkPrevSessionTraining/${day}`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if (response.msg === "Yes") return true;
    return false;
  };
  const hideLastTrainingSection: VoidFunction = (): void => {
    setLastTrainingSection(<View></View>);
  };

  const toggleSwitch = () => {
    !isEnabled ? setIsAddTrainingActive(true) : setIsAddTrainingActive(false);
    setIsEnabled((previousState) => !previousState);
  };
  const deleteCurrentSession=async()=>{
    await AsyncStorage.removeItem('currentTraining')
    setShowExercise(false)
    setDaySection(<View></View>)
    setChooseDay(<View></View>);
    toggleSwitch()
  }
  const closeRankPopUp = ()=>{
    setIsPopUpRankShowed(false)
  }
  return (
      <View className="bg-[#131313] flex-1 w-full">
        {plan === "completed" && plan ? (
          <View className="relative  flex flex-col justify-center items-center h-full w-full" >
            <TouchableOpacity onPress={getInformationsAboutPlanDays}>
              <Icon
                style={{ fontSize: 140,color:'#4CD964' }}
                name="plus-circle"
              />
            </TouchableOpacity>
            {loading ? <MiniLoading /> :<Text></Text>}
            {}
            {chooseDay}
            {isPopUpShowed ? (
              <View className="items-center bg-green-600 rounded-[50px] flex flex-row justify-center w-1/2 h-1/3 top-[30%] absolute" >
                <Icon style={{ fontSize: 100 }} name="check" />
              </View>
            ) : (
              <Text></Text>
            )}
            {daySection}
            {lastTrainingSection}
            {showExercise ? (
              <View className="w-full flex justify-around flex-row absolute items-center bottom-0  mb-0">
                {isAddTrainingActive ? (
                  <TouchableOpacity
                    onPress={() => submitYourTraining(true)}
                    className="w-[30%] h-12 rounded-lg bg-[#4CD964] flex justify-center items-center"

                  >
                    <Text
                    className="text-center text-sm"
                      style={{
                        fontFamily: "OpenSans_400Regular",
                      }}
                    >
                      ADD TRAINING
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => submitYourTraining(false)}
                    className="w-[30%] h-12 rounded-lg bg-[#4CD964] flex justify-center items-center"
               
                  >
                    <Text
                    className="text-center text-sm"
                      style={{
                        fontFamily: "OpenSans_400Regular",
                      }}
                    >
                      SAVE TRAINING STATE
                    </Text>
                  </TouchableOpacity>
                )}
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                ></Switch>
                {isAddTrainingActive?<TouchableOpacity onPress={()=>deleteCurrentSession()}
                className="w-[30%] h-12 rounded-lg bg-[#4CD964] flex justify-center items-center">
                        <Text className="text-center text-sm" style={{  fontFamily: "OpenSans_400Regular"}}>
                          DELETE CURRENT
                        </Text>
                </TouchableOpacity>:<TouchableOpacity
                  onPress={() => {
                    setViewLoading(true);
                    showLastTrainingSection();
                  }}
                  className="w-[30%] h-12 rounded-lg bg-[#4CD964] flex justify-center items-center"
                 
                >
                  <Text
                  className="text-center text-sm"
                    style={{
                      fontFamily: "OpenSans_400Regular",
                    }}
                  >
                    SHOW PREVIOUS
                  </Text>
                </TouchableOpacity>}
                
              </View>
            ) : (
              <Text></Text>
            )}
            {isAddTrainingActive && dayId ? <TrainingPlanDay hideChooseDaySection={resetChoosePlanDay} dayId={dayId} /> : <></>}
          </View>
        ) : (
          <View className="w-full h-full flex flex-row justify-center text-center text-2xl items-center p-4">
            <Text className="text-white text-xl text-center"
              style={{
                fontFamily: "OpenSans_400Regular"
              }}
            >
              You cant add training, because you dont have plan!
            </Text>
          </View>
        )}
        {viewLoading ? <ViewLoading /> :<Text></Text>}
        {isPopUpRankShowed?<UpdateRankPopUp closePopUp={closeRankPopUp}/>:''}
      </View>

  );
};
export default AddTraining;

import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import backgroundLogo from "./img/backgroundLGYMApp500.png";
import { AddTrainingStyles } from "./styles/AddTrainingStyles";
import { useState, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Teko_700Bold,
  Teko_400Regular,
} from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Exercise from "./types/Exercise";
import Data from "./types/DataPlansArrays";
import LastTrainingSession from "./types/LastTrainingSession";
import ExerciseTraining from "./types/ExerciseTraining";
import addTrainingFetchType from "./types/AddTrainingFetchAnsw";
import SuccessMsg from "./types/SuccessMsg";
import ViewLoading from "./ViewLoading";
import MiniLoading from "./MiniLoading";
import { useInterval } from "react-use";
import UpdateRankPopUp from "./UpdateRankPopUp";
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

const AddTraining: React.FC = () => {
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

  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
    Teko_400Regular,
  });
  useInterval(() => {
    if(!showExercise) return
    submitYourTraining(false);
  }, 1000);
  useEffect(() => {
    const loadAsyncResources = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Błąd ładowania zasobów:", error);
      }
    };

    loadAsyncResources();
  }, [fontsLoaded]);
  useEffect(() => {
    setViewLoading(true);
    getFromStorage();
    getSessionFromStorage();
  }, []);
  const getSessionFromStorage = async () => {
    const training = await AsyncStorage.getItem("currentTraining");
    const parsedTraining = JSON.parse(training as string);
    showDaySection(parsedTraining.day, true);
  };
  const getFromStorage = async (): Promise<void> => {
    const plan: string | null | undefined =
      (await AsyncStorage.getItem("plan")) || "";
    setViewLoading(false);
    setPlan(plan);
  };
  const getInformationsAboutPlanDays: VoidFunction =
    async (): Promise<void> => {
      setLoading(true);
      const id = await AsyncStorage.getItem("id");
      const trainingDays: number = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/${id}/configPlan`
      )
        .then((res) => res.json())
        .catch((err) => err)
        .then((res) => res.count);
      const helpsArray = ["A", "B", "C", "D", "E", "F", "G"];
      const daysArray = [];
      for (let i = 0; i < trainingDays; i++) {
        daysArray.push(helpsArray[i]);
      }

      setChooseDay(
        <View style={AddTrainingStyles.chooseDaySection}>
          <Text
            style={{ fontFamily: "Teko_700Bold", fontSize: 40, color: "white" }}
          >
            Choose training day!
          </Text>
          {daysArray.map((ele, index: number) => (
            <TouchableOpacity
              onPress={() => showDaySection(ele, false)}
              style={AddTrainingStyles.button}
              key={index}
            >
              <Text
                style={{
                  fontFamily: "Teko_700Bold",
                  fontSize: 30,
                  color: "white",
                }}
              >
                {ele}
              </Text>
            </TouchableOpacity>
          ))}
          {loading ? <MiniLoading /> : ""}
        </View>
      );
      setLoading(false);
    };
  const showDaySection = async (
    day: string,
    session: boolean
  ): Promise<void> => {
    setViewLoading(true);
    const id = await AsyncStorage.getItem("id");
    const planOfTheDay: Array<Exercise> | undefined = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/${id}/getPlan`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => {
        const data: Data = res.data;
        if (day === "A") return data.planA;
        else if (day === "B") return data.planB;
        else if (day === "C") return data.planC;
        else if (day === "D") return data.planD;
        else if (day === "E") return data.planE;
        else if (day === "F") return data.planF;
        else if (day === "G") return data.planG;
      });
    session
      ? setCurrentDaySectionFromSession(planOfTheDay!, day)
      : setCurrentDaySection(planOfTheDay!, day);
    setDayToCheck(day);
    setChooseDay(<View></View>);
    setPickedDay(planOfTheDay);
  };
  const setCurrentDaySection = async (
    exercises: Array<Exercise>,
    day: string
  ): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: { prevSession: LastTrainingSession } | null = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/${id}/getPrevSessionTraining/${day}`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    let lastTraining: string;
    let lastExercises: Array<ExerciseTraining>;

    if ("prevSession" in response!) {
      lastTraining = response.prevSession.createdAt.slice(0, 24);
      lastExercises = response.prevSession.exercises.map((ele) => ele);
    }
    let arr: String[] = [];
    setDaySection(
      <View style={AddTrainingStyles.daySection}>
        <Text
          style={{
            fontFamily: "Teko_700Bold",
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
            let helpsArray: Array<string> = [];
            for (let i = 1; i < +ele.series + 1; i++) {
              helpsArray.push(`Series: ${i}`);
            }
            return (
              <View style={{ marginBottom: 50 }} key={indexMain}>
                <Text
                  style={{
                    fontFamily: "Teko_700Bold",
                    fontSize: 20,
                    marginBottom: 30,
                    marginLeft: 5,
                    color: "white",
                  }}
                >
                  {ele.name}
                </Text>
                {helpsArray.map((s, index: number) => {
                  arr.push(`${ele.name} ${s}: Rep`);
                  arr.push(`${ele.name} ${s}: Weight (kg)`);
                  return (
                    <View style={AddTrainingStyles.exerciseDiv} key={index}>
                      <Text
                        style={{
                          fontFamily: "Teko_400Regular",
                          fontSize: 15,
                          width: "20%",
                          color: "white",
                        }}
                      >
                        <Text>{ele.name}</Text> {s}: Rep
                      </Text>
                      <TextInput
                        defaultValue="0"
                        onLayout={() =>
                          handleInputChange(index, "0", indexMain)
                        }
                        onChangeText={(text) =>
                          handleInputChange(index, text, indexMain)
                        
                        }
                        style={AddTrainingStyles.input}
                      />
                      <Text
                        style={{
                          fontFamily: "Teko_400Regular",
                          fontSize: 15,
                          width: "20%",
                          marginLeft: "10%",
                          color: "white",
                        }}
                      >
                        <Text>{ele.name}</Text> {s}: Weight (kg)
                      </Text>
                      <TextInput
                        defaultValue="0"
                        onLayout={() =>
                          handleInputWeightChange(index, "0", indexMain)
                        }

                        onChangeText={(text) =>
                          handleInputWeightChange(index, text, indexMain)
                        }
                        style={{
                          borderBottomColor: "grey",
                          borderBottomWidth: 2,
                          ...AddTrainingStyles.input,
                        }}
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
      `${process.env.REACT_APP_BACKEND}/api/${id}/getPrevSessionTraining/${day}`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    let lastTraining: string;
    let lastExercises: Array<ExerciseTraining>;

    if ("prevSession" in response!) {
      lastTraining = response.prevSession.createdAt.slice(0, 24);
      lastExercises = response.prevSession.exercises.map((ele) => ele);
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
      <View style={AddTrainingStyles.daySection}>
        <Text
          style={{
            fontFamily: "Teko_700Bold",
            width: "100%",
            textAlign: "center",
            fontSize: 30,
            color: "white",
          }}
        >
          Training <Text>{day}</Text>
        </Text>
        <ScrollView>
          {newHelpsArray.map((ele: any, indexMain: number) => {
            let helpsArray: Array<string> = [];
            for (let i = 1; i < +ele.series + 1; i++) {
              helpsArray.push(`Series: ${i}`);
            }
            return (
              <View style={{ marginBottom: 50 }} key={indexMain}>
                <Text
                  style={{
                    fontFamily: "Teko_700Bold",
                    fontSize: 20,
                    marginBottom: 30,
                    marginLeft: 5,
                    color: "white",
                  }}
                >
                  {ele.name}
                </Text>
                {helpsArray.map((s, index: number) => {
                  arr.push(`${ele.name} ${s}: Rep`);
                  arr.push(`${ele.name} ${s}: Weight (kg)`);
                  return (
                    <View style={AddTrainingStyles.exerciseDiv} key={index}>
                      <Text
                        style={{
                          fontFamily: "Teko_400Regular",
                          fontSize: 15,
                          width: "20%",
                          color: "white",
                        }}
                      >
                        <Text>{ele.name}</Text> {s}: Rep
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
                        style={AddTrainingStyles.input}
                      />
                      <Text
                        style={{
                          fontFamily: "Teko_400Regular",
                          fontSize: 15,
                          width: "20%",
                          marginLeft: "10%",
                          color: "white",
                        }}
                      >
                        <Text>{ele.name}</Text> {s}: Weight (kg)
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
                        style={{
                          borderBottomColor: "grey",
                          borderBottomWidth: 2,
                          ...AddTrainingStyles.input,
                        }}
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
      `${process.env.REACT_APP_BACKEND}/api/${id}/addTraining`,
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
        <View style={AddTrainingStyles.lastSessionTrainingSection}>
          <TouchableOpacity onPress={hideLastTrainingSection}>
            <Icon style={{ fontSize: 40, color: "white" }} name="close" />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Teko_400Regular",
              ...AddTrainingStyles.lastSessionDate,
            }}
          >
            Date: {lastTrainingSessionDate}
          </Text>
          <ScrollView style={AddTrainingStyles.scrollViewLastSession}>
            <View style={AddTrainingStyles.ViewLastSessionInsideScroll}>
              <View style={AddTrainingStyles.containerForFieldsAtLastSession}>
                {lastTrainingSessionExercises.length > 0
                  ? lastTrainingSessionExercises.map((ele, index: number) => {
                      if (index !== 0 && index % 2 !== 0) return;
                      return (
                        <View
                          style={AddTrainingStyles.lastSessionField}
                          key={index}
                        >
                          {index === 0 || index % 2 == 0 ? (
                            <Text
                              style={{
                                fontFamily: "Teko_400Regular",
                                fontSize: 20,
                                marginTop: 20,
                                marginLeft: 10,
                                color: "white",
                              }}
                            >
                              {ele.field.slice(0, ele.field.length - 4)}
                            </Text>
                          ) : (
                            ""
                          )}
                        </View>
                      );
                    })
                  : ""}
              </View>

              <View style={AddTrainingStyles.containerForScoresAtLastSession}>
                {lastTrainingSessionExercises.length > 0
                  ? lastTrainingSessionExercises.map((ele, index) => {
                      return (
                        <Text
                          style={{
                            fontFamily: "Teko_400Regular",
                            fontSize: 20,
                            ...AddTrainingStyles.lastSessionScore,
                          }}
                          key={index}
                        >
                          {ele.score}
                        </Text>
                      );
                    })
                  : ""}
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
      `${process.env.REACT_APP_BACKEND}/api/${id}/checkPrevSessionTraining/${day}`
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

  if (!fontsLoaded) {
    return <ViewLoading />;
  }


  return (
    <ImageBackground
      source={backgroundLogo}
      style={AddTrainingStyles.background}
    >
      <View style={AddTrainingStyles.addTrainingContainer}>
        {plan === "completed" ? (
          <View style={AddTrainingStyles.addTrainingSection}>
            <Text
              style={{
                fontFamily: "Teko_400Regular",
                fontSize: 45,
                textAlign: "center",
              }}
            >
              Add Training!
            </Text>
            <TouchableOpacity onPress={getInformationsAboutPlanDays}>
              <Icon
                style={{ fontSize: 100, marginTop: "40%" }}
                name="plus-circle"
              />
            </TouchableOpacity>
            {loading ? <MiniLoading /> : ""}
            {}
            {chooseDay}
            {isPopUpShowed ? (
              <View style={AddTrainingStyles.popUp}>
                <Icon style={{ fontSize: 100 }} name="check" />
              </View>
            ) : (
              ""
            )}
            {daySection}
            {lastTrainingSection}
            {showExercise ? (
              <View style={AddTrainingStyles.buttonsSection}>
                {isAddTrainingActive ? (
                  <TouchableOpacity
                    onPress={() => submitYourTraining(true)}
                    style={AddTrainingStyles.buttonAtAddTrainingConfig}
                  >
                    <Text
                      style={{
                        fontFamily: "Teko_400Regular",
                        textAlign: "center",
                        fontSize: 25,
                      }}
                    >
                      ADD TRAINING
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => submitYourTraining(false)}
                    style={AddTrainingStyles.buttonAtAddTrainingConfig}
                  >
                    <Text
                      style={{
                        fontFamily: "Teko_400Regular",
                        textAlign: "center",
                        fontSize: 17,
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
                {isAddTrainingActive?<TouchableOpacity onPress={()=>deleteCurrentSession()} style={AddTrainingStyles.buttonAtAddTrainingConfig}>
                        <Text style={{  fontFamily: "Teko_400Regular",
                      textAlign: "center",
                      fontSize: 17,}}>
                          DELETE CURRENT SESSION
                        </Text>
                </TouchableOpacity>:<TouchableOpacity
                  onPress={() => {
                    setViewLoading(true);
                    showLastTrainingSection();
                  }}
                  style={AddTrainingStyles.buttonAtAddTrainingConfig}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    SHOW PREVIOUS SESSION
                  </Text>
                </TouchableOpacity>}
                
              </View>
            ) : (
              ""
            )}
          </View>
        ) : (
          <View style={AddTrainingStyles.withoutTraining}>
            <Text
              style={{
                fontFamily: "Teko_400Regular",
                fontSize: 25,
                textAlign: "center",
              }}
            >
              You cant add training, because you dont have plan!
            </Text>
          </View>
        )}
        {viewLoading ? <ViewLoading /> : ""}
        {isPopUpRankShowed?<UpdateRankPopUp/>:''}
      </View>
    </ImageBackground>
  );
};
export default AddTraining;

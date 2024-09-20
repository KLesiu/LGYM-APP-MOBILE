import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import Data from "./types/DataPlansArrays";
import Exercise from "./types/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorMsg from "./types/ErrorMsg";
import SuccessMsg from "./types/SuccessMsg";
import ViewLoading from "./ViewLoading";
import ImportPlanPopUp from "./ImportPlanPopUp";
import CreatePlanConfig from "./CreatePlanConfig";
import CreatePlanDay from "./CreatePlanDay";
import { PlanDayForm, PlanDayVm } from "./interfaces/PlanDay";

const TrainingPlan: React.FC = () => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planConfig, setPlanConfig] = useState<{
    name: string;
    trainingDays: number;
    _id: string;
  }>();
  const [planDays, setPlanDays] = useState<PlanDayVm[]>();
  const [yourPlan, setYourPlan] = useState<JSX.Element>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [isPlanSet, setIsPlanSet] = useState<boolean>(false);
  const [isPlanDayFormVisible, setIsPlanDayFormVisible] =useState<boolean>(false)
  const [isPopUpDeleteShowed, setIsPopUpDeleteShowed] =
    useState<boolean>(false);
  const [popUp, setPopUp] = useState<JSX.Element>();
  const [showImportPlanPopUp, setShowImportPlanPopUp] =
    useState<boolean>(false);
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  useEffect(() => {
    setViewLoading(true);
    getUserPlanConfig();
  }, [isPlanSet]);
  useEffect(() => {
    getPlanDays()
  }, [planConfig]);
  // useEffect(() => {
  //
  //   if (isPopUpDeleteShowed) {
  //     setPopUp(
  //       <View className="absolute h-full w-full bg-[#000000f2] z-[3] flex pt-[30%] flex-column items-center">
  //         <Text
  //           className="text-4xl text-gray-200"
  //           style={{
  //             fontFamily: "OpenSans_300Light",
  //           }}
  //         >
  //           Are you sure?
  //         </Text>
  //         <TouchableOpacity
  //           onPress={deletePlan}
  //           className="w-1/2 h-24 bg-green-500 rounded-xl flex flex-row justify-center items-center mt-[10%]"
  //         >
  //           <Text
  //             className="text-2xl"
  //             style={{ fontFamily: "OpenSans_700Bold" }}
  //           >
  //             YES
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={() => {
  //             setPopUp(<></>);
  //             setIsPopUpDeleteShowed(false);
  //           }}
  //           className="w-1/2 h-24 bg-red-500 mt-[10%] rounded-xl flex flex-row justify-center items-center"
  //         >
  //           <Text
  //             className="text-2xl"
  //             style={{ fontFamily: "OpenSans_700Bold" }}
  //           >
  //             NO
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  // }, [isPopUpDeleteShowed]);


  const getPlanDays = async ():Promise<void> => {
    if(!planConfig) return
    const response = await fetch(`${apiURL}/api/planDay/${planConfig._id}/getPlanDays`)
      .then((res) => res.json())
      .catch((err) => err);
    setPlanDays(response)}
  const showImportPlanPopUpFn = (): void => {
    setShowImportPlanPopUp(true);
  };
  const showPlanConfigPopUp = (): void => {
    setShowPlanConfig(true);
  };
  const showPlanDayForm = (): void => {
    setIsPlanDayFormVisible(true)
  }
  const hidePlanDayForm = (): void => {
    setIsPlanDayFormVisible(false)
  }
  const showPlanSetPopUp = (): void => {
    setShowPlanConfig(false);
  };
  const setImportPlan = async (userName: string): Promise<void> => {
    if (!userName) return;
    const id = await AsyncStorage.getItem("id");

    await fetch(`https://lgym-app-api-v2.vercel.app/api/${id}/setSharedPlan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
      }),
    })
      .then(() => {
        setShowImportPlanPopUp(false);
        setIsPlanSet(true);
      })
      .catch((err) => err);
  };
  const renderPlanDay = ({ item }: { item: PlanDayVm }) => {
    return (
        <View >
            <Text className="text-2xl font-bold mb-3">{item.name}</Text>
            {item.exercises.map((exercise, index) => (
                <View key={index} className="mb-2">
                    <Text className="text-lg">
                        {exercise.exercise.name} - {exercise.series} x {exercise.reps} 
                    </Text>
                </View>
            ))}
        </View>
    );
};
  const getUserPlanConfig = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/getPlanConfig`)
      .then((res) => res.json())
      .catch((err) => err);
    if (Object.keys(response)[0] === "msg") return;
    setPlanConfig(response);
    setViewLoading(false);
  };

  return (
    <View className="flex flex-1 relative w-full bg-[#131313]">
      <View className="w-full h-[15%] px-4 flex flex-col">
        {!planConfig ? (
          <View className="flex flex-row w-full justify-around">
            <TouchableOpacity
              onPress={showPlanConfigPopUp}
              className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"
            >
              <Text
                className="text-black text-md w-full text-center"
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Create plan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"
              onPress={() => showImportPlanPopUpFn()}
            >
              <Text
                className="text-black text-md w-full text-center"
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Import plan
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text></Text>
        )}
        {planConfig && Object.keys(planConfig).length ? (
          <View className="flex flex-col gap-4 items-center">
            <View className="flex flex-row w-full justify-around items-center">
              <Text
                className="w-full text-lg text-white  font-bold "
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Current training plan: {planConfig.name}
              </Text>
              <TouchableOpacity onPress={() => setIsPopUpDeleteShowed(true)}>
                <Icon
                  style={{ color: "#de161d", fontSize: 30 }}
                  name="delete"
                />
              </TouchableOpacity>
            </View>
            <View>
              <Pressable className="w-40  h-12 flex items-center justify-center bg-[#4CD964] rounded-lg" onPress={showPlanDayForm}>
                <Text
                  className="text-lg text-black"
                  style={{
                    fontFamily: "OpenSans_700Bold",
                  }}
                >
                  Add plan day
                </Text>
              </Pressable>
            </View>
            {planDays && planDays.length ?   <FlatList
            data={planDays} // Źródło danych
            renderItem={renderPlanDay} // Funkcja renderująca elementy
            keyExtractor={(item) => item._id ?? item.name} // Klucz dla każdego elementu
            horizontal={true} // Ustawienie na poziome przewijanie
            pagingEnabled={true} // Włączenie paginacji (swipe)
            showsHorizontalScrollIndicator={false} // Wyłączenie paska przewijania
        /> : <Text></Text>}
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
      {popUp}
      {viewLoading ? <ViewLoading /> : <Text></Text>}
      {showImportPlanPopUp ? (
        <ImportPlanPopUp setImportPlan={setImportPlan} />
      ) : (
        <Text></Text>
      )}
      {showPlanConfig ? (
        <CreatePlanConfig showPlanSetPopUp={showPlanSetPopUp} />
      ) : (
        <Text></Text>
      )}
      {isPlanDayFormVisible && planConfig? <CreatePlanDay planId={planConfig._id} closeForm={hidePlanDayForm} /> : <Text></Text>}
    </View>
  );
};
export default TrainingPlan;

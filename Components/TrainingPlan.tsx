import { Text, View, TouchableOpacity, ScrollView } from "react-native";
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
import CreatePlanBody from "./CreatePlanBody";

const TrainingPlan: React.FC = () => {
  const [yourPlan, setYourPlan] = useState<JSX.Element>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [isPlanSet, setIsPlanSet] = useState<boolean>(false);
  const [isPopUpDeleteShowed, setIsPopUpDeleteShowed] =
    useState<boolean>(false);
  const [popUp, setPopUp] = useState<JSX.Element>();
  const [showImportPlanPopUp, setShowImportPlanPopUp] =
    useState<boolean>(false);
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  const [showPlanSet, setShowPlanSet] = useState<boolean>(false);
  useEffect(() => {
    setViewLoading(true);
    getUserPlan();
  }, [isPlanSet]);
  useEffect(() => {
    if (isPopUpDeleteShowed) {
      setPopUp(
        <View className="absolute h-full w-full bg-[#000000f2] z-[3] flex pt-[30%] flex-column items-center">
          <Text
            className="text-4xl text-gray-200"
            style={{
              fontFamily: "OpenSans_300Light",
            }}
          >
            Are you sure?
          </Text>
          <TouchableOpacity
            onPress={deletePlan}
            className="w-1/2 h-24 bg-green-500 rounded-xl flex flex-row justify-center items-center mt-[10%]"
          >
            <Text
              className="text-2xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              YES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPopUp(<></>);
              setIsPopUpDeleteShowed(false);
            }}
            className="w-1/2 h-24 bg-red-500 mt-[10%] rounded-xl flex flex-row justify-center items-center"
          >
            <Text
              className="text-2xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              NO
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }, [isPopUpDeleteShowed]);
  const getUserPlan = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: { data: Data | string } = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/getPlan`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if (response.data === "Didnt find") {
      setIsPlanSet(false);
    } else {
      const data:Data = response.data as Data;
      const dataKeys = Object.keys(data)
      let isPlanEmpty = true
      dataKeys.forEach((ele:string)=>{
        if(data[ele].length>0){
          isPlanEmpty=false
        }
      })
      isPlanEmpty?deletePlan():null
      
      
      if (typeof data !== "string") {
        const planA =
          data.planA.length > 0
            ? data.planA.map((element: Exercise, index: number) => (
                <View
                  className="w-full  px-2 py-2 flex flex-row flex-wrap justify-start bg-[#1E1E1E73] "
                  key={index}
                >
                  <Text
                    className="text-[11px] text-gray-200/80 leading-4 "
                    style={{
                      fontFamily: "OpenSans_300Light",
                      width: "60%",
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className="text-gray-200/80 text-[11px]"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planB =
          data.planB.length > 0
            ? data.planB.map((element: Exercise, index: number) => (
                <View
                  className="w-full  px-2 py-2 flex flex-row flex-wrap justify-start bg-[#1E1E1E73] "
                  key={index}
                >
                  <Text
                    className="text-[11px] text-gray-200/80 leading-4 "
                    style={{
                      fontFamily: "OpenSans_300Light",
                      width: "60%",
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className="text-gray-200/80 text-[11px]"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planC =
          data.planC.length > 0
            ? data.planC.map((element: Exercise, index: number) => (
                <View
                  className="w-full px-2 py-2 flex flex-row flex-wrap justify-start bg-[#1E1E1E73] "
                  key={index}
                >
                  <Text
                    className="text-[11px] text-gray-200/80 leading-4 "
                    style={{
                      fontFamily: "OpenSans_300Light",
                      width: "60%",
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className="text-gray-200/80 text-[11px]"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planD =
          data.planD.length > 0
            ? data.planD.map((element: Exercise, index: number) => (
                <View
                  className="w-full  px-2 py-2 flex flex-row flex-wrap justify-start bg-[#1E1E1E73] "
                  key={index}
                >
                  <Text
                    className="text-[11px] text-gray-200/80 leading-4 "
                    style={{
                      fontFamily: "OpenSans_300Light",
                      width: "60%",
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className="text-gray-200/80 text-[11px]"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planE =
          data.planE.length > 0
            ? data.planE.map((element: Exercise, index: number) => (
                <View
                  className="w-full px-2 py-2 flex flex-row flex-wrap justify-start bg-[#1E1E1E73] "
                  key={index}
                >
                  <Text
                    className="text-[11px] text-gray-200/80 leading-4 "
                    style={{
                      fontFamily: "OpenSans_300Light",
                      width: "60%",
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className="text-gray-200/80 text-[11px]"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planF =
          data.planF.length > 0
            ? data.planF.map((element: Exercise, index: number) => (
                <View
                  className="w-full  px-2 py-2 flex flex-row flex-wrap justify-start bg-[#1E1E1E73] "
                  key={index}
                >
                  <Text
                    className="text-[11px] text-gray-200/80 leading-4 "
                    style={{
                      fontFamily: "OpenSans_300Light",
                      width: "60%",
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className="text-gray-200/80 text-[11px]"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planG =
          data.planG.length > 0
            ? data.planG.map((element: Exercise, index: number) => (
                <View
                  className="w-full px-2 py-1 flex flex-row flex-wrap justify-start bg-[#1E1E1E73] "
                  key={index}
                >
                  <Text
                    className="text-[11px] text-gray-200/80 leading-4 "
                    style={{
                      fontFamily: "OpenSans_300Light",
                      width: "60%",
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className="text-gray-200/80 text-[11px]"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        setYourPlan(() => {
          return (
            <ScrollView className="flex  px-2 py-4 pb-12">
              {planA ? (
                <View className="rounded w-full  flex flex-column items-start">
                  <Text
                    className="text-[#4CD964] mt-2 mb-2 text-sm font-bold"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    Plan A
                  </Text>
                  {planA}
                </View>
              ) : (
                ""
              )}
              {planB ? (
                <View className="rounded w-full  flex flex-column items-start">
                  <Text
                    className="text-[#4CD964] mt-2 mb-2 text-sm font-bold"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    Plan B
                  </Text>
                  {planB}
                </View>
              ) : (
                ""
              )}
              {planC ? (
                <View className="rounded w-full  flex flex-column items-start">
                  <Text
                    className="text-[#4CD964] mt-2 mb-2 text-sm font-bold"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    Plan C
                  </Text>
                  {planC}
                </View>
              ) : (
                ""
              )}
              {planD ? (
                <View className="rounded w-full  flex flex-column items-start">
                  <Text
                    className="text-[#4CD964] mt-2 mb-2 text-sm font-bold"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    Plan D
                  </Text>
                  {planD}
                </View>
              ) : (
                ""
              )}
              {planE ? (
                <View className="rounded w-full  flex flex-column items-start">
                  <Text
                    className="text-[#4CD964] mt-2 mb-2 text-sm font-bold"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    Plan E
                  </Text>
                  {planE}
                </View>
              ) : (
                ""
              )}
              {planF ? (
                <View className="rounded w-full  flex flex-column items-start">
                  <Text
                    className="text-[#4CD964] mt-2 mb-2 text-sm font-bold"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    Plan F
                  </Text>
                  {planF}
                </View>
              ) : (
                ""
              )}
              {planG ? (
                <View className="rounded w-full  flex flex-column items-start">
                  <Text
                    className="text-[#4CD964] mt-2 mb-2 text-sm font-bold"
                    style={{ fontFamily: "OpenSans_700Bold" }}
                  >
                    Plan G
                  </Text>
                  {planG}
                </View>
              ) : (
                ""
              )}
              <View className="h-36 w-20"></View>
            </ScrollView>
          );
        });

        await AsyncStorage.setItem("plan", "completed");
        setIsPlanSet(true);
      }
    }
    setViewLoading(false);
  };
  const deletePlan = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: ErrorMsg | SuccessMsg = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/deletePlan`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if (response.msg === "Deleted!") {
      await AsyncStorage.removeItem("plan");
      setIsPlanSet(false);
      setPopUp(<></>);
      setIsPopUpDeleteShowed(false);
    }
  };
  const showImportPlanPopUpFn = (): void => {
    setShowImportPlanPopUp(true);
  };
  const showPlanConfigPopUp = (): void => {
    setShowPlanConfig(true);
  };
  const showPlanSetPopUp = (): void => {
    setShowPlanConfig(false);
    setShowPlanSet(true);
  };
  const hideShowPlanSetPopUp = (): void => {
    setShowPlanSet(false);
    setViewLoading(true);
    getUserPlan();
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

  return (
    <View className="h-[78%] relative w-full bg-[#131313]">
      <View className="w-full h-[15%] px-4 flex flex-col">
        {!isPlanSet ? (
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
        ) : <Text></Text>}
        {isPlanSet ? (
          <View className="flex flex-row w-full justify-around items-center">
            <Text
              className="w-full text-lg text-white  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              Current training plan
            </Text>
            <TouchableOpacity onPress={() => setIsPopUpDeleteShowed(true)}>
              <Icon style={{ color: "#de161d", fontSize: 30 }} name="delete" />
            </TouchableOpacity>
          </View>
        ) : <Text></Text>}
      </View>
      {isPlanSet ? yourPlan : <Text></Text>}

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
      {showPlanSet ? (
        <CreatePlanBody hideShowPlanSetPopUp={hideShowPlanSetPopUp} />
      ) : (
        <Text></Text>
      )}
    </View>
  );
};
export default TrainingPlan;
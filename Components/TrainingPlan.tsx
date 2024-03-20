import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import backgroundLogo from "./img/backgroundLGYMApp500.png";
import { useState, useEffect } from "react";
import {
  useFonts,
  Teko_700Bold,
  Teko_400Regular,
} from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import Data from "./types/DataPlansArrays";
import Exercise from "./types/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorMsg from "./types/ErrorMsg";
import SuccessMsg from "./types/SuccessMsg";
import ViewLoading from "./ViewLoading";
import ImportPlanPopUp from "./ImportPlanPopUp";

const TrainingPlan: React.FC = () => {
  const withoutPlan = () => {
    return (
      <View
        className="items-center flex flex-col justify-start	h-full w-full bg-[#fffffff7] rounded-tl-10 rounded-tr-10	"
      >
        <Text style={{ fontFamily: "Teko_700Bold", fontSize: 40 }}>
          Training Plan
        </Text>
        <Text
          className="mt-[20%] text-[20px] text-center w-full"
          style={{
            fontFamily: "Teko_700Bold",
          }}
        >
          You dont have any plans
        </Text>
        <TouchableOpacity
          onPress={() => {
            const url = "https://lgym-app.vercel.app";
            Linking.openURL(url);
          }}
          className="bg-[#c2c2c2] w-[50%] h-[10%] flex items-center justify-center rounded-[10px] mt-[5%]"
        >
          <Text
            className="text-[20px] w-full text-center"
            style={{
              fontFamily: "Caveat_400Regular",
            }}
          >
            Create your plan now!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#c2c2c2] w-[50%] h-[10%] flex items-center justify-center rounded-[10px] mt-[5%]"
          onPress={() => showImportPlanPopUpFn()}
        >
          <Text
            className="text-[20px] w-full text-center"
            style={{
              fontFamily: "Caveat_400Regular",
            }}
          >
            Import plan!
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const [yourPlan, setYourPlan] = useState<JSX.Element>(withoutPlan);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [isPlanSet, setIsPlanSet] = useState<boolean>(false);
  const [isPopUpDeleteShowed, setIsPopUpDeleteShowed] =
    useState<boolean>(false);
  const [popUp, setPopUp] = useState<JSX.Element>();
  const [showImportPlanPopUp, setShowImportPlanPopUp] =
    useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
    Teko_400Regular,
  });
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
    getUserPlan();
  }, [isPlanSet]);
  useEffect(() => {
    if (isPopUpDeleteShowed) {
      setPopUp(
        <View className="absolute h-full w-full bg-[#000000f2] z-[3] flex pt-[30%] flex-column items-center">
          <Text
            style={{
              fontFamily: "Teko_400Regular",
              fontSize: 50,
              color: "grey",
            }}
          >
            Are you sure?
          </Text>
          <TouchableOpacity
            onPress={deletePlan}
            className="w-1/2 h-[10%] bg-green-500 rounded-xl flex flex-row justify-center items-center mt-[10%]"
          >
            <Text style={{ fontFamily: "Teko_700Bold", fontSize: 40 }}>
              YES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPopUp(<></>);
              setIsPopUpDeleteShowed(false);
            }}
            className="w-1/2 h-[10%] bg-red-500 mt-[10%] rounded-xl flex flex-row justify-center items-center"
          >
            <Text style={{ fontFamily: "Teko_700Bold", fontSize: 40 }}>NO</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }, [isPopUpDeleteShowed]);
  const getUserPlan = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: { data: Data | string } = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/${id}/getPlan`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if (response.data === "Didnt find") {
      setIsPlanSet(false);
      setYourPlan(withoutPlan);
    } else {
      const data = response.data;
      if (typeof data !== "string") {
        const planA =
          data.planA.length > 0
            ? data.planA.map((element: Exercise, index: number) => (
                <View
                  className="w-full flex flex-row flex-wrap justify-start bg-[#ffffffb3] mt-[5px]"
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      width: "60%",
                      fontSize: 20,
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text style={{ fontFamily: "Teko_400Regular", fontSize: 21 }}>
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planB =
          data.planB.length > 0
            ? data.planB.map((element: Exercise, index: number) => (
                <View
                  className="w-full flex flex-row flex-wrap justify-start bg-[#ffffffb3] mt-[5px]"
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      width: "60%",
                      fontSize: 20,
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text style={{ fontFamily: "Teko_400Regular", fontSize: 21 }}>
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planC =
          data.planC.length > 0
            ? data.planC.map((element: Exercise, index: number) => (
                <View
                  className="w-full flex flex-row flex-wrap justify-start bg-[#ffffffb3] mt-[5px]"
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      width: "60%",
                      fontSize: 20,
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text style={{ fontFamily: "Teko_400Regular", fontSize: 21 }}>
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planD =
          data.planD.length > 0
            ? data.planD.map((element: Exercise, index: number) => (
                <View
                  className="w-full flex flex-row flex-wrap justify-start bg-[#ffffffb3] mt-[5px]"
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      width: "60%",
                      fontSize: 20,
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text style={{ fontFamily: "Teko_400Regular", fontSize: 21 }}>
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planE =
          data.planE.length > 0
            ? data.planE.map((element: Exercise, index: number) => (
                <View
                  className="w-full flex flex-row flex-wrap justify-start bg-[#ffffffb3] mt-[5px]"
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      width: "60%",
                      fontSize: 20,
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text style={{ fontFamily: "Teko_400Regular", fontSize: 21 }}>
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planF =
          data.planF.length > 0
            ? data.planF.map((element: Exercise, index: number) => (
                <View
                  className="w-full flex flex-row flex-wrap justify-start bg-[#ffffffb3] mt-[5px]"
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      width: "60%",
                      fontSize: 20,
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text style={{ fontFamily: "Teko_400Regular", fontSize: 21 }}>
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        const planG =
          data.planG.length > 0
            ? data.planG.map((element: Exercise, index: number) => (
                <View
                  className="w-full flex flex-row flex-wrap justify-start bg-[#ffffffb3] mt-[5px]"
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular",
                      width: "60%",
                      fontSize: 20,
                    }}
                  >
                    {element.name}
                  </Text>
                  <Text style={{ fontFamily: "Teko_400Regular", fontSize: 21 }}>
                    {element.series} x {element.reps}
                  </Text>
                </View>
              ))
            : "";
        setYourPlan(() => {
          return (
            <View className="bg-[#fffffff2] flex flex-column h-full w-full text-center z-[2]">
              <Text
                style={{
                  fontFamily: "Teko_700Bold",
                  fontSize: 30,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Training Plan
              </Text>
              <TouchableOpacity
                onPress={() => setIsPopUpDeleteShowed(true)}
                className="absolute top-[5px] right-[5px]"
              >
                <Icon
                style={{color:'#de161d',fontSize:40}}
                  name="delete"
                />
              </TouchableOpacity>
              <ScrollView>
                {planA ? (
                  <View className="w-full flex flex-column items-start pl-[5%] mt-[10px] mb-[5px] border-b-[1px] border-b-gray-500 pb-[5px]">
                    <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>
                      Plan A
                    </Text>
                    {planA}
                  </View>
                ) : (
                  ""
                )}
                {planB ? (
                  <View className="w-full flex flex-column items-start pl-[5%] mt-[10px] mb-[5px] border-b-[1px] border-b-gray-500 pb-[5px]">
                    <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>
                      Plan B
                    </Text>
                    {planB}
                  </View>
                ) : (
                  ""
                )}
                {planC ? (
                  <View className="w-full flex flex-column items-start pl-[5%] mt-[10px] mb-[5px] border-b-[1px] border-b-gray-500 pb-[5px]">
                    <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>
                      Plan C
                    </Text>
                    {planC}
                  </View>
                ) : (
                  ""
                )}
                {planD ? (
                  <View className="w-full flex flex-column items-start pl-[5%] mt-[10px] mb-[5px] border-b-[1px] border-b-gray-500 pb-[5px]">
                    <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>
                      Plan D
                    </Text>
                    {planD}
                  </View>
                ) : (
                  ""
                )}
                {planE ? (
                  <View className="w-full flex flex-column items-start pl-[5%] mt-[10px] mb-[5px] border-b-[1px] border-b-gray-500 pb-[5px]">
                    <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>
                      Plan E
                    </Text>
                    {planE}
                  </View>
                ) : (
                  ""
                )}
                {planF ? (
                  <View className="w-full flex flex-column items-start pl-[5%] mt-[10px] mb-[5px] border-b-[1px] border-b-gray-500 pb-[5px]">
                    <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>
                      Plan F
                    </Text>
                    {planF}
                  </View>
                ) : (
                  ""
                )}
                {planG ? (
                  <View className="w-full flex flex-column items-start pl-[5%] mt-[10px] mb-[5px] border-b-[1px] border-b-gray-500 pb-[5px]">
                    <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>
                      Plan G
                    </Text>
                    {planG}
                  </View>
                ) : (
                  ""
                )}
              </ScrollView>
            </View>
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
      `${process.env.REACT_APP_BACKEND}/api/${id}/deletePlan`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if (response.msg === "Deleted!") {
      setYourPlan(withoutPlan);
      setIsPlanSet(false);
      setPopUp(<></>);
      setIsPopUpDeleteShowed(false);
      await AsyncStorage.removeItem("plan");
    }
  };
  const showImportPlanPopUpFn = (): void => {
    setShowImportPlanPopUp(true);
  };
  const setImportPlan = async (userId: string): Promise<void> => {
    if (!userId) return;
    const id = await AsyncStorage.getItem("id");
    await fetch(`${process.env.REACT_APP_BACKEND}/api/${id}/setSharedPlan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((res) => res)
      .catch((err) => console.log(err));
    setShowImportPlanPopUp(false);
    setIsPlanSet(true);
  };

  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <ImageBackground
      className="flex-1 flex justify-center items-center opacity-100 w-[98%] mx-[1%] h-[79%]"
      source={backgroundLogo}
    >
      <View className="h-[99%] relative w-full">
        {!isPlanSet ? <>{yourPlan}</> : <>{yourPlan}</>}
        {popUp}
        {viewLoading ? <ViewLoading /> : ""}
        {showImportPlanPopUp ? (
          <ImportPlanPopUp setImportPlan={setImportPlan} />
        ) : (
          ""
        )}
      </View>
    </ImageBackground>
  );
};
export default TrainingPlan;

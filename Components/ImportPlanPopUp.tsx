import { TextInput, TouchableOpacity, View, Text } from "react-native";
import ImportPlanPopUpProps from "./props/ImportPlanPopUpProps";
import { useEffect, useState } from "react";
import { ImportPlanPopUpStyles } from "./styles/ImportPlanPopUpStyles";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";

import { Teko_700Bold } from "@expo-google-fonts/teko";
import { useFonts } from "expo-font";
import ViewLoading from "./ViewLoading";
const ImportPlanPopUp: React.FC<ImportPlanPopUpProps> = (props) => {
  const [userId, setUserId] = useState<string>();
  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
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
  const importPlan = (): void => {
    props.setImportPlan(userId as string);
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <View style={ImportPlanPopUpStyles.importPlanPopUp}>
      <Text style={{ fontFamily: "Teko_700Bold", ...ImportPlanPopUpStyles.h2 }}>
        If you want to copy someone plan you need to have a userId!
      </Text>
      <TextInput
        style={ImportPlanPopUpStyles.input}
        placeholder="UserID"
        onChangeText={(text: string | "") => setUserId(text)}
      ></TextInput>
      <TouchableOpacity
        style={ImportPlanPopUpStyles.button}
        onPress={() => importPlan()}
      >
        <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>COPY!</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ImportPlanPopUp;

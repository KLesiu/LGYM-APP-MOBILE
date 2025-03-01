import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { View, Text } from "react-native";
import EloRegistryChart from "./dedicated/EloRegistryChart";
import ExerciseScoresChart from "./dedicated/ExerciseScoresChart";
import TabView from "../../elements/TabView";
import { useState } from "react";
interface ChartsProps {
  toggleMenuButton: (hide: boolean) => void;
}

const Charts: React.FC<ChartsProps> = () => {
  const [currentTab, setCurrentTab] = useState<JSX.Element>(
    <EloRegistryChart />
  );
  const setActiveComponent = (component: JSX.Element) => {
    setCurrentTab(component);
  };
  return (
    <BackgroundMainSection>
      <View className="flex flex-col p-4" style={{ gap: 16 }}>
        <Text
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
          className="text-2xl font-bold text-primaryColor"
        >
          Dashboard
        </Text>
        <TabView
          tabs={[
            { label: "Elo Points", component: <EloRegistryChart /> },
            { label: "Exercises", component: <ExerciseScoresChart /> },
          ]}
          onTabChange={setActiveComponent}
        />
        <View className="w-full h-3/4 mt-4">{currentTab}</View>
      </View>
    </BackgroundMainSection>
  );
};

export default Charts;

import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { View } from "react-native";
import EloRegistryChart from "./dedicated/EloRegistryChart";
import ExerciseScoresChart from "./dedicated/ExerciseScoresChart";
interface ChartsProps {
  toggleMenuButton: (hide: boolean) => void;
}

const Charts: React.FC<ChartsProps> = () => {

  return (
    <BackgroundMainSection>
      <View className="flex flex-col p-4" style={{gap:16}}>
         <EloRegistryChart  />
         <ExerciseScoresChart />
      </View>
    </BackgroundMainSection>
  );
};

export default Charts;

import { View } from "react-native";
import UsersRanking from "./UsersRanking";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import LastTrainingStartInfo from "./LastTrainingStartInfo";
import ProgressInfo from "./ProgressInfo";
import Card from "../../elements/Card";

const Start: React.FC = () => {
  return (
    <BackgroundMainSection>
      <View style={{ gap: 8 }} className="flex h-full w-full flex-col">
        <LastTrainingStartInfo />
        <ProgressInfo />
        <UsersRanking />
      </View>
    </BackgroundMainSection>
  );
};
export default Start;

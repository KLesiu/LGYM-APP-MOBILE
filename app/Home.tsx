import { View } from "react-native";
import { useEffect, useState } from "react";
import Menu from "./components/layout/Menu";
import Header from "./components//layout/Header";
import Loading from "./components/elements/Loading";
import { BackHandler } from "react-native";
import Start from "./components/home/start/Start";
import HomeProvider from "./components/home/HomeContext";
const Home: React.FC = () => {
  const [view, setView] = useState<JSX.Element>(<View></View>);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  const changeView = (view: JSX.Element) => {
    setView(view);
  };
  const offLoading = () => {
    setIsLoading(false);
  };

  const handleBackButton = () => {
    setView(<Start />);
    return true;
  };

  return (
    <View className="bg-bgColor flex flex-col justify-between relative h-full ">
      <HomeProvider viewChange={changeView}>
        {view.type.name === "Profile" ? "" : <Header />}
        {view}
        <Menu viewChange={changeView} />
      </HomeProvider>

      {isLoading ? <Loading offLoading={offLoading} /> : ""}
    </View>
  );
};
export default Home;

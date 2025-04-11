import { View } from "react-native";
import { useState } from "react";
import Menu from "./components/layout/Menu";
import Header from "./components//layout/Header";
import Loading from "./components/elements/Loading";
import HomeProvider, { useHomeContext } from "./components/home/HomeContext";
const Home: React.FC = () => {
  const [view, setView] = useState<JSX.Element>(<View></View>);
  const [isHeaderShow, setIsHeaderShow] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const changeView = (view: JSX.Element) => {
    setView(view);
  };
  const changeHeaderVisibility = (isVisible: boolean) => {
    setIsHeaderShow(isVisible);
  }
  const offLoading = () => {
    setIsLoading(false);
  };

  return (
    <View className="bg-bgColor flex flex-col justify-between relative h-full ">
      {isLoading ? <Loading offLoading={offLoading} /> : ""}
      <HomeProvider viewChange={changeView} changeHeaderVisibility={changeHeaderVisibility}>
        {isHeaderShow ? <Header /> : ""}
        {view}
        <Menu/>
      </HomeProvider>

    </View>
  );
};
export default Home;

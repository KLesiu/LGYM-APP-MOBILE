import { SafeAreaView, View } from "react-native";
import { useState } from "react";
import Menu from "./components/layout/Menu";
import Header from "./components//layout/Header";
import Loading from "./components/elements/Loading";
import HomeProvider from "./components/home/HomeContext";
import Start from "./components/home/start/Start";
const Home: React.FC = () => {
  const [view, setView] = useState<JSX.Element>();
  const [isHeaderShow, setIsHeaderShow] = useState<boolean>(true);

  const changeView = (view?: JSX.Element) => {
    setView(view ?? <Start />);
  };
  const changeHeaderVisibility = (isVisible: boolean) => {
    setIsHeaderShow(isVisible);
  };

  return (
    <SafeAreaView>
      <View className="bg-bgColor flex flex-col justify-between relative h-full ">
        <HomeProvider
          viewChange={changeView}
          changeHeaderVisibility={changeHeaderVisibility}
        >
          {isHeaderShow && <Header />}
          {view}
          <Menu />
        </HomeProvider>
        {!view && <Loading />}
      </View>
    </SafeAreaView>
  );
};
export default Home;

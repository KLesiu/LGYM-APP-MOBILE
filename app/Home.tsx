import { View } from "react-native";
import React, { JSX } from "react";
import { useState } from "react";
import Menu from "./components/layout/Menu";
import Header from "./components//layout/Header";
import Loading from "./components/elements/Loading";
import HomeProvider from "./components/home/HomeContext";
import Start from "./components/home/start/Start";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView className="bg-bgColor flex-1">
      <View className="bg-bgColor flex flex-col justify-between relative h-full ">
        <HomeProvider
          viewChange={changeView}
          changeHeaderVisibility={changeHeaderVisibility}
        >
          <Header viewChange={changeView} isHeaderShow={isHeaderShow} />
          {view}
          <Menu />
        </HomeProvider>
        {!view && <Loading />}
      </View>
    </SafeAreaView>
  );
};
export default Home;

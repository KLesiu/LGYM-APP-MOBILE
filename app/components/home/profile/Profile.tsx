import { Pressable, Text, View } from "react-native";
import { useState, useEffect, JSX } from "react";
import ProfileRank from "../../elements/ProfileRank";
import MainProfileInfo from "./MainProfileInfo";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import TabView from "../../elements/TabView";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";
import BackIcon from "./../../../../img/icons/backIcon.svg"
import Start from "../start/Start";

interface ProfileProps{
  changeView:(component?: React.JSX.Element | undefined) => void
}

const Profile: React.FC<ProfileProps> = ({ changeView }) => {
  const { toggleMenuButton,hideMenu } = useHomeContext();

  const { userInfo } = useAppContext();


  useEffect(() => {
    if (!userInfo) return;
    toggleMenuButton(true);
  }, [userInfo]);


  const goBack = ()=>{
    changeView(<Start/>)
    hideMenu()
    toggleMenuButton(false)
  }

  return (
    <BackgroundMainSection>
      { !userInfo || !changeView ? (
        <ViewLoading />
      ) : (
        <View className="w-full h-full p-4 relative  flex flex-col flex-1 ">
          <Pressable
            onPress={goBack}
            style={{ borderRadius: 10000 }}
            className="absolute flex items-center left-4 justify-center w-8 h-8  bg-secondaryColor "
          >
            <BackIcon />
          </Pressable>
          <View style={{ gap: 8 }} className="flex items-center flex-col px-6">
            <View className="flex ">
              <ProfileRank rank={userInfo.profileRank} />
            </View>
            <View className="flex flex-col items-center">
              <Text
                className="text-primaryColor font-bold w-full text-center text-2xl smallPhone:text-lg "
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {userInfo.name}
              </Text>
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light text-sm smallPhone:text-xs"
              >
                {userInfo.profileRank}
              </Text>
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light text-sm smallPhone:text-xs"
              >
                {userInfo.elo} Elo
              </Text>
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light text-sm smallPhone:text-xs"
              >
                Member since: {userInfo.createdAt.toString().slice(0, 10)}
              </Text>
            </View>
          </View>
          <MainProfileInfo email={userInfo.email} isVisibleInRanking={userInfo.isVisibleInRanking} />
        </View>
      )}
    </BackgroundMainSection>
  );
};
export default Profile;

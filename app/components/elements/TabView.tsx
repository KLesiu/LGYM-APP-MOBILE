import React, { JSX, useState } from "react";
import { Pressable, View, Text } from "react-native";

interface Tab {
  label: string;
  component: JSX.Element;
}

interface TabViewProps {
  tabs: Tab[];
  onTabChange: (component: JSX.Element) => void;
}

const TabView: React.FC<TabViewProps> = ({ tabs, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[0]);

  const handleTabPress = (tab: Tab) => {
    setCurrentTab(tab);
    onTabChange(tab.component);
  };

  return (
    <View className="w-full">
      <View className="h-12 smallPhone:h-10 flex flex-row pr-6 border-b border-fifthColor">
        {tabs.map((tab, index) => {
          const isActive = currentTab.label === tab.label;
          return (
            <Pressable
              key={index}
              className={`flex flex-row justify-center items-center flex-1 ${isActive? 'border-primaryColor'  :' border-secondaryColor'} border-b-2`}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                className={`font-light text-sm smallPhone:text-xs text-center ${isActive? 'text-primaryColor'  :' text-fifthColor'}`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TabView;
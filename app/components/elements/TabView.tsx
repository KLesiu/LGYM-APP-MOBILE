import React, { useState } from "react";
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
      <View className="h-12 flex flex-row pr-6 border-b border-gray-700">
        {tabs.map((tab, index) => {
          const isActive = currentTab.label === tab.label;
          return (
            <Pressable
              key={index}
              className="flex flex-row justify-center items-center flex-1"
              style={{ borderBottomColor: isActive ? "#94e798" : "#0A0A0A", borderBottomWidth: 2 }}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                className="text-gray-200/80 font-light text-sm text-center"
                style={{ color: isActive ? "#94e798" : "#E5E7EB" }}
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
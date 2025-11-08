import React from "react";
import { View, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface SearchBoxProps {
  onChangeText: (text: string) => void;
  value: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onChangeText, value }) => {
  return (
    <View className="w-full flex-row items-center px-2 py-2 bg-cardColor rounded-lg">
      <Ionicons
        name="search-outline"
        size={24}
        color="gray"
        style={{ marginRight: 8 }}
      />
      <TextInput
        placeholder="Search..."
        placeholderTextColor="gray"
        style={{
          fontFamily: "OpenSans_400Regular",
          flex: 1,
        }}
        className="text-textColor"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBox;

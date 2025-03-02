import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { DropdownItem } from "../../../interfaces/Dropdown";

interface AutoCompleteProps {
  data: DropdownItem[];
  value?: string | null;
  valueId?: string | null;
  onSelect: (item: DropdownItem) => void;
  onClearQuery?: () => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  data,
  value,
  valueId,
  onSelect,
  onClearQuery,
}) => {
  const [query, setQuery] = useState(value || "");
  const [filteredData, setFilteredData] = useState<DropdownItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelected, setIsSelected] = useState(false);


  useEffect(() => {
    if (value && valueId) {
      const item = data.find((item) => item.value === valueId);
      if (item) {
        setQuery(item.label);
        setIsSelected(true);
      }
    }
  }, [value, valueId]);

  useEffect(() => {
    if (query.length > 0 && !isSelected) {
      const filtered = data.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered.length ? filtered : data);
      setShowDropdown(true);
    } else {
      setFilteredData([]);
      setShowDropdown(false);
    }
  }, [query, data]);

  useEffect(() => {
    if (onClearQuery) {
      setQuery("");
      onClearQuery();
      setShowDropdown(false);
    }
  }, [onClearQuery]);

  const handleSelect = (item: DropdownItem) => {
    setIsSelected(true)
    onSelect(item);
    setQuery(item.label);
    setShowDropdown(false);
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity className="p-4 border-b-[1px] border-b-[#ddd]" onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        style={{
          fontFamily: "OpenSans_400Regular",
          backgroundColor: "rgb(30, 30, 30)",
          borderRadius: 8,
        }}
        className=" w-full  px-2 py-4 text-white  "
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowDropdown(true);
          setIsSelected(false);
        }}
      />

      {showDropdown && filteredData.length > 0 && (
        <View className="max-h-40 bg-white border-[1px] border-[#ddd] rounded-lg mt-1">
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.value.toString()}
          />
        </View>
      )}
    </View>
  );
};

export default AutoComplete;

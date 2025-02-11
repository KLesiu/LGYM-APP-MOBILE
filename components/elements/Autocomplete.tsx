import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { DropdownItem } from "../../interfaces/Dropdown";

interface AutoCompleteProps {
  data: DropdownItem[];
  value?: string | null;
  valueId?: string | null;
  onSelect: (item: DropdownItem) => void;
  onClearQuery?: () => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ data, value,valueId, onSelect, onClearQuery }) => {
  const [query, setQuery] = useState(value || "");
  const [filteredData, setFilteredData] = useState<DropdownItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value && valueId) {
      setQuery(value);
      const selectedItem = data.find(item => item.value === valueId);
      if (selectedItem) {
        handleSelect(selectedItem);
      }
    }
  }, [value]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = data.filter(item =>
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
    setQuery(item.label);
    onSelect(item);
    setShowDropdown(false);
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowDropdown(true);
        }}
      />

      {showDropdown && filteredData.length > 0 && (
        <View style={styles.dropdown}>
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

const styles = StyleSheet.create({
  input: {
    fontFamily: "OpenSans_400Regular",
    backgroundColor: "rgba(30, 30, 30, 0.45)",
    borderRadius: 8,
    padding: 10,
    color: "white",
  },
  dropdown: {
    maxHeight: 150,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    elevation: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default AutoComplete;

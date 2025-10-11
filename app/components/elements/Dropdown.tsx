import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { DropdownItem } from "../../../interfaces/Dropdown";

interface CustomDropdownProps {
  data: DropdownItem[];
  value?: string | null;
  onSelect: (item: DropdownItem | null) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ data, value, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  useEffect(() => {
    if (value) {
      const selected = data.find((item) => item.value === value);
      setSelectedItem(selected || null);
    } else {
      setSelectedItem(null);
    }
  }, [value, data]);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleSelect = (item: DropdownItem | null) => {
    setSelectedItem(item);
    onSelect(item); 
    setIsVisible(false);
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text className=" text-md smallPhone:text-base">
          {selectedItem ? selectedItem.label : "Choose option"}
        </Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={toggleDropdown}>
          <View style={styles.dropdown}>
            <FlatList
              data={[{ label: "Clear selection", value: "" }, ...data]} 
              renderItem={({ item }) =>
                item.value === "" ? (
                  <TouchableOpacity style={[styles.item, styles.clearItem]} onPress={() => handleSelect(null)}>
                    <Text style={{ color: "black" }}>Clear selection</Text>
                  </TouchableOpacity>
                ) : (
                  renderItem({ item })
                )
              }
              keyExtractor={(item) => item.value.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  dropdown: {
    width: 200,
    backgroundColor: "#20BC2D",
    borderRadius: 8,
    elevation: 5,
  },
  item: {
    padding: 16,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  clearItem: {
    backgroundColor: "#f8d7da",
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius:8},
});

export default CustomDropdown;

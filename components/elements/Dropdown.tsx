import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { DropdownItem } from "../../interfaces/Dropdown";

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
        <Text style={styles.buttonText}>
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
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  dropdown: {
    width: 200,
    backgroundColor: "#94e798",
    borderRadius: 5,
    elevation: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  clearItem: {
    backgroundColor: "#f8d7da",
    alignItems: "center",
  },
});

export default CustomDropdown;

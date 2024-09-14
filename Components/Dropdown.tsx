import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

// Typy dla elementów w dropdownie
export interface DropdownItem {
  label: string;
  value: string;
}

// Typy dla propsów komponentu CustomDropdown
interface CustomDropdownProps {
  data: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ data, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false); // kontroluje widoczność dropdownu
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null); // kontroluje wybrany element

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item); // Ustaw wybrany element
    onSelect(item);        // Wywołaj funkcję przekazaną z zewnątrz
    setIsVisible(false);   // Zamknij dropdown po wyborze
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Przycisk do otwarcia dropdownu */}
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>
          {selectedItem ? selectedItem.label : 'Wybierz opcję'} {/* Tekst przycisku */}
        </Text>
      </TouchableOpacity>

      {/* Dropdown jako Modal */}
      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={toggleDropdown}> {/* Kliknięcie poza zamyka dropdown */}
          <View style={styles.dropdown}>
            <FlatList
              data={data}           // Przekazane dane
              renderItem={renderItem} // Funkcja renderująca opcję
              keyExtractor={(item) => item.value.toString()} // Klucz do listy
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
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    width: 200,
    backgroundColor: '#4CD964',
    borderRadius: 5,
    elevation: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default CustomDropdown;

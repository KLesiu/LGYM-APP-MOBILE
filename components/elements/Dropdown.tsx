import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { DropdownItem } from '../../interfaces/Dropdown';

// Typy dla propsów komponentu CustomDropdown
interface CustomDropdownProps {
  data: DropdownItem[];          // Lista dostępnych opcji
  value?: string | null;         // Wartość, którą można wstrzyknąć z zewnątrz
  onSelect: (item: DropdownItem) => void; // Funkcja obsługująca wybór
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ data, value, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false); // kontroluje widoczność dropdownu
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null); // kontroluje wybrany element

  // Efekt, który synchronizuje wewnętrzny stan z wartością przekazaną z zewnątrz
  useEffect(() => {
    if (value) {
      const selected = data.find(item => item.value === value);
      setSelectedItem(selected || null);
    }
  }, [value, data]);

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
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>
          {selectedItem ? selectedItem.label : 'Choose option'}
        </Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={toggleDropdown}> 
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
    backgroundColor: '#94e798',
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

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// Typy dla elementów w autocomplete
export interface DropdownItem {
  label: string;
  value: string;
}

// Typy dla propsów komponentu AutoComplete
interface AutoCompleteProps {
  data: DropdownItem[];          // Lista dostępnych opcji
  value?: string | null;         // Wartość, którą można wstrzyknąć z zewnątrz
  onSelect: (item: DropdownItem) => void; // Funkcja obsługująca wybór
  onClearQuery?: () => void;     // Funkcja do wyczyszczenia query
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ data, value, onSelect, onClearQuery }) => {
  const [query, setQuery] = useState('');            // tekst wpisany przez użytkownika
  const [filteredData, setFilteredData] = useState<DropdownItem[]>([]); // przefiltrowane dane
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null); // kontroluje wybrany element

  // Efekt, który synchronizuje wewnętrzny stan z wartością przekazaną z zewnątrz
  useEffect(() => {
    if (value) {
      const selected = data.find(item => item.value === value);
      setSelectedItem(selected || null);
    }
  }, [value, data]);

  // Efekt do filtrowania danych na podstawie wpisywanego tekstu
  useEffect(() => {
    if (query.length > 0) {
      const filtered = data.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      if(selectedItem?.label === query) return;
      if(!filtered.length) return setFilteredData(data);
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [query, data]);

  useEffect(() => {
    if (onClearQuery) {
      setQuery('');  // Reset query
      onClearQuery();  // Wywołanie funkcji resetującej w CreatePlanDay
    }
  }, [onClearQuery]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item); // Ustaw wybrany element
    setQuery(item.label);  // Ustaw wybrany tekst w polu tekstowym
    onSelect(item);        // Wywołaj funkcję przekazaną z zewnątrz
    setFilteredData([]);   // Zamknij listę po wyborze
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Pole tekstowe dla AutoComplete */}
      <TextInput
        style={{
          fontFamily: "OpenSans_400Regular",
          backgroundColor: "rgba(30, 30, 30, 0.45)",
        }}
        className=" w-full  px-2 py-4 text-white rounded-lg "
        value={query}
        onChangeText={setQuery}
      />

      {/* Dropdown pod polem tekstowym */}
      {filteredData.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredData}    // Przefiltrowane dane
            renderItem={renderItem} // Funkcja renderująca opcję
            keyExtractor={(item) => item.value.toString()} // Klucz do listy
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    maxHeight: 150, // Ogranicz wysokość listy, jeśli jest wiele opcji
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    elevation: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default AutoComplete;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { DropdownItem } from '../../interfaces/Dropdown';

interface AutoCompleteProps {
  data: DropdownItem[];          
  value?: string | null;       
  onSelect: (item: DropdownItem) => void; 
  onClearQuery?: () => void;   
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ data, value, onSelect, onClearQuery }) => {
  const [query, setQuery] = useState('');  
  const [filteredData, setFilteredData] = useState<DropdownItem[]>([]); 
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null); 

  useEffect(() => {
    if (value) {
      const selected = data.find(item => item.value === value);
      setSelectedItem(selected || null);
    }
  }, [value, data]);

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
      setQuery('');  
      onClearQuery();  
    }
  }, [onClearQuery]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item); 
    setQuery(item.label);  
    onSelect(item);      
    setFilteredData([]);   
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        style={{
          fontFamily: "OpenSans_400Regular",
          backgroundColor: "rgba(30, 30, 30, 0.45)",
          borderRadius:8
        }}
        
        className=" w-full  px-2 py-4 text-white  "
        value={query}
        onChangeText={setQuery}
      />

      {filteredData.length > 0 && (
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
  dropdown: {
    maxHeight: 150,
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

import React, { useMemo, useState } from "react";
import { ScrollView,  View } from "react-native";
import { BodyParts } from "../../../../enums/BodyParts";
import BodyPartsListElement from "./BodyPartsListElement";
import SearchBox from "../../elements/SearchBox";

interface BodyPartsListProps {
    onSelectBodyPart: (bodyPart: BodyParts) => void;
}

const BodyPartsList: React.FC<BodyPartsListProps> = ({ onSelectBodyPart }) => {
  const [searchText, setSearchText] = useState<string>("");

  const allBodyParts = useMemo(
    () => Object.values(BodyParts).map((item) => item),
    []
  );

  const filteredBodyParts = useMemo(() => {
    if (!searchText) {
      return allBodyParts;
    }
    const lowercasedSearchText = searchText.toLowerCase();
    return allBodyParts.filter((bodyPart) =>
      bodyPart.toLowerCase().includes(lowercasedSearchText)
    );
  }, [allBodyParts, searchText]);

  return (
    <View className="flex flex-col p-4 flex-1" style={{ gap: 16 }}>
      <SearchBox onChangeText={setSearchText} value={searchText} />
      <ScrollView className="mb-10 flex-1">
        {filteredBodyParts.map((bodyPart) => (
          <BodyPartsListElement
            key={bodyPart}
            bodyPart={bodyPart}
            onSelectBodyPart={onSelectBodyPart}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default BodyPartsList;

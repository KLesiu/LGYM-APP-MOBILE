import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import BodyPartsListElement from "./BodyPartsListElement";
import SearchBox from "../../elements/SearchBox";
import {
  getGetApiEnumsEnumTypeQueryKey,
  useGetApiEnumsEnumType,
} from "../../../../api/generated/enum/enum";
import ViewLoading from "../../elements/ViewLoading";
import { useTranslation } from "react-i18next";

import { EnumLookupDto, EnumLookupResponseDto } from "../../../../api/generated/model";
import { hasExerciseBodyPartImage } from "../../elements/BodyPartImage";

interface BodyPartsListProps {
  onSelectBodyPart: (bodyPart: EnumLookupDto) => void;
}

const BodyPartsList: React.FC<BodyPartsListProps> = ({ onSelectBodyPart }) => {
  const [searchText, setSearchText] = useState<string>("");
  const { i18n } = useTranslation();

  const { data, isLoading } = useGetApiEnumsEnumType("BodyParts", {
    query: {
      queryKey: [
        ...getGetApiEnumsEnumTypeQueryKey("BodyParts"),
        i18n.language,
      ],
    },
  });

  const allBodyParts = useMemo(() => {
    const responseData = data?.data as EnumLookupResponseDto;
    if (responseData && responseData.values) {
      return responseData.values.filter((item) => hasExerciseBodyPartImage(item.name));
    }
    return [];
  }, [data]);

  const filteredBodyParts = useMemo(() => {
    if (!searchText) {
      return allBodyParts;
    }
    const lowercasedSearchText = searchText.toLowerCase();
    return allBodyParts.filter((bodyPart) =>
      bodyPart.displayName!.toLowerCase().includes(lowercasedSearchText)
    );
  }, [allBodyParts, searchText]);

  if (isLoading) {
    return <ViewLoading />;
  }

  return (
    <View className="flex flex-col p-4 flex-1 w-full" style={{ gap: 16 }}>
      <SearchBox onChangeText={setSearchText} value={searchText} />
      <ScrollView
        className="mb-10 flex-1 w-full"
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {filteredBodyParts.map((bodyPart) => (
          <BodyPartsListElement
            key={bodyPart.name}
            bodyPart={bodyPart}
            onSelectBodyPart={onSelectBodyPart}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default BodyPartsList;

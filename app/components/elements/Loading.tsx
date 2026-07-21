import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext";
import React from "react";
import BrandMark from "../branding/BrandMark";

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  const [width, setWidth] = useState<number>(0);
  const { isLoading } = useAppContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => changeWidth(width), 300);
    return () => clearTimeout(timeoutId);
  }, [width]);

  const changeWidth = (currentWidth: number) => {
    if (currentWidth >= 100) return setWidth(0);
    setWidth(currentWidth + 10);
  };

  return (
    isLoading && (
      <View className="absolute h-full w-full items-center justify-center bg-bgColor px-8 z-[6]">
        <BrandMark
          size={92}
          layout="vertical"
          subtitle="Przygotowywanie danych"
        />
        <View className="mt-16 w-full" style={{ gap: 10 }}>
          <View className="h-2 w-full overflow-hidden rounded-full bg-secondaryColor">
            <View
              style={{ width: `${width}%` }}
              className="h-full rounded-full bg-primaryColor"
            />
          </View>
          <Text
            className="text-center text-xs text-fifthColor"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Trwa synchronizacja aplikacji
          </Text>
        </View>
      </View>
    )
  );
};

export default Loading;

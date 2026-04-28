import logoLGYM from './../../../assets/logoLGYMNewX.png';
import { Image, View } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../AppContext';
import React from 'react';
const Loading: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const { isLoading } = useAppContext();

  const changeWidth = useCallback((nextWidth: number) => {
    if (nextWidth >= 100) return setWidth(0);
    setWidth(nextWidth + 10);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => changeWidth(width), 300);
    return () => clearTimeout(timeoutId);
  }, [changeWidth, width]);

  return (
    isLoading && (
      <View className="bg-bgColor h-full  w-full absolute flex flex-col items-center z-[6]">
        <Image source={logoLGYM} className="w-[70%] h-[40%]" />
        <View className="flex flex-col mx-[5%] mt-[40%] w-[90%]">
          <View
            style={{ borderRadius: 12 }}
            className="border-[2px] border-secondaryColor w-full  h-1/5"
          >
            <View
              style={{
                width: `${width}%`,
                borderRadius: 12,
              }}
              className="bg-primaryColor  h-full z-[7]"
            ></View>
          </View>
        </View>
      </View>
    )
  );
};
export default Loading;

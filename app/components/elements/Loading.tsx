import logoLGYM from "./../../../img/logoLGYM.png";
import { Text, Image, View } from "react-native";
import { useState, useEffect } from "react";
interface LoadingProps{
  offLoading: VoidFunction
}

const Loading: React.FC<LoadingProps> = (props) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (width === 100) return props.offLoading();
    setTimeout(() => changeWidth(width), 300);
  }, [width]);
  const changeWidth = (width: number) => {
    setWidth(width + 10);
  };

  return (
    <View className="bg-[#F0EFF2] h-full  w-full absolute flex flex-col items-center z-[6]" >
      
      <View className="flex flex-col justify-center h-full mx-[5%] w-[90%]">
        <View style={{borderRadius:12}} className="border-[2px] border-gray-500 w-full  h-10">
          <View
            style={{
              width: `${width}%`,
              borderRadius:12
            }}
            className="bg-gray-500  h-full z-[7]"
          ></View>
        </View>
        <Text
          style={{
            fontFamily: "Caveat_400Regular"
          }}
          className="text-[40px] text-[#141414] text-center w-full mt-12"
        >
          Loading...
        </Text>
      </View>
    </View>
  );
};
export default Loading;

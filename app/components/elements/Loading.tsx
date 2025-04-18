import logoLGYM from "./../../../assets/logoLGYMNew.png"
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
    <View className="bg-bgColor h-full  w-full absolute flex flex-col items-center z-[6]" >
      <Image source={logoLGYM} className="w-[70%] h-[40%]" />
      <View className="flex flex-col mx-[5%] mt-[40%] w-[90%]">
        <View style={{borderRadius:12}} className="border-[2px] border-secondaryColor w-full  h-1/5">
          <View
            style={{
              width: `${width}%`,
              borderRadius:12
            }}
            className="bg-primaryColor  h-full z-[7]"
          ></View>
        </View>
        <Text
          style={{
            fontFamily: "Caveat_400Regular"
          }}
          className="text-[40px] text-white text-center w-full mt-12"
        >
          Loading...
        </Text>
      </View>
    </View>
  );
};
export default Loading;

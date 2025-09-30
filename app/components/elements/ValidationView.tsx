import { View, Text } from "react-native";
import { useAppContext } from "../../AppContext";
import { useEffect } from "react";
import React from "react";
interface ValidationViewProps {}

const ValidationView: React.FC<ValidationViewProps> = () => {
  const { errors,setErrors } = useAppContext();

  useEffect(()=>{
    return()=>{
    setErrors([]); 
    }
  },[])

  return (
    <>
      {errors && errors.length ? (
        <View className="flex flex-col items-center" style={{ gap: 4 }}>
          {errors.map((error, index) => (
            <Text
              key={index}
              className="text-sm smallPhone:text-[10px] text-red-400"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {error}
            </Text>
          ))}
        </View>
      ) : null}
    </>
  );
};

export default ValidationView;

import { Text,View} from "react-native";
import React from 'react';

const MiniLoading:React.FC=()=>{
    return(
        <View className="w-full flex flex-row items-center justify-center mt-5">
            <Text className="text-xl text-white" style={{fontFamily:'Teko_700Bold'}}>Loading...</Text>
        </View>
    )
}
export default MiniLoading
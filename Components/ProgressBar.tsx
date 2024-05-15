import { View,Text } from "react-native"
import ProgressBarProps from "./props/ProgressBarProps"

const ProgressBar: React.FC<ProgressBarProps> = (props)=>{
    return(
        <View className="w-30 h-10 border-[#4CD964] border-4 p-1 rounded-lg">
            <View className="w-full h-full bg-white" style={{width:`${props.width}%`}}></View>
        </View>
    )
}

export default ProgressBar
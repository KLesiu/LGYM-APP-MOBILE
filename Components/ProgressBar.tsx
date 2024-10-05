import { View,Text } from "react-native"
import ProgressBarProps from "./props/ProgressBarProps"

const ProgressBar: React.FC<ProgressBarProps> = (props)=>{
    return(
        <View className="w-28 h-6 border-[#94e798] border-4 p-1 rounded-lg">
            <View className="w-full h-full bg-white" style={{width:`${props.width}%`}}></View>
        </View>
    )
}

export default ProgressBar
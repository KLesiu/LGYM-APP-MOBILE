import React from "react";
import { BodyParts } from "../../../../enums/BodyParts";
import { Text,Image} from "react-native";
import Card from "../../elements/Card";
import BodyPartImage from "../../elements/BodyPartImage";

interface BodyPartsListElementProps{
    bodyPart:BodyParts,
    onSelectBodyPart: (bodyPart: BodyParts) => void;
}

const BodyPartsListElement:React.FC<BodyPartsListElementProps> =({bodyPart, onSelectBodyPart})=>{
   return(
    <Card customClasses="flex items-center mb-2" onPress={()=>onSelectBodyPart(bodyPart)}>
        <Text className="font-bold text-xl  text-textColor" style={{fontFamily: "OpenSans_700Bold"}}>{bodyPart}</Text>
        <BodyPartImage bodyPart={bodyPart} />
    </Card>
   )

   
}
export default BodyPartsListElement;
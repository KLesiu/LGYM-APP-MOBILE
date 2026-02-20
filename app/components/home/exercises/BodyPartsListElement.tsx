import React from "react";
import { BodyParts } from "../../../../enums/BodyParts";
import { Text,Image} from "react-native";
import Card from "../../elements/Card";
import BodyPartImage from "../../elements/BodyPartImage";
import { EnumLookupDto } from "../../../../api/generated/model";

interface BodyPartsListElementProps{
    bodyPart:EnumLookupDto,
    onSelectBodyPart: (bodyPart: EnumLookupDto) => void;
}

const BodyPartsListElement:React.FC<BodyPartsListElementProps> =({bodyPart, onSelectBodyPart})=>{
   return(
    <Card customClasses="flex items-center mb-2" onPress={()=>onSelectBodyPart(bodyPart)}>
        <Text className="font-bold text-xl  text-textColor" style={{fontFamily: "OpenSans_700Bold"}}>{  bodyPart.displayName}</Text>
        <BodyPartImage bodyPart={bodyPart.name as BodyParts} />
    </Card>
   )

   
}
export default BodyPartsListElement;
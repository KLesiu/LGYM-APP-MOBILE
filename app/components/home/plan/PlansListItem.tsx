import { View,Text, Pressable } from "react-native";
import { PlanForm } from "../../../../interfaces/Plan";
import Card from "../../elements/Card";

interface PlansListItemProps {
  planListItem: PlanForm;
      setNewPlanConfig: (planConfig: PlanForm) => Promise<void>

}

const PlansListItem: React.FC<PlansListItemProps> = ({ planListItem,setNewPlanConfig }) => {
  return (
    <Pressable onPress={()=>setNewPlanConfig(planListItem)}>
      <Card>
        <View className="flex flex-col">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className=" text-xl smallPhone:text-lg font-bold text-white"
          >
            {planListItem.name}
          </Text>
        </View>
      </Card>
    </Pressable>
   
  );
};

export default PlansListItem;

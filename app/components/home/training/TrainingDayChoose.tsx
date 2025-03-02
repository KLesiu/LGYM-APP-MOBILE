import { PlanDayChoose } from "./../../../../interfaces/PlanDay";
import Dialog from "../../elements/Dialog";
import {Text, TouchableOpacity} from "react-native";
interface TrainingDayChooseProps {
    trainingTypes: PlanDayChoose[];
    showDaySection: (day: string) => Promise<void>;
}

const TrainingDayChoose: React.FC<TrainingDayChooseProps> = ({trainingTypes,showDaySection}) => {
  return (
    <Dialog>
      <Text
        className="text-3xl text-white"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Choose training day!
      </Text>
      {trainingTypes.map((ele: { _id: string; name: string }) => (
        <TouchableOpacity
          onPress={() => showDaySection(ele._id)}
          style={{ borderRadius: 12 }}
          className="items-center border-[#868686] border-[1px]  flex text-[10px] justify-center mt-5 h-[10%] opacity-100 w-[70%]"
          key={ele._id}
        >
          <Text
            className="text-white text-3xl"
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
          >
            {ele.name}
          </Text>
        </TouchableOpacity>
      ))}
    </Dialog>
  );
};

export default TrainingDayChoose

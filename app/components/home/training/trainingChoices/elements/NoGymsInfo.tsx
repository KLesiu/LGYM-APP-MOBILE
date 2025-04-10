import { View } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import ValidationView from "../../../../elements/ValidationView";

interface NoGymsInfoProps {
    goBack: () => void;
    errors: string[];
}

const NoGymsInfo: React.FC<NoGymsInfoProps> = (props) => {
  return (
    <View className="w-full flex flex-col" style={{gap: 16}}>
      <CustomButton
        text="Back"
        buttonStyleSize={ButtonSize.regular}
        buttonStyleType={ButtonStyle.cancel}
        onPress={props.goBack}
      />
      <ValidationView errors={props.errors} />
    </View>
  );
};

export default NoGymsInfo;
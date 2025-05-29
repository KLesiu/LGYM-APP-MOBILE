import { View, Text } from "react-native";
import { useAppContext } from "../../AppContext";
interface ValidationViewProps {}

const ValidationView: React.FC<ValidationViewProps> = () => {
  const { errors } = useAppContext();
  return (
    <>
      {errors && errors.length ? (
        <View className="flex flex-col items-center" style={{ gap: 4 }}>
          {errors.map((error, index) => (
            <Text
              key={index}
              className="text-sm text-red-400"
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

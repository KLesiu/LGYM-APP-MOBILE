import { View, Text } from "react-native";

interface ValidationViewProps {
  errors?: string[];
}

const ValidationView: React.FC<ValidationViewProps> = ({ errors }) => {
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

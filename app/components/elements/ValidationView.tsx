import { View, Text } from "react-native";
import { useAppContext } from "../../AppContext";
import { useEffect } from "react";
import React from "react";
interface ValidationViewProps {
  errors?: string[];
}

const ValidationView: React.FC<ValidationViewProps> = ({ errors: propErrors }) => {
  const { errors: contextErrors, setErrors } = useAppContext();

  const errorsToDisplay = propErrors && propErrors.length > 0 ? propErrors : contextErrors;

  useEffect(() => {
    return () => {
      setErrors([]);
    };
  }, []);

  return (
    <>
      {errorsToDisplay && errorsToDisplay.length ? (
        <View className="flex flex-col items-center" style={{ gap: 4 }}>
          {errorsToDisplay.map((error, index) => (
            <Text
              key={index}
              className="text-sm smallPhone:text-[10px] text-redColor"
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

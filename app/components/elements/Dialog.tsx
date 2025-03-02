import { ReactNode } from "react";
import { View } from "react-native";

interface DialogProps {
  children: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ children }) => {
  return (
    <View
      className="absolute top-0 left-0  flex flex-col w-full h-full items-center bg-bgColor"
      style={{ gap: 16 }}
    >
      {children}
    </View>
  );
};

export default Dialog;

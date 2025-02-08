import { ReactNode } from "react";
import { View } from "react-native";

interface DialogProps {
    children: ReactNode
}

const Dialog: React.FC<DialogProps> = ({children}) => {
  return (
    <View
      className="absolute top-0 left-0  flex flex-col w-full h-full p-4 items-center bg-[#121212]"
      style={{ gap: 16 }}
    >
        {children}
    </View>
  );
};

export default Dialog
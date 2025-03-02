import { Pressable, View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  customClasses?: string;
}

const Card: React.FC<CardProps> = ({ children, onPress, customClasses }) => {
  return onPress ? (
    <Pressable
      className={`w-full bg-fourthColor flex flex-row p-4 rounded-lg justify-between items-start ${customClasses}`}
      style={{ gap: 20 }}
      onPress={onPress}
    >
      {children}
    </Pressable>
  ) : (
    <View
      className={`w-full bg-fourthColor flex flex-row p-4 rounded-lg justify-between items-start ${customClasses}`}
      style={{ gap: 20 }}
    >
      {children}
    </View>
  );
};

export default Card;

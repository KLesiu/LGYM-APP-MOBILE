import { Pressable, View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  customClasses?: string;
}

const Card: React.FC<CardProps> = ({ children, onPress, customClasses = "" }) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      className={`w-full bg-fourthColor flex flex-row p-4 rounded-lg justify-between items-start border border-thirdColor ${customClasses}`}
      style={{ gap: 20 }}
      {...(onPress && { onPress })}
    >
      {children}
    </Container>
  );
};

export default Card;

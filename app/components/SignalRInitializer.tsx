import { useSignalRNotifications } from "../../hooks/useSignalRNotifications";

const SignalRInitializer: React.FC = () => {
  useSignalRNotifications();
  return null;
};

export default SignalRInitializer;

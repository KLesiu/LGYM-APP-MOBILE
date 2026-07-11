import { usePushNotifications } from "../../hooks/usePushNotifications";

const PushNotificationInitializer: React.FC = () => {
  usePushNotifications();
  return null;
};

export default PushNotificationInitializer;

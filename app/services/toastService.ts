import Toast from "react-native-toast-message";
import i18n from "../i18n";

const DEFAULT_TOAST_TIME = 4500;

const normalizeMessages = (messages: string | string[]): string[] => {
  const values = Array.isArray(messages) ? messages : [messages];

  return values.map((message) => message.trim()).filter((message) => message.length > 0);
};

const mapMessagesToDescription = (messages: string[]): string => {
  if (messages.length === 1) {
    return messages[0];
  }

  return messages.map((message) => `- ${message}`).join("\n");
};

const showError = (messages: string | string[], title = i18n.t("common.error")) => {
  const normalizedMessages = normalizeMessages(messages);

  if (!normalizedMessages.length) {
    return;
  }

  Toast.show({
    type: "error",
    text1: title,
    text2: mapMessagesToDescription(normalizedMessages),
    topOffset: 60,
    visibilityTime: DEFAULT_TOAST_TIME,
  });
};

const showSuccess = (messages: string | string[], title = i18n.t("common.success")) => {
  const normalizedMessages = normalizeMessages(messages);

  if (!normalizedMessages.length) {
    return;
  }

  Toast.show({
    type: "success",
    text1: title,
    text2: mapMessagesToDescription(normalizedMessages),
    topOffset: 60,
    visibilityTime: DEFAULT_TOAST_TIME,
  });
};

const showValidationError = (messages: string | string[]) => {
  showError(messages);
};

const hide = () => {
  Toast.hide();
};

export const toastService = {
  showError,
  showSuccess,
  showValidationError,
  hide,
};

export default toastService;

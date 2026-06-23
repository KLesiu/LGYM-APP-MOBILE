const extractMessage = (payload: unknown): string | null => {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    return payload.trim() || null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const extracted = extractMessage(item);
      if (extracted) {
        return extracted;
      }
    }

    return null;
  }

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    return (
      extractMessage(record.msg) ||
      extractMessage(record.message) ||
      extractMessage(record.error) ||
      extractMessage(record.detail) ||
      extractMessage(record.title) ||
      extractMessage(record.data) ||
      extractMessage(record.errors) ||
      null
    );
  }

  return null;
};

export const getErrorMessage = (error: any, defaultMessage: string = "An error occurred"): string => {
  const status = error?.response?.status;
  const message =
    extractMessage(error?.response?.data) ||
    extractMessage(error?.message) ||
    defaultMessage;

  // Distinguish error types by HTTP status code
  if (status === 400) {
    return `Invalid input: ${message}`;
  }
  if (status === 404) {
    return `Resource not found: ${message}`;
  }
  if (status === 403) {
    return `Access denied: ${message}`;
  }

  // For other status codes or no status, return message as-is
  return message;
};

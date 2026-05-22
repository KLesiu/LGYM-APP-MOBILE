export const getErrorMessage = (error: any, defaultMessage: string = "An error occurred"): string => {
  const status = error?.response?.status;
  const message = error?.response?.data?.msg || error?.message || defaultMessage;

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

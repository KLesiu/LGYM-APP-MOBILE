export const getErrorMessage = (error: any, defaultMessage: string = "An error occurred"): string => {
  if (error?.response?.data?.msg) {
    return error.response.data.msg;
  }
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};

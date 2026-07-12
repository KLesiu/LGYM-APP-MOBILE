import { customInstance } from "../../api/custom-instance";

export const unlinkGoogleAccount = async (): Promise<void> => {
  await customInstance<unknown>("/api/account/unlink-google", {
    method: "POST",
  });
};

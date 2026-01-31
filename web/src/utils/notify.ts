import { isAxiosError } from "axios";
import { toast } from "sonner";

export const notifySuccess = (message: string) => toast.success(message);

export const notifyError = (error: unknown) => {
  if (isAxiosError(error)) {
    let message = error?.response?.data?.message || error?.message;
    if (Array.isArray(message)) {
      message = message?.join(", ");
    }
    toast.error(message);
  }
};
